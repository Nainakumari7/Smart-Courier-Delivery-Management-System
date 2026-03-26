package com.smartcourier.adminservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueReport {
    private double totalRevenue;
    private double taxAmount;
    private double netProfit;
    private String currency = "USD";
}
