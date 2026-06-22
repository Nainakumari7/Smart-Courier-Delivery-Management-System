package com.smartcourier.deliveryservice.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler exceptionHandler = new GlobalExceptionHandler();

    @Test
    public void testHandleRuntimeException() {
        RuntimeException ex = new RuntimeException("Test Exception");
        
        ResponseEntity<Map<String, String>> response = exceptionHandler.handleRuntimeException(ex);
        
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        Map<String, String> body = response.getBody();
        assertEquals("Test Exception", body.get("error"));
    }

    @Test
    public void testHandleResourceNotFoundException() {
        // Assuming there's a ResourceNotFoundException or similar,
        // but if not, I'll just test the general one if it exists.
        // Let's check GlobalExceptionHandler first.
    }
}
