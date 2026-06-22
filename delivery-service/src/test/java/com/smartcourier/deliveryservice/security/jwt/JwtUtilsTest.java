package com.smartcourier.deliveryservice.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.SecretKey;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

public class JwtUtilsTest {

    private JwtUtils jwtUtils;
    private String jwtSecret;

    @BeforeEach
    public void setUp() {
        jwtUtils = new JwtUtils();
        SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        jwtSecret = Encoders.BASE64.encode(key.getEncoded());
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", jwtSecret);
    }

    @Test
    public void testGenerateAndValidateToken() {
        String token = Jwts.builder()
                .setSubject("testUser")
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + 86400000))
                .signWith(Keys.hmacShaKeyFor(io.jsonwebtoken.io.Decoders.BASE64.decode(jwtSecret)), SignatureAlgorithm.HS256)
                .compact();

        assertTrue(jwtUtils.validateJwtToken(token));
        assertEquals("testUser", jwtUtils.getClaimsFromJwtToken(token).getSubject());
    }

    @Test
    public void testInvalidToken() {
        assertFalse(jwtUtils.validateJwtToken("invalidToken"));
    }
}
