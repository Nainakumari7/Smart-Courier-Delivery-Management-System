package com.smartcourier.trackingservice.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.security.Key;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

public class JwtUtilsTest {

    private JwtUtils jwtUtils;
    private String jwtSecret = "aV9hbV9hX3NlY3JldF9rZXlfdGhhdF9pX3VzZV90b19nZW5lcmF0ZV90aGVfdG9rZW5zX2Zvcl90aGlzX2FwcGxpY2F0aW9u";

    @BeforeEach
    public void setup() {
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", jwtSecret);
    }

    @Test
    public void testValidateJwtToken_Valid() {
        Key key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
        String token = Jwts.builder()
                .setSubject("testuser")
                .claim("role", "ROLE_CUSTOMER")
                .claim("id", 1L)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + 60000))
                .signWith(key)
                .compact();

        assertTrue(jwtUtils.validateJwtToken(token));
        
        Claims claims = jwtUtils.getClaimsFromJwtToken(token);
        assertEquals("testuser", claims.getSubject());
        assertEquals("ROLE_CUSTOMER", claims.get("role"));
    }

    @Test
    public void testValidateJwtToken_Invalid() {
        assertFalse(jwtUtils.validateJwtToken("invalid.token.string"));
    }
}
