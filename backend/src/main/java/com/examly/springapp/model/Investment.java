package com.examly.springapp.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "investments")
public class Investment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 30)
    private String assetType; // EQUITY, MUTUAL_FUND, GOLD, REAL_ESTATE, DEBT, CASH

    @Column(nullable = false, length = 150)
    private String assetName;

    @Column(precision = 12, scale = 4)
    private BigDecimal units = BigDecimal.ONE;

    @Column(precision = 12, scale = 2)
    private BigDecimal buyPrice;

    @Column(precision = 12, scale = 2)
    private BigDecimal currentNav;

    @Column(precision = 15, scale = 2)
    private BigDecimal totalValue;

    @Column(precision = 5, scale = 2)
    private BigDecimal xirr = new BigDecimal("12.50");

    public Investment() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getAssetType() { return assetType; }
    public void setAssetType(String assetType) { this.assetType = assetType; }

    public String getAssetName() { return assetName; }
    public void setAssetName(String assetName) { this.assetName = assetName; }

    public BigDecimal getUnits() { return units; }
    public void setUnits(BigDecimal units) { this.units = units; }

    public BigDecimal getBuyPrice() { return buyPrice; }
    public void setBuyPrice(BigDecimal buyPrice) { this.buyPrice = buyPrice; }

    public BigDecimal getCurrentNav() { return currentNav; }
    public void setCurrentNav(BigDecimal currentNav) { this.currentNav = currentNav; }

    public BigDecimal getTotalValue() { return totalValue; }
    public void setTotalValue(BigDecimal totalValue) { this.totalValue = totalValue; }

    public BigDecimal getXirr() { return xirr; }
    public void setXirr(BigDecimal xirr) { this.xirr = xirr; }
}
