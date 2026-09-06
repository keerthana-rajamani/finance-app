package com.examly.springapp.controller;

import com.examly.springapp.service.NetWorthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/networth")
public class NetWorthController {

    @Autowired
    private NetWorthService netWorthService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getNetWorth() {
        return ResponseEntity.ok(netWorthService.getNetWorthSummary());
    }
}
