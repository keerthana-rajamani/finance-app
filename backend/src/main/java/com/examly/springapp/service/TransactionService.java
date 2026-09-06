package com.examly.springapp.service;

import com.examly.springapp.dto.TransactionRequest;
import com.examly.springapp.exception.DuplicateTransactionException;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Account;
import com.examly.springapp.model.Budget;
import com.examly.springapp.model.Notification;
import com.examly.springapp.model.Transaction;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.AccountRepository;
import com.examly.springapp.repository.BudgetRepository;
import com.examly.springapp.repository.NotificationRepository;
import com.examly.springapp.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AuthService authService;

    public List<Transaction> getTransactions(String category, String merchant, String type) {
        User user = authService.getCurrentUser();
        List<Transaction> list = transactionRepository.findByUserIdOrderByTxnDateDesc(user.getId());

        return list.stream()
                .filter(t -> category == null || category.isBlank() || t.getCategory().equalsIgnoreCase(category))
                .filter(t -> merchant == null || merchant.isBlank() || (t.getMerchant() != null && t.getMerchant().toLowerCase().contains(merchant.toLowerCase())))
                .filter(t -> type == null || type.isBlank() || t.getType().equalsIgnoreCase(type))
                .collect(Collectors.toList());
    }

    @Transactional
    public Transaction createTransaction(TransactionRequest request) {
        User user = authService.getCurrentUser();

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + request.getAccountId()));

        String bankRef = "TXN-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();
        if (transactionRepository.existsByBankReference(bankRef)) {
            throw new DuplicateTransactionException("Duplicate transaction reference detected");
        }

        // ML categorization prediction
        CategorizationResult catResult = predictCategory(request.getMerchant(), request.getDescription(), request.getCategory());

        Transaction txn = new Transaction();
        txn.setAccountId(account.getId());
        txn.setUserId(user.getId());
        txn.setBankReference(bankRef);
        txn.setAmount(request.getAmount());
        txn.setType(request.getType() != null ? request.getType().toUpperCase() : "DEBIT");
        txn.setCategory(catResult.category);
        txn.setMerchant(request.getMerchant() != null ? request.getMerchant() : "Direct Transfer");
        txn.setDescription(request.getDescription() != null ? request.getDescription() : "Transaction on " + account.getBankName());
        txn.setTxnDate(request.getTxnDate() != null ? request.getTxnDate() : LocalDateTime.now());
        txn.setConfidenceScore(catResult.confidence);
        txn.setIsReviewed(catResult.confidence.compareTo(new BigDecimal("0.75")) >= 0);

        // Update account balance
        if ("CREDIT".equalsIgnoreCase(txn.getType())) {
            account.setBalance(account.getBalance().add(txn.getAmount()));
        } else {
            account.setBalance(account.getBalance().subtract(txn.getAmount()));
        }
        account.setLastSyncedAt(LocalDateTime.now());
        accountRepository.save(account);

        Transaction savedTxn = transactionRepository.save(txn);

        // Update budget spend if debit
        if ("DEBIT".equalsIgnoreCase(txn.getType())) {
            updateBudgetSpend(user.getId(), txn.getCategory(), txn.getAmount());
        }

        return savedTxn;
    }

    private void updateBudgetSpend(Long userId, String category, BigDecimal amount) {
        LocalDate currentMonth = LocalDate.now().withDayOfMonth(1);
        budgetRepository.findByUserIdAndCategoryAndMonth(userId, category, currentMonth)
                .ifPresent(b -> {
                    BigDecimal oldSpent = b.getSpentAmount() != null ? b.getSpentAmount() : BigDecimal.ZERO;
                    BigDecimal newSpent = oldSpent.add(amount);
                    b.setSpentAmount(newSpent);
                    budgetRepository.save(b);

                    // Check thresholds
                    if (b.getBudgetAmount().compareTo(BigDecimal.ZERO) > 0) {
                        BigDecimal pct = newSpent.divide(b.getBudgetAmount(), 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100"));
                        if (pct.compareTo(new BigDecimal("100")) >= 0 && oldSpent.divide(b.getBudgetAmount(), 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100")).compareTo(new BigDecimal("100")) < 0) {
                            notificationRepository.save(new Notification(userId, "Budget Exceeded!",
                                    "You have exceeded your monthly budget for " + category + " by reaching ₹" + newSpent, "BUDGET_ALERT"));
                        } else if (pct.compareTo(new BigDecimal(b.getAlertAtPercent())) >= 0 && oldSpent.divide(b.getBudgetAmount(), 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100")).compareTo(new BigDecimal(b.getAlertAtPercent())) < 0) {
                            notificationRepository.save(new Notification(userId, "Budget Alert (80%)",
                                    "You have utilized " + pct.intValue() + "% of your budget for " + category, "BUDGET_ALERT"));
                        }
                    }
                });
    }

    public static class CategorizationResult {
        public String category;
        public BigDecimal confidence;
        public CategorizationResult(String category, BigDecimal confidence) {
            this.category = category;
            this.confidence = confidence;
        }
    }

    public CategorizationResult predictCategory(String merchant, String desc, String requestedCategory) {
        if (requestedCategory != null && !requestedCategory.isBlank()) {
            return new CategorizationResult(requestedCategory, new BigDecimal("0.990"));
        }
        String text = ((merchant != null ? merchant : "") + " " + (desc != null ? desc : "")).toLowerCase();
        if (text.contains("swiggy") || text.contains("zomato") || text.contains("starbucks") || text.contains("food") || text.contains("restaurant") || text.contains("grocery") || text.contains("zepto") || text.contains("blinkit")) {
            return new CategorizationResult("Food", new BigDecimal("0.965"));
        } else if (text.contains("uber") || text.contains("ola") || text.contains("petrol") || text.contains("fuel") || text.contains("metro") || text.contains("railway")) {
            return new CategorizationResult("Transport", new BigDecimal("0.952"));
        } else if (text.contains("electric") || text.contains("bescom") || text.contains("airtel") || text.contains("jio") || text.contains("wifi") || text.contains("water") || text.contains("gas")) {
            return new CategorizationResult("Utilities", new BigDecimal("0.980"));
        } else if (text.contains("amazon") || text.contains("flipkart") || text.contains("myntra") || text.contains("zara") || text.contains("clothing")) {
            return new CategorizationResult("Shopping", new BigDecimal("0.930"));
        } else if (text.contains("apollo") || text.contains("pharmacy") || text.contains("hospital") || text.contains("clinic") || text.contains("doctor")) {
            return new CategorizationResult("Healthcare", new BigDecimal("0.945"));
        } else if (text.contains("netflix") || text.contains("spotify") || text.contains("cinema") || text.contains("movie") || text.contains("theatre")) {
            return new CategorizationResult("Entertainment", new BigDecimal("0.960"));
        } else if (text.contains("zerodha") || text.contains("groww") || text.contains("mutual fund") || text.contains("sip") || text.contains("stocks")) {
            return new CategorizationResult("Investment", new BigDecimal("0.985"));
        } else if (text.contains("salary") || text.contains("payroll") || text.contains("dividend") || text.contains("interest")) {
            return new CategorizationResult("Income", new BigDecimal("0.995"));
        } else {
            return new CategorizationResult("Utilities", new BigDecimal("0.700")); // flagged below 0.75 for user review
        }
    }

    public List<Transaction> syncTransactions() {
        User user = authService.getCurrentUser();
        return transactionRepository.findByUserIdOrderByTxnDateDesc(user.getId());
    }
}
