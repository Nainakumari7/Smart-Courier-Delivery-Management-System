package com.smartcourier.adminservice.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class AdminControllerTest {

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
        assertNotNull(response.getBody());
        assertEquals("System is running", response.getBody().get("status"));
        assertEquals("Welcome to the Admin Dashboard", response.getBody().get("message"));
    }
}
