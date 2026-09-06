package com.examly.springapp.service;

import com.examly.springapp.model.Account;
import com.examly.springapp.model.Investment;
import com.examly.springapp.model.Transaction;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.AccountRepository;
import com.examly.springapp.repository.InvestmentRepository;
import com.examly.springapp.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class TaxService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private InvestmentRepository investmentRepository;

    @Autowired
    private AuthService authService;

    public Map<String, Object> getTaxSummary() {
        User user = authService.getCurrentUser();

        // Calculate aggregated interest income from savings accounts
        List<Account> accounts = accountRepository.findByUserIdAndIsActiveTrue(user.getId());
        BigDecimal totalSavings = BigDecimal.ZERO;
        for (Account a : accounts) {
            if ("SAVINGS".equalsIgnoreCase(a.getAccountType()) && a.getBalance() != null) {
                totalSavings = totalSavings.add(a.getBalance());
            }
        }
        // Annual interest estimated at 3.5%
        BigDecimal annualInterestIncome = totalSavings.multiply(new BigDecimal("0.035")).setScale(2, RoundingMode.HALF_UP);

        // Calculate Section 80C deductions (ELSS, PPF, Life Insurance, PF)
        BigDecimal elssInvested = BigDecimal.ZERO;
        List<Investment> investments = investmentRepository.findByUserId(user.getId());
        for (Investment inv : investments) {
            if (inv.getAssetName() != null && (inv.getAssetName().toLowerCase().contains("elss") || inv.getAssetName().toLowerCase().contains("tax saver"))) {
                elssInvested = elssInvested.add(inv.getTotalValue() != null ? inv.getTotalValue() : BigDecimal.ZERO);
            }
        }
        BigDecimal epfPpf = new BigDecimal("70000.00");
        BigDecimal lifeInsurance = new BigDecimal("25000.00");
        BigDecimal section80CTotal = elssInvested.add(epfPpf).add(lifeInsurance);
        BigDecimal max80CLimit = new BigDecimal("150000.00");
        BigDecimal eligible80C = section80CTotal.min(max80CLimit);

        // Capital Gains (simulated based on equity investments)
        BigDecimal stcg = new BigDecimal("15400.00"); // Short Term Capital Gain
        BigDecimal ltcg = new BigDecimal("42500.00"); // Long Term Capital Gain (< 1.25 Lakh exempt)

        // Estimated Gross Total Income
        BigDecimal estimatedAnnualSalary = new BigDecimal("1200000.00");
        BigDecimal standardDeduction = new BigDecimal("75000.00");
        BigDecimal taxableIncome = estimatedAnnualSalary.add(annualInterestIncome).add(stcg)
                .subtract(standardDeduction)
                .subtract(eligible80C);
        if (taxableIncome.compareTo(BigDecimal.ZERO) < 0) taxableIncome = BigDecimal.ZERO;

        // Estimated Tax Liability
        BigDecimal estimatedTax = taxableIncome.multiply(new BigDecimal("0.15")).setScale(2, RoundingMode.HALF_UP);

        // Advance Tax Schedule (June 15, Sept 15, Dec 15, March 15)
        List<Map<String, Object>> advanceTaxSchedule = new ArrayList<>();
        advanceTaxSchedule.add(Map.of("installment", "1st Installment", "dueDate", "June 15", "percentage", 15, "amount", estimatedTax.multiply(new BigDecimal("0.15")).setScale(2, RoundingMode.HALF_UP), "status", "PAID"));
        advanceTaxSchedule.add(Map.of("installment", "2nd Installment", "dueDate", "September 15", "percentage", 45, "amount", estimatedTax.multiply(new BigDecimal("0.45")).setScale(2, RoundingMode.HALF_UP), "status", "PAID"));
        advanceTaxSchedule.add(Map.of("installment", "3rd Installment", "dueDate", "December 15", "percentage", 75, "amount", estimatedTax.multiply(new BigDecimal("0.75")).setScale(2, RoundingMode.HALF_UP), "status", "PENDING"));
        advanceTaxSchedule.add(Map.of("installment", "4th Installment", "dueDate", "March 15", "percentage", 100, "amount", estimatedTax, "status", "PENDING"));

        Map<String, Object> summary = new HashMap<>();
        summary.put("financialYear", "FY 2025-26 (AY 2026-27)");
        summary.put("panLinked", user.getPanHash() != null);
        summary.put("grossIncome", estimatedAnnualSalary);
        summary.put("interestIncome", annualInterestIncome);
        summary.put("stcg", stcg);
        summary.put("ltcg", ltcg);
        summary.put("standardDeduction", standardDeduction);
        summary.put("section80CTotal", section80CTotal);
        summary.put("section80CLimit", max80CLimit);
        summary.put("eligible80CDeduction", eligible80C);
        summary.put("headroom80C", max80CLimit.subtract(eligible80C));
        summary.put("taxableIncome", taxableIncome);
        summary.put("estimatedTaxLiability", estimatedTax);
        summary.put("advanceTaxSchedule", advanceTaxSchedule);

        return summary;
    }
}
