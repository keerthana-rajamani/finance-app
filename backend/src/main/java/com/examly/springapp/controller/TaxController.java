package com.examly.springapp.controller;

import com.examly.springapp.service.TaxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/tax")
public class TaxController {

    @Autowired
    private TaxService taxService;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getTaxSummary() {
        return ResponseEntity.ok(taxService.getTaxSummary());
    }
}
