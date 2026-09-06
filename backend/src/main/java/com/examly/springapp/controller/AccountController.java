package com.examly.springapp.controller;

import com.examly.springapp.dto.AccountLinkRequest;
import com.examly.springapp.model.Account;
import com.examly.springapp.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @PostMapping("/link")
    public ResponseEntity<Account> linkAccount(@RequestBody AccountLinkRequest request) {
        Account account = accountService.linkAccount(request);
        return ResponseEntity.ok(account);
    }

    @GetMapping
    public ResponseEntity<List<Account>> getAccounts() {
        return ResponseEntity.ok(accountService.getAccounts());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> unlinkAccount(@PathVariable Long id) {
        accountService.unlinkAccount(id);
        return ResponseEntity.ok(Map.of("message", "Account unlinked successfully"));
    }

    @PostMapping("/{id}/sync")
    public ResponseEntity<Account> syncAccount(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.syncAccount(id));
    }
}
