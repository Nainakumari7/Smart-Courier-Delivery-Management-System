package com.smartcourier.adminservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcourier.adminservice.dto.AnalyticsSummary;
import com.smartcourier.adminservice.dto.RevenueReport;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> getDashboard() {
        Map<String, String> data = new HashMap<>();
        data.put("status", "System is running");
        data.put("message", "Welcome to the Admin Dashboard");
        return ResponseEntity.ok(data);
    }

    @GetMapping("/analytics/summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnalyticsSummary> getAnalyticsSummary(@RequestHeader("Authorization") String token) {
        // Since full lists were removed, we now return mock analytics or would call a specialized analytics endpoint
        AnalyticsSummary summary = new AnalyticsSummary(100, 30, 60, 10, 50);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/reports/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RevenueReport> getRevenueReport() {
        RevenueReport report = new RevenueReport(50000.0, 7500.0, 42500.0, "USD");
        return ResponseEntity.ok(report);
    }
}
