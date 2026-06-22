package com.smartcourier.adminservice.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class AdminControllerTest {

    @org.mockito.Mock
    private com.smartcourier.adminservice.feign.DeliveryClient deliveryClient;

    @org.mockito.Mock
    private com.smartcourier.adminservice.feign.AuthClient authClient;

    @InjectMocks
    private AdminController adminController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetDashboard() {
        ResponseEntity<Map<String, String>> response = adminController.getDashboard();
        assertEquals(200, response.getStatusCode().value());
        assertEquals("System is running", response.getBody().get("status"));
    }

    @Test
    public void testGetAnalyticsSummary() {
        ResponseEntity<com.smartcourier.adminservice.dto.AnalyticsSummary> response = adminController.getAnalyticsSummary("token");
        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
    }

    @Test
    public void testGetUserById() {
        Object mockUser = new Object();
        org.mockito.Mockito.when(authClient.getUserById("token", 1L)).thenReturn(mockUser);
        ResponseEntity<Object> response = adminController.getUserById("token", 1L);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(mockUser, response.getBody());
    }

    @Test
    public void testGetDeliveryById() {
        Object mockDelivery = new Object();
        org.mockito.Mockito.when(deliveryClient.getDeliveryById("token", 1L)).thenReturn(mockDelivery);
        ResponseEntity<Object> response = adminController.getDeliveryById("token", 1L);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(mockDelivery, response.getBody());
    }

    @Test
    public void testBlockUser() {
        Object mockResponse = new Object();
        org.mockito.Mockito.when(authClient.blockUser("token", 1L)).thenReturn(mockResponse);
        ResponseEntity<Object> response = adminController.blockUser("token", 1L);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    public void testUnblockUser() {
        Object mockResponse = new Object();
        org.mockito.Mockito.when(authClient.unblockUser("token", 1L)).thenReturn(mockResponse);
        ResponseEntity<Object> response = adminController.unblockUser("token", 1L);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    public void testGetSystemHealth() {
        ResponseEntity<Map<String, String>> response = adminController.getSystemHealth();
        assertEquals(200, response.getStatusCode().value());
        assertEquals("UP", response.getBody().get("auth-service"));
    }

    @Test
    public void testGetRevenueReport() {
        ResponseEntity<com.smartcourier.adminservice.dto.RevenueReport> response = adminController.getRevenueReport("token");
        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
    }
}
