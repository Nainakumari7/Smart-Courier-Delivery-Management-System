package com.smartcourier.adminservice.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    public void testHandleRuntimeException() {
        RuntimeException ex = new RuntimeException("Test exception");
        ResponseEntity<Map<String, String>> response = handler.handleRuntimeException(ex);
        
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Test exception", response.getBody().get("error"));
    }

    @Test
    public void testHandleGenericException() {
        Exception ex = new Exception("Test exception");
        ResponseEntity<Map<String, String>> response = handler.handleGenericException(ex);
        
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("An unexpected error occurred", response.getBody().get("error"));
        assertEquals("Test exception", response.getBody().get("details"));
    }
}
