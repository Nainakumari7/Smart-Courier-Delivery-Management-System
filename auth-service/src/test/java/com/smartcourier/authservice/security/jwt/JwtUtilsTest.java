package com.smartcourier.authservice.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.security.Key;
import java.util.Date;

import com.smartcourier.authservice.security.services.UserDetailsImpl;

import static org.junit.jupiter.api.Assertions.*;

public class JwtUtilsTest {

    private JwtUtils jwtUtils;
    private String jwtSecret = "aV9hbV9hX3NlY3JldF9rZXlfdGhhdF9pX3VzZV90b19nZW5lcmF0ZV90aGVfdG9rZW5zX2Zvcl90aGlzX2FwcGxpY2F0aW9u";

    @BeforeEach
    public void setup() {
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", jwtSecret);
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 86400000);
    }

    @Test
    public void testGenerateAndValidateJwtToken() {
        UserDetailsImpl userPrincipal = new UserDetailsImpl(
            1L, 
            "testuser", 
            "test@test.com", 
            "password", 
            java.util.Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_CUSTOMER"))
        );
        org.springframework.security.core.Authentication auth = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(userPrincipal, null, userPrincipal.getAuthorities());
        
        String token = jwtUtils.generateJwtToken(auth);
        
        assertTrue(jwtUtils.validateJwtToken(token));
        assertEquals("testuser", jwtUtils.getUserNameFromJwtToken(token));
    }

    @Test
    public void testValidateJwtToken_Invalid() {
        assertFalse(jwtUtils.validateJwtToken("invalid.token.string"));
    }
}
