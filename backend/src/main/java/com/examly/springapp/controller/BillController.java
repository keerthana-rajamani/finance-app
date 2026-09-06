package com.examly.springapp.controller;

import com.examly.springapp.dto.BillRequest;
import com.examly.springapp.model.Bill;
import com.examly.springapp.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    @Autowired
    private BillService billService;

    @PostMapping
    public ResponseEntity<Bill> addBill(@RequestBody BillRequest request) {
        return ResponseEntity.ok(billService.addBill(request));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Bill>> getUpcomingBills() {
        return ResponseEntity.ok(billService.getUpcomingBills());
    }

    @GetMapping
    public ResponseEntity<List<Bill>> getAllBills() {
        return ResponseEntity.ok(billService.getAllBills());
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<Bill> payBill(@PathVariable Long id) {
        return ResponseEntity.ok(billService.markAsPaid(id));
    }
}
