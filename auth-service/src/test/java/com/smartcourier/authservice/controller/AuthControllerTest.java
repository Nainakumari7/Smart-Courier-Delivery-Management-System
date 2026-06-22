package com.smartcourier.authservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcourier.authservice.dto.request.LoginRequest;
import com.smartcourier.authservice.dto.request.SignupRequest;
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

import com.smartcourier.authservice.entity.Role;
import com.smartcourier.authservice.dto.request.PasswordChangeRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Collections;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import com.smartcourier.authservice.dto.request.ForgotPasswordRequest;

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
            false,
            true,
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
    public void testSignupUsernameAlreadyExists() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("existinguser");
        signupRequest.setEmail("newuser@test.com");
        signupRequest.setPassword("password123");

        Mockito.when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testSignupEmailAlreadyExists() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("newuser");
        signupRequest.setEmail("existing@test.com");
        signupRequest.setPassword("password123");

        Mockito.when(userRepository.existsByUsername("newuser")).thenReturn(false);
        Mockito.when(userRepository.existsByEmail("existing@test.com")).thenReturn(true);

        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testGetCurrentUser() throws Exception {
        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "testuser", "test@test.com", "password", false, true, 
                Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_CUSTOMER")));
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@test.com");
        user.setRole(Role.ROLE_CUSTOMER);

        Mockito.when(userRepository.findById(1L)).thenReturn(java.util.Optional.of(user));

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/auth/me"))
                .andExpect(status().isOk());
    }

    @Test
    public void testChangePasswordSuccess() throws Exception {
        PasswordChangeRequest request = new PasswordChangeRequest();
        request.setOldPassword("oldPass");
        request.setNewPassword("newPass");

        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "testuser", "test@test.com", "oldPass", false, true, 
                Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_CUSTOMER")));
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        User user = new User();
        user.setId(1L);
        user.setPassword("encodedOldPass");
        Mockito.when(userRepository.findById(1L)).thenReturn(java.util.Optional.of(user));
        Mockito.when(passwordEncoder.matches("oldPass", "encodedOldPass")).thenReturn(true);

        mockMvc.perform(post("/auth/change-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    public void testChangePasswordFailure() throws Exception {
        PasswordChangeRequest request = new PasswordChangeRequest();
        request.setOldPassword("wrongPass");
        request.setNewPassword("newPass");

        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "testuser", "test@test.com", "oldPass", false, true, 
                Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_CUSTOMER")));
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        User user = new User();
        user.setId(1L);
        user.setPassword("encodedOldPass");
        Mockito.when(userRepository.findById(1L)).thenReturn(java.util.Optional.of(user));
        Mockito.when(passwordEncoder.matches("wrongPass", "encodedOldPass")).thenReturn(false);

        mockMvc.perform(post("/auth/change-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
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

    @Test
    public void testSignupAdminRole() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setUsername("adminuser");
        signupRequest.setEmail("admin@test.com");
        signupRequest.setPassword("password123");
        signupRequest.setRole("admin");

        Mockito.when(userRepository.existsByUsername("adminuser")).thenReturn(false);
        Mockito.when(userRepository.existsByEmail("admin@test.com")).thenReturn(false);
        Mockito.when(userRepository.save(any(User.class))).thenReturn(new User());

        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk());
    }

    @Test
    public void testBlockUser() throws Exception {
        UserDetailsImpl userDetails = new UserDetailsImpl(2L, "admin", "admin@test.com", "password", false, true, 
                Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_ADMIN")));
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        User user = new User();
        user.setId(1L);
        Mockito.when(userRepository.findById(1L)).thenReturn(java.util.Optional.of(user));

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/auth/users/1/block"))
                .andExpect(status().isOk());
    }

    @Test
    public void testUnblockUser() throws Exception {
        UserDetailsImpl userDetails = new UserDetailsImpl(2L, "admin", "admin@test.com", "password", false, true, 
                Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_ADMIN")));
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        User user = new User();
        user.setId(1L);
        Mockito.when(userRepository.findById(1L)).thenReturn(java.util.Optional.of(user));

        mockMvc.perform(put("/auth/users/1/unblock"))
                .andExpect(status().isOk());
    }

    @Test
    public void testForgotPassword() throws Exception {
        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setEmail("test@test.com");

        mockMvc.perform(post("/auth/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetUserByIdSuccess() throws Exception {
        UserDetailsImpl userDetails = new UserDetailsImpl(2L, "admin", "admin@test.com", "password", false, true, 
                Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_ADMIN")));
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        User user = new User();
        user.setId(1L);
        Mockito.when(userRepository.findById(1L)).thenReturn(java.util.Optional.of(user));

        mockMvc.perform(get("/auth/users/1"))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetUserByIdNotFound() throws Exception {
        UserDetailsImpl userDetails = new UserDetailsImpl(2L, "admin", "admin@test.com", "password", false, true, 
                Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_ADMIN")));
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

        Mockito.when(userRepository.findById(1L)).thenReturn(java.util.Optional.empty());

        mockMvc.perform(get("/auth/users/1"))
                .andExpect(status().isInternalServerError());
    }
}
