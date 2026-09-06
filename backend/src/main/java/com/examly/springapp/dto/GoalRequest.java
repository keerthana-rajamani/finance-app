package com.examly.springapp.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class GoalRequest {
    private String name;
    private BigDecimal targetAmount;
    private LocalDate targetDate;
    private BigDecimal currentAmount = BigDecimal.ZERO;
    private String priority = "MEDIUM";
    private Long linkedAccountId;

    public GoalRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getTargetAmount() { return targetAmount; }
    public void setTargetAmount(BigDecimal targetAmount) { this.targetAmount = targetAmount; }

    public LocalDate getTargetDate() { return targetDate; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }

    public BigDecimal getCurrentAmount() { return currentAmount; }
    public void setCurrentAmount(BigDecimal currentAmount) { this.currentAmount = currentAmount; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public Long getLinkedAccountId() { return linkedAccountId; }
    public void setLinkedAccountId(Long linkedAccountId) { this.linkedAccountId = linkedAccountId; }
}
