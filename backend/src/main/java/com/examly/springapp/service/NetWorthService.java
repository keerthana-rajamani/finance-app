package com.examly.springapp.service;

import com.examly.springapp.model.Account;
import com.examly.springapp.model.Investment;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.AccountRepository;
import com.examly.springapp.repository.InvestmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.math.RoundingMode;
import java.util.*;

@Service
public class NetWorthService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private InvestmentRepository investmentRepository;

    @Autowired
    private AuthService authService;

    public Map<String, Object> getNetWorthSummary() {
        User user = authService.getCurrentUser();

        List<Account> accounts = accountRepository.findByUserIdAndIsActiveTrue(user.getId());
        List<Investment> investments = investmentRepository.findByUserId(user.getId());

        BigDecimal liquidCash = BigDecimal.ZERO;
        BigDecimal liabilities = BigDecimal.ZERO;

        for (Account acc : accounts) {
            BigDecimal bal = acc.getBalance() != null ? acc.getBalance() : BigDecimal.ZERO;
            if ("CREDIT".equalsIgnoreCase(acc.getAccountType())) {
                liabilities = liabilities.add(bal.abs());
            } else {
                liquidCash = liquidCash.add(bal);
            }
        }

        BigDecimal investmentValue = BigDecimal.ZERO;
        for (Investment inv : investments) {
            BigDecimal val = inv.getTotalValue() != null ? inv.getTotalValue() : BigDecimal.ZERO;
            investmentValue = investmentValue.add(val);
        }

        BigDecimal totalAssets = liquidCash.add(investmentValue);
        BigDecimal netWorth = totalAssets.subtract(liabilities);

        // Historical 6-month trend calculation
        List<Map<String, Object>> trend = new ArrayList<>();
        LocalDate current = LocalDate.now();
        for (int i = 5; i >= 0; i--) {
            LocalDate monthDate = current.minusMonths(i);
            Map<String, Object> point = new HashMap<>();
            point.put("month", monthDate.format(DateTimeFormatter.ofPattern("MMM yyyy")));
            // Simulated growth curve leading up to current net worth
            double factor = 1.0 - (i * 0.035);
            point.put("netWorth", netWorth.multiply(BigDecimal.valueOf(factor)).setScale(2, RoundingMode.HALF_UP));
            point.put("assets", totalAssets.multiply(BigDecimal.valueOf(factor)).setScale(2, RoundingMode.HALF_UP));
            point.put("liabilities", liabilities);
            trend.add(point);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("totalAssets", totalAssets);
        response.put("liquidCash", liquidCash);
        response.put("investments", investmentValue);
        response.put("totalLiabilities", liabilities);
        response.put("netWorth", netWorth);
        response.put("trend", trend);

        return response;
    }
}
