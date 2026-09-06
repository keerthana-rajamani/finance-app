package com.examly.springapp.dto;

import java.math.BigDecimal;

public class AccountLinkRequest {
    private String bankName;
    private String accountType; // SAVINGS, CURRENT, CREDIT, DEMAT
    private String accountNumber;
    private BigDecimal initialBalance;

    public AccountLinkRequest() {}

    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }

    public String getAccountType() { return accountType; }
    public void setAccountType(String accountType) { this.accountType = accountType; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public BigDecimal getInitialBalance() { return initialBalance; }
    public void setInitialBalance(BigDecimal initialBalance) { this.initialBalance = initialBalance; }
}
