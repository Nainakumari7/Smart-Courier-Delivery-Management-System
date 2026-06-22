package com.smartcourier.adminservice.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
@ToString
public class AnalyticsSummary {
    private long totalDeliveries;
    private long pendingDeliveries;
    private long deliveredDeliveries;
    private long cancelledDeliveries;
    private long totalUsers;
    private List<Object> recentDeliveries;
    private double totalRevenue;

    public AnalyticsSummary(long totalDeliveries, long pendingDeliveries, long deliveredDeliveries, 
                            long cancelledDeliveries, long totalUsers, List<Object> recentDeliveries, double totalRevenue) {
        this.totalDeliveries = totalDeliveries;
        this.pendingDeliveries = pendingDeliveries;
        this.deliveredDeliveries = deliveredDeliveries;
        this.cancelledDeliveries = cancelledDeliveries;
        this.totalUsers = totalUsers;
        this.recentDeliveries = recentDeliveries;
        this.totalRevenue = totalRevenue;
    }
}
