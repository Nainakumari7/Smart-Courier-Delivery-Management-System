package com.smartcourier.authservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcourier.authservice.dto.request.LoginRequest;
import com.smartcourier.authservice.dto.request.SignupRequest;
import com.smartcourier.authservice.entity.Role;
import com.smartcourier.authservice.entity.User;
import com.smartcourier.authservice.repository.UserRepository;
import com.smartcourier.authservice.security.jwt.JwtUtils;
import com.smartcourier.authservice.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private JwtUtils jwtUtils;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        Mockito.when(passwordEncoder.encode(any(CharSequence.class))).thenReturn("encodedPassword");
    }

    @Test
    public void testLoginSuccess() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password");

        UserDetailsImpl userDetails = new UserDetailsImpl(
            1L, 
            "testuser", 
            "test@test.com", 
            "password", 
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER"))
        );

        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        Mockito.when(authenticationManager.authenticate(any(Authentication.class))).thenReturn(auth);
        Mockito.when(jwtUtils.generateJwtToken(any(Authentication.class))).thenReturn("mock-token");

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk());
    }

    @Test
    public void testSignupSuccess() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("newuser");
        signupRequest.setEmail("newuser@test.com");
        signupRequest.setPassword("password123");

        Mockito.when(userRepository.existsByUsername("newuser")).thenReturn(false);
        Mockito.when(userRepository.existsByEmail("newuser@test.com")).thenReturn(false);
        Mockito.when(userRepository.save(any(User.class))).thenReturn(new User());

        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk());
    }
}
