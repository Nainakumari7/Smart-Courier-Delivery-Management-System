package com.smartcourier.adminservice.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class DtoTest {

    @Test
    void testAnalyticsSummary() {
        AnalyticsSummary summary = new AnalyticsSummary(10L, 5L, 3L, 2L, 100L, java.util.Collections.emptyList(), 0.0);
        
        assertEquals(10L, summary.getTotalDeliveries());
        assertEquals(5L, summary.getPendingDeliveries());
        assertEquals(3L, summary.getDeliveredDeliveries());
        assertEquals(2L, summary.getCancelledDeliveries());
        assertEquals(100L, summary.getTotalUsers());

        summary.setTotalDeliveries(20L);
        assertEquals(20L, summary.getTotalDeliveries());
        
        AnalyticsSummary summary2 = new AnalyticsSummary(20L, 5L, 3L, 2L, 100L, java.util.Collections.emptyList(), 0.0);
        assertEquals(summary, summary2);
        assertEquals(summary.hashCode(), summary2.hashCode());
        assertNotNull(summary.toString());
        
        assertNotEquals(summary, new AnalyticsSummary());
        assertTrue(summary.canEqual(summary2));
    }

    @Test
    void testRevenueReport() {
        RevenueReport report = new RevenueReport(1000.0, 100.0, 900.0, "USD");
        
        assertEquals(1000.0, report.getTotalRevenue());
        assertEquals(100.0, report.getTaxAmount());
        assertEquals(900.0, report.getNetProfit());
        assertEquals("USD", report.getCurrency());

        report.setTotalRevenue(2000.0);
        assertEquals(2000.0, report.getTotalRevenue());
        
        RevenueReport report2 = new RevenueReport(2000.0, 100.0, 900.0, "USD");
        assertEquals(report, report2);
        assertEquals(report.hashCode(), report2.hashCode());
        assertNotNull(report.toString());

        assertNotEquals(report, new RevenueReport());
        assertTrue(report.canEqual(report2));
    }
}
