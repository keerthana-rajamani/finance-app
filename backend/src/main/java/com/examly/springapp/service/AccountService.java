package com.examly.springapp.service;

import com.examly.springapp.dto.AccountLinkRequest;
import com.examly.springapp.exception.AccountSyncException;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Account;
import com.examly.springapp.model.AuditLog;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.AccountRepository;
import com.examly.springapp.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private AuthService authService;

    public Account linkAccount(AccountLinkRequest request) {
        User user = authService.getCurrentUser();

        // Support role cannot link accounts
        if ("SUPPORT".equalsIgnoreCase(user.getRole())) {
            throw new AccountSyncException("Support personnel cannot link personal accounts");
        }

        String rawNum = request.getAccountNumber() != null ? request.getAccountNumber().trim() : "1234";
        String masked = rawNum.length() > 4 ? "••••" + rawNum.substring(rawNum.length() - 4) : "••••" + rawNum;

        Account account = new Account();
        account.setUserId(user.getId());
        account.setBankName(request.getBankName());
        account.setAccountType(request.getAccountType() != null ? request.getAccountType().toUpperCase() : "SAVINGS");
        account.setMaskedNumber(masked);
        account.setBalance(request.getInitialBalance() != null ? request.getInitialBalance() : new BigDecimal("25000.00"));
        account.setLastSyncedAt(LocalDateTime.now());
        account.setIsActive(true);
        account.setConsentExpiresAt(LocalDateTime.now().plusMonths(12));

        Account saved = accountRepository.save(account);
        auditLogRepository.save(new AuditLog(user.getId(), user.getEmail(), user.getRole(), "ACCOUNT_LINK", "ACCOUNTS", "127.0.0.1"));
        return saved;
    }

    public List<Account> getAccounts() {
        User user = authService.getCurrentUser();
        List<Account> accounts;
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            accounts = accountRepository.findAll();
        } else {
            accounts = accountRepository.findByUserIdAndIsActiveTrue(user.getId());
        }

        // Mask accounts for support role as per Appendix A & FR3
        if ("SUPPORT".equalsIgnoreCase(user.getRole())) {
            accounts.forEach(acc -> {
                acc.setMaskedNumber("••••" + (acc.getMaskedNumber().length() >= 4 ? acc.getMaskedNumber().substring(acc.getMaskedNumber().length() - 4) : "0000"));
            });
        }
        return accounts;
    }

    public void unlinkAccount(Long id) {
        User user = authService.getCurrentUser();
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id " + id));

        account.setIsActive(false);
        accountRepository.save(account);
        auditLogRepository.save(new AuditLog(user.getId(), user.getEmail(), user.getRole(), "ACCOUNT_UNLINK", "ACCOUNTS", "127.0.0.1"));
    }

    public Account syncAccount(Long id) {
        User user = authService.getCurrentUser();
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id " + id));

        account.setLastSyncedAt(LocalDateTime.now());
        Account updated = accountRepository.save(account);
        auditLogRepository.save(new AuditLog(user.getId(), user.getEmail(), user.getRole(), "ACCOUNT_SYNC", "ACCOUNTS", "127.0.0.1"));
        return updated;
    }
}
