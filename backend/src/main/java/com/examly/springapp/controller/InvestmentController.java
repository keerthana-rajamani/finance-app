package com.examly.springapp.controller;

import com.examly.springapp.dto.InvestmentRequest;
import com.examly.springapp.model.Investment;
import com.examly.springapp.service.InvestmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/investments")
public class InvestmentController {

    @Autowired
    private InvestmentService investmentService;

    @PostMapping
    public ResponseEntity<Investment> addInvestment(@RequestBody InvestmentRequest request) {
        return ResponseEntity.ok(investmentService.addInvestment(request));
    }

    @GetMapping
    public ResponseEntity<List<Investment>> getInvestments() {
        return ResponseEntity.ok(investmentService.getInvestments());
    }

    @GetMapping("/allocation")
    public ResponseEntity<Map<String, Object>> getAllocation() {
        return ResponseEntity.ok(investmentService.getAssetAllocation());
    }
}
