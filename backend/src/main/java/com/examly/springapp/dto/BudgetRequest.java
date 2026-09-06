package com.examly.springapp.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class BudgetRequest {
    private String category;
    private LocalDate month;
    private BigDecimal budgetAmount;
    private Integer alertAtPercent = 80;
    private Boolean carryForward = false;

    public BudgetRequest() {}

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDate getMonth() { return month; }
    public void setMonth(LocalDate month) { this.month = month; }

    public BigDecimal getBudgetAmount() { return budgetAmount; }
    public void setBudgetAmount(BigDecimal budgetAmount) { this.budgetAmount = budgetAmount; }

    public Integer getAlertAtPercent() { return alertAtPercent; }
    public void setAlertAtPercent(Integer alertAtPercent) { this.alertAtPercent = alertAtPercent; }

    public Boolean getCarryForward() { return carryForward; }
    public void setCarryForward(Boolean carryForward) { this.carryForward = carryForward; }
}
