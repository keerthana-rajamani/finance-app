package com.examly.springapp.service;

import com.examly.springapp.dto.InvestmentRequest;
import com.examly.springapp.model.Investment;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.InvestmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class InvestmentService {

    @Autowired
    private InvestmentRepository investmentRepository;

    @Autowired
    private AuthService authService;

    public Investment addInvestment(InvestmentRequest request) {
        User user = authService.getCurrentUser();
        Investment inv = new Investment();
        inv.setUserId(user.getId());
        inv.setAssetType(request.getAssetType() != null ? request.getAssetType().toUpperCase() : "EQUITY");
        inv.setAssetName(request.getAssetName());
        inv.setUnits(request.getUnits() != null ? request.getUnits() : BigDecimal.ONE);
        inv.setBuyPrice(request.getBuyPrice() != null ? request.getBuyPrice() : BigDecimal.ZERO);
        inv.setCurrentNav(request.getCurrentNav() != null ? request.getCurrentNav() : request.getBuyPrice());
        inv.setTotalValue(inv.getUnits().multiply(inv.getCurrentNav()).setScale(2, RoundingMode.HALF_UP));
        inv.setXirr(new BigDecimal("14.20")); // standard simulated XIRR

        return investmentRepository.save(inv);
    }

    public List<Investment> getInvestments() {
        User user = authService.getCurrentUser();
        return investmentRepository.findByUserId(user.getId());
    }

    public Map<String, Object> getAssetAllocation() {
        User user = authService.getCurrentUser();
        List<Investment> list = investmentRepository.findByUserId(user.getId());

        BigDecimal total = BigDecimal.ZERO;
        Map<String, BigDecimal> breakdown = new HashMap<>();
        breakdown.put("EQUITY", BigDecimal.ZERO);
        breakdown.put("MUTUAL_FUND", BigDecimal.ZERO);
        breakdown.put("GOLD", BigDecimal.ZERO);
        breakdown.put("DEBT", BigDecimal.ZERO);
        breakdown.put("REAL_ESTATE", BigDecimal.ZERO);
        breakdown.put("CASH", BigDecimal.ZERO);

        for (Investment inv : list) {
            BigDecimal val = inv.getTotalValue() != null ? inv.getTotalValue() : BigDecimal.ZERO;
            total = total.add(val);
            String type = inv.getAssetType() != null ? inv.getAssetType().toUpperCase() : "EQUITY";
            breakdown.put(type, breakdown.getOrDefault(type, BigDecimal.ZERO).add(val));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("totalInvestmentValue", total);
        response.put("overallXIRR", "13.8%");
        response.put("breakdown", breakdown);
        return response;
    }
}
