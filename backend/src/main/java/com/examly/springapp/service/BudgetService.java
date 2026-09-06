package com.examly.springapp.service;

import com.examly.springapp.dto.BudgetRequest;
import com.examly.springapp.exception.BudgetValidationException;
import com.examly.springapp.model.Budget;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private AuthService authService;

    public Budget saveBudget(BudgetRequest request) {
        if (request.getBudgetAmount() == null || request.getBudgetAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BudgetValidationException("Budget must be a positive number");
        }

        User user = authService.getCurrentUser();
        LocalDate month = request.getMonth() != null ? request.getMonth().withDayOfMonth(1) : LocalDate.now().withDayOfMonth(1);

        Budget budget = budgetRepository.findByUserIdAndCategoryAndMonth(user.getId(), request.getCategory(), month)
                .orElse(new Budget());

        budget.setUserId(user.getId());
        budget.setCategory(request.getCategory());
        budget.setMonth(month);
        budget.setBudgetAmount(request.getBudgetAmount());
        if (budget.getSpentAmount() == null) {
            budget.setSpentAmount(BigDecimal.ZERO);
        }
        budget.setAlertAtPercent(request.getAlertAtPercent() != null ? request.getAlertAtPercent() : 80);
        budget.setCarryForward(request.getCarryForward() != null ? request.getCarryForward() : false);

        return budgetRepository.save(budget);
    }

    public Map<String, Object> getBudgetSummary() {
        User user = authService.getCurrentUser();
        LocalDate currentMonth = LocalDate.now().withDayOfMonth(1);
        List<Budget> budgets = budgetRepository.findByUserIdAndMonth(user.getId(), currentMonth);

        BigDecimal totalBudget = BigDecimal.ZERO;
        BigDecimal totalSpent = BigDecimal.ZERO;

        List<Map<String, Object>> categories = new ArrayList<>();
        for (Budget b : budgets) {
            totalBudget = totalBudget.add(b.getBudgetAmount());
            BigDecimal spent = b.getSpentAmount() != null ? b.getSpentAmount() : BigDecimal.ZERO;
            totalSpent = totalSpent.add(spent);

            BigDecimal percent = BigDecimal.ZERO;
            if (b.getBudgetAmount().compareTo(BigDecimal.ZERO) > 0) {
                percent = spent.divide(b.getBudgetAmount(), 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100"));
            }

            Map<String, Object> item = new HashMap<>();
            item.put("id", b.getId());
            item.put("category", b.getCategory());
            item.put("budgetAmount", b.getBudgetAmount());
            item.put("spentAmount", spent);
            item.put("percent", percent.setScale(1, RoundingMode.HALF_UP));
            item.put("alertAtPercent", b.getAlertAtPercent());
            item.put("isOverBudget", percent.compareTo(new BigDecimal("100")) >= 0);
            item.put("isAlert", percent.compareTo(new BigDecimal(b.getAlertAtPercent())) >= 0);
            item.put("carryForward", b.getCarryForward());
            categories.add(item);
        }

        BigDecimal remaining = totalBudget.subtract(totalSpent);

        Map<String, Object> response = new HashMap<>();
        response.put("month", currentMonth.toString());
        response.put("totalBudget", totalBudget);
        response.put("totalSpent", totalSpent);
        response.put("remainingBudget", remaining);
        response.put("categories", categories);

        return response;
    }

    public List<Budget> getAllBudgets() {
        User user = authService.getCurrentUser();
        return budgetRepository.findByUserId(user.getId());
    }
}
