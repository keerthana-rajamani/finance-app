package com.examly.springapp.controller;

import com.examly.springapp.dto.BudgetRequest;
import com.examly.springapp.model.Budget;
import com.examly.springapp.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @PostMapping
    public ResponseEntity<Budget> saveBudget(@RequestBody BudgetRequest request) {
        return ResponseEntity.ok(budgetService.saveBudget(request));
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getBudgetSummary() {
        return ResponseEntity.ok(budgetService.getBudgetSummary());
    }

    @GetMapping
    public ResponseEntity<List<Budget>> getAllBudgets() {
        return ResponseEntity.ok(budgetService.getAllBudgets());
    }
}
