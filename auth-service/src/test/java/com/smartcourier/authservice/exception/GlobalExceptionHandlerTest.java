package com.smartcourier.authservice.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    public void testHandleValidationExceptions() {
        org.springframework.web.bind.MethodArgumentNotValidException ex = org.mockito.Mockito.mock(org.springframework.web.bind.MethodArgumentNotValidException.class);
        org.springframework.validation.BindingResult result = org.mockito.Mockito.mock(org.springframework.validation.BindingResult.class);
        org.mockito.Mockito.when(ex.getBindingResult()).thenReturn(result);
        org.mockito.Mockito.when(result.getAllErrors()).thenReturn(java.util.Collections.emptyList());
        
        ResponseEntity<Map<String, String>> response = handler.handleValidationExceptions(ex);
        
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void testHandleGenericException() {
        Exception ex = new Exception("Test exception");
        ResponseEntity<Map<String, String>> response = handler.handleGenericException(ex);
        
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Test exception", response.getBody().get("error"));
    }
}
