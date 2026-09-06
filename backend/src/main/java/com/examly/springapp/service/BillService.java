package com.examly.springapp.service;

import com.examly.springapp.dto.BillRequest;
import com.examly.springapp.dto.TransactionRequest;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Account;
import com.examly.springapp.model.Bill;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.AccountRepository;
import com.examly.springapp.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private AuthService authService;

    public Bill addBill(BillRequest request) {
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Bill amount must be a positive number");
        }

        User user = authService.getCurrentUser();
        Bill bill = new Bill();
        bill.setUserId(user.getId());
        bill.setName(request.getName());
        bill.setCategory(request.getCategory() != null ? request.getCategory() : "Utilities");
        bill.setAmount(request.getAmount());
        int day = request.getDueDay() != null ? request.getDueDay() : 15;
        bill.setDueDay(day);

        LocalDate now = LocalDate.now();
        LocalDate dueDate = LocalDate.of(now.getYear(), now.getMonth(), Math.min(day, now.lengthOfMonth()));
        if (dueDate.isBefore(now)) {
            dueDate = dueDate.plusMonths(1);
        }
        bill.setDueDate(dueDate);
        bill.setRecurrence(request.getRecurrence() != null ? request.getRecurrence() : "MONTHLY");
        bill.setStatus("PENDING");

        return billRepository.save(bill);
    }

    public List<Bill> getUpcomingBills() {
        User user = authService.getCurrentUser();
        LocalDate today = LocalDate.now();
        LocalDate in7Days = today.plusDays(7);

        return billRepository.findByUserIdOrderByDueDayAsc(user.getId()).stream()
                .filter(b -> !"PAID".equalsIgnoreCase(b.getStatus()))
                .collect(Collectors.toList());
    }

    public List<Bill> getAllBills() {
        User user = authService.getCurrentUser();
        return billRepository.findByUserIdOrderByDueDayAsc(user.getId());
    }

    public Bill markAsPaid(Long billId) {
        User user = authService.getCurrentUser();
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + billId));

        bill.setStatus("PAID");
        bill.setLastPaidDate(LocalDate.now());

        // Create matching debit transaction if account exists
        List<Account> accounts = accountRepository.findByUserIdAndIsActiveTrue(user.getId());
        if (!accounts.isEmpty()) {
            TransactionRequest tr = new TransactionRequest();
            tr.setAccountId(accounts.get(0).getId());
            tr.setAmount(bill.getAmount());
            tr.setType("DEBIT");
            tr.setCategory(bill.getCategory());
            tr.setMerchant(bill.getName());
            tr.setDescription("Auto bill payment: " + bill.getName());
            transactionService.createTransaction(tr);
        }

        return billRepository.save(bill);
    }
}
