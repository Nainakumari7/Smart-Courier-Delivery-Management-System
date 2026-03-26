package com.smartcourier.adminservice.security.jwt;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.AuthenticationException;

import jakarta.servlet.ServletException;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class AuthEntryPointJwtTest {

    @Test
    public void testCommence() throws IOException, ServletException {
        AuthEntryPointJwt entryPoint = new AuthEntryPointJwt();
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setServletPath("/api/test");
        MockHttpServletResponse response = new MockHttpServletResponse();
        
        AuthenticationException authException = new AuthenticationException("Bad credentials") {};
        
        entryPoint.commence(request, response, authException);
        
        assertEquals(401, response.getStatus());
        assertEquals("application/json", response.getContentType());
        assertTrue(response.getContentAsString().contains("Unauthorized"));
        assertTrue(response.getContentAsString().contains("/api/test"));
    }
}
