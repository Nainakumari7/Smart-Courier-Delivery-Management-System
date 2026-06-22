package com.smartcourier.authservice.security.jwt;

import com.smartcourier.authservice.security.services.UserDetailsImpl;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.SecretKey;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

public class JwtUtilsTest {

    private JwtUtils jwtUtils;
    private String jwtSecret;

    @BeforeEach
    public void setUp() {
        jwtUtils = new JwtUtils();
        SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        jwtSecret = Encoders.BASE64.encode(key.getEncoded());
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", jwtSecret);
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 3600000);
    }

    @Test
    public void testGenerateAndValidateToken() {
        Authentication authentication = Mockito.mock(Authentication.class);
        UserDetailsImpl userDetails = Mockito.mock(UserDetailsImpl.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("testUser");
        when(userDetails.getId()).thenReturn(1L);

        String token = jwtUtils.generateJwtToken(authentication);
        assertNotNull(token);
        assertTrue(jwtUtils.validateJwtToken(token));
        assertEquals("testUser", jwtUtils.getUserNameFromJwtToken(token));
    }

    @Test
    public void testInvalidToken() {
        assertFalse(jwtUtils.validateJwtToken("invalidToken"));
    }
}
