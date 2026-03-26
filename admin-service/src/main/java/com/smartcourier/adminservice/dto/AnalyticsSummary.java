package com.smartcourier.adminservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticsSummary {
    private long totalDeliveries;
    private long pendingDeliveries;
    private long deliveredDeliveries;
    private long cancelledDeliveries;
    private long totalUsers;
}
