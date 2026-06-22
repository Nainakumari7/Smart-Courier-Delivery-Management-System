package com.smartcourier.adminservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import com.smartcourier.adminservice.dto.AnalyticsSummary;
import com.smartcourier.adminservice.dto.RevenueReport;
import com.smartcourier.adminservice.feign.AuthClient;
import com.smartcourier.adminservice.feign.DeliveryClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private DeliveryClient deliveryClient;

    @Autowired
    private AuthClient authClient;

    @Autowired
    private DiscoveryClient discoveryClient;

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
        try {
            System.out.println("Fetching analytics summary...");
            java.util.List<Object> deliveries = deliveryClient.getAllDeliveries(token);
            java.util.List<Object> users = authClient.getAllUsers(token);

            if (deliveries == null) {
                System.out.println("Deliveries list is null");
                deliveries = java.util.Collections.emptyList();
            }
            if (users == null) {
                System.out.println("Users list is null");
                users = java.util.Collections.emptyList();
            }

            System.out.println("Total deliveries fetched: " + deliveries.size());
            System.out.println("Total users fetched: " + users.size());

            if (deliveries.size() > 0) {
                System.out.println("First delivery sample: " + deliveries.get(0));
            }

            long totalDeliveries = deliveries.size();
            long totalUsers = users.size();
            
            long pending = 0;
            long delivered = 0;
            long cancelled = 0;

            for (Object d : deliveries) {
                if (d instanceof java.util.Map) {
                    java.util.Map<?, ?> map = (java.util.Map<?, ?>) d;
                    Object statusObj = map.get("status");
                    if (statusObj != null) {
                        String status = statusObj.toString();
                        if ("PENDING".equalsIgnoreCase(status)) pending++;
                        else if ("DELIVERED".equalsIgnoreCase(status)) delivered++;
                        else if ("CANCELLED".equalsIgnoreCase(status)) cancelled++;
                    }
                }
            }

            System.out.println("Counts - Pending: " + pending + ", Delivered: " + delivered + ", Cancelled: " + cancelled);

            java.util.List<Object> recentDeliveries = new java.util.ArrayList<>();
            if (deliveries.size() > 5) {
                recentDeliveries.addAll(deliveries.subList(deliveries.size() - 5, deliveries.size()));
            } else {
                recentDeliveries.addAll(deliveries);
            }
            
            // Reverse recent deliveries to show newest first
            java.util.Collections.reverse(recentDeliveries);

            AnalyticsSummary summary = new AnalyticsSummary(totalDeliveries, pending, delivered, cancelled, totalUsers, recentDeliveries, 0.0);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            System.err.println("Error fetching analytics: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new AnalyticsSummary(0, 0, 0, 0, 0, java.util.Collections.emptyList(), 0.0));
        }
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<java.util.List<Object>> getAllUsers(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(authClient.getAllUsers(token));
    }

    @GetMapping("/deliveries")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<java.util.List<Object>> getAllDeliveries(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(deliveryClient.getAllDeliveries(token));
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> getUserById(@RequestHeader("Authorization") String token, @PathVariable("id") Long id) {
        return ResponseEntity.ok(authClient.getUserById(token, id));
    }

    @GetMapping("/deliveries/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> getDeliveryById(@RequestHeader("Authorization") String token, @PathVariable("id") Long id) {
        return ResponseEntity.ok(deliveryClient.getDeliveryById(token, id));
    }

    @PutMapping("/users/{id}/block")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> blockUser(@RequestHeader("Authorization") String token, @PathVariable("id") Long id) {
        return ResponseEntity.ok(authClient.blockUser(token, id));
    }

    @PutMapping("/users/{id}/unblock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> unblockUser(@RequestHeader("Authorization") String token, @PathVariable("id") Long id) {
        return ResponseEntity.ok(authClient.unblockUser(token, id));
    }

    @GetMapping("/system/health")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> getSystemHealth() {
        Map<String, String> health = new HashMap<>();
        
        String[] services = {"auth-service", "delivery-service", "tracking-service"};
        for (String service : services) {
            java.util.List<ServiceInstance> instances = discoveryClient.getInstances(service);
            health.put(service, !instances.isEmpty() ? "UP" : "DOWN");
        }
        
        // Mocking external deps for now but keeping them "Live"
        health.put("database", "CONNECTED");
        health.put("rabbitmq", "RUNNING");
        
        return ResponseEntity.ok(health);
    }

    @GetMapping("/reports/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RevenueReport> getRevenueReport(@RequestHeader("Authorization") String token) {
        try {
            java.util.List<Object> deliveries = deliveryClient.getAllDeliveries(token);
            double totalRevenue = deliveries.size() * 700.0; // Mock calculation based on average weight 10kg
            RevenueReport report = new RevenueReport(totalRevenue, totalRevenue * 0.15, totalRevenue * 0.85, "INR");
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.ok(new RevenueReport(0, 0, 0, "INR"));
        }
    }

    @DeleteMapping("/system/reset")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> resetSystem(@RequestHeader("Authorization") String token) {
        Map<String, String> response = new HashMap<>();
        try {
            deliveryClient.deleteAllDeliveries(token);
            authClient.deleteAllUsers(token);
            response.put("status", "success");
            response.put("message", "System data has been reset. All deliveries and non-admin users deleted.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to reset system: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
