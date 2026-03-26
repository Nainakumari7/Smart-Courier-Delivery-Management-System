package com.smartcourier.authservice.dto;

import com.smartcourier.authservice.dto.request.LoginRequest;
import com.smartcourier.authservice.dto.request.SignupRequest;
import com.smartcourier.authservice.dto.response.JwtResponse;
import com.smartcourier.authservice.dto.response.MessageResponse;
import org.junit.jupiter.api.Test;
import java.util.Arrays;
import java.util.HashSet;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class AuthPojoTest {

    @Test
    public void testLoginRequest() {
        LoginRequest req = new LoginRequest();
        req.setUsername("user");
        req.setPassword("pass");
        assertEquals("user", req.getUsername());
        assertEquals("pass", req.getPassword());
    }

    @Test
    public void testSignupRequest() {
        SignupRequest req = new SignupRequest();
        req.setUsername("user");
        req.setEmail("email");
        req.setPassword("pass");
        req.setRole("admin");
        assertEquals("user", req.getUsername());
        assertEquals("email", req.getEmail());
        assertEquals("pass", req.getPassword());
        assertEquals("admin", req.getRole());
    }

    @Test
    public void testJwtResponse() {
        JwtResponse res = new JwtResponse("token", 1L, "user", "email", "ROLE_ADMIN");
        assertEquals("token", res.getToken());
        assertEquals(1L, res.getId());
        assertEquals("user", res.getUsername());
        assertEquals("email", res.getEmail());
        assertEquals("ROLE_ADMIN", res.getRole());
        
        res.setToken("token2");
        res.setId(2L);
        res.setUsername("user2");
        res.setEmail("email2");
        res.setRole("ROLE_USER");
        assertEquals("token2", res.getToken());
    }

    @Test
    public void testMessageResponse() {
        MessageResponse res = new MessageResponse("message");
        assertEquals("message", res.getMessage());
        res.setMessage("msg2");
        assertEquals("msg2", res.getMessage());
    }
}
