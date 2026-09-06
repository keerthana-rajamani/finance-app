package com.examly.springapp.controller;

import com.examly.springapp.dto.TransactionRequest;
import com.examly.springapp.model.Transaction;
import com.examly.springapp.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<Transaction>> getTransactions(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String merchant,
            @RequestParam(required = false) String type) {
        return ResponseEntity.ok(transactionService.getTransactions(category, merchant, type));
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@RequestBody TransactionRequest request) {
        Transaction transaction = transactionService.createTransaction(request);
        return ResponseEntity.ok(transaction);
    }

    @PostMapping("/sync")
    public ResponseEntity<List<Transaction>> syncTransactions() {
        return ResponseEntity.ok(transactionService.syncTransactions());
    }
}
