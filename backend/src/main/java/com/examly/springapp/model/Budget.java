package com.examly.springapp.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "budget_month", nullable = false)
    private LocalDate month; // stored as YYYY-MM-01

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal budgetAmount;

    @Column(precision = 10, scale = 2)
    private BigDecimal spentAmount = BigDecimal.ZERO;

    private Integer alertAtPercent = 80;

    private Boolean carryForward = false;

    public Budget() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDate getMonth() { return month; }
    public void setMonth(LocalDate month) { this.month = month; }

    public BigDecimal getBudgetAmount() { return budgetAmount; }
    public void setBudgetAmount(BigDecimal budgetAmount) { this.budgetAmount = budgetAmount; }

    public BigDecimal getSpentAmount() { return spentAmount; }
    public void setSpentAmount(BigDecimal spentAmount) { this.spentAmount = spentAmount; }

    public Integer getAlertAtPercent() { return alertAtPercent; }
    public void setAlertAtPercent(Integer alertAtPercent) { this.alertAtPercent = alertAtPercent; }

    public Boolean getCarryForward() { return carryForward; }
    public void setCarryForward(Boolean carryForward) { this.carryForward = carryForward; }
}
