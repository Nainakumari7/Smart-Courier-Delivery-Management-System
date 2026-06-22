package com.smartcourier.authservice.dto;

import com.smartcourier.authservice.dto.request.*;
import com.smartcourier.authservice.dto.response.*;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class AuthPojoTest {

    @Test
    void testLoginRequest() {
        LoginRequest req = new LoginRequest();
        req.setUsername("user");
        req.setPassword("pass");
        assertEquals("user", req.getUsername());
        assertEquals("pass", req.getPassword());
        
        LoginRequest req2 = new LoginRequest();
        req2.setUsername("user");
        req2.setPassword("pass");
        assertEquals(req, req2);
        assertEquals(req.hashCode(), req2.hashCode());
        assertNotNull(req.toString());
    }

    @Test
    void testSignupRequest() {
        SignupRequest req = new SignupRequest();
        req.setUsername("user");
        req.setEmail("email");
        req.setPassword("pass");
        req.setRole("admin");
        assertEquals("user", req.getUsername());
        assertEquals("email", req.getEmail());
        assertEquals("pass", req.getPassword());
        assertEquals("admin", req.getRole());
        
        SignupRequest req2 = new SignupRequest();
        req2.setUsername("user");
        req2.setEmail("email");
        req2.setPassword("pass");
        req2.setRole("admin");
        assertEquals(req, req2);
        assertEquals(req.hashCode(), req2.hashCode());
        assertNotNull(req.toString());
    }

    @Test
    void testJwtResponse() {
        JwtResponse res = new JwtResponse("token", 1L, "user", "email", "ROLE_ADMIN");
        assertEquals("token", res.getToken());
        assertEquals(1L, res.getId());
        assertEquals("user", res.getUsername());
        assertEquals("email", res.getEmail());
        assertEquals("ROLE_ADMIN", res.getRole());
        
        res.setToken("token2");
        assertEquals("token2", res.getToken());
        
        JwtResponse res2 = new JwtResponse("token2", 1L, "user", "email", "ROLE_ADMIN");
        assertEquals(res, res2);
        assertEquals(res.hashCode(), res2.hashCode());
        assertNotNull(res.toString());
    }

    @Test
    void testMessageResponse() {
        MessageResponse res = new MessageResponse("message");
        assertEquals("message", res.getMessage());
        res.setMessage("msg2");
        assertEquals("msg2", res.getMessage());
        
        MessageResponse res2 = new MessageResponse("msg2");
        assertEquals(res, res2);
        assertEquals(res.hashCode(), res2.hashCode());
        assertNotNull(res.toString());
    }

    @Test
    void testTokenRefreshRequest() {
        TokenRefreshRequest req = new TokenRefreshRequest();
        req.setRefreshToken("refresh");
        assertEquals("refresh", req.getRefreshToken());
        
        TokenRefreshRequest req2 = new TokenRefreshRequest();
        req2.setRefreshToken("refresh");
        assertEquals(req, req2);
        assertEquals(req.hashCode(), req2.hashCode());
        assertNotNull(req.toString());
    }

    @Test
    void testTokenRefreshResponse() {
        TokenRefreshResponse res = new TokenRefreshResponse("access", "refresh");
        assertEquals("access", res.getAccessToken());
        assertEquals("refresh", res.getRefreshToken());
        assertEquals("Bearer", res.getTokenType());
        
        res.setAccessToken("newaccess");
        assertEquals("newaccess", res.getAccessToken());
        
        TokenRefreshResponse res2 = new TokenRefreshResponse("newaccess", "refresh");
        assertEquals(res, res2);
        assertEquals(res.hashCode(), res2.hashCode());
        assertNotNull(res.toString());
    }
}
