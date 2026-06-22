package com.smartcourier.authservice.controller;

import com.smartcourier.authservice.dto.request.LoginRequest;
import com.smartcourier.authservice.dto.request.SignupRequest;
import com.smartcourier.authservice.dto.response.JwtResponse;
import com.smartcourier.authservice.dto.response.MessageResponse;
import com.smartcourier.authservice.entity.Role;
import com.smartcourier.authservice.entity.User;
import com.smartcourier.authservice.repository.UserRepository;
import com.smartcourier.authservice.security.jwt.JwtUtils;
import com.smartcourier.authservice.security.services.UserDetailsImpl;
import com.smartcourier.authservice.dto.request.PasswordChangeRequest;
import com.smartcourier.authservice.dto.request.VerifyOtpRequest;
import com.smartcourier.authservice.dto.response.ProfileResponse;
import com.smartcourier.authservice.service.EmailService;
import com.smartcourier.authservice.service.OtpService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    OtpService otpService;

    @Autowired
    EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        if (!userRepository.existsByUsername(loginRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username not found!"));
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String role = userDetails.getAuthorities().iterator().next().getAuthority();

            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    role));
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Incorrect password!"));
        } catch (org.springframework.security.authentication.DisabledException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User is disabled. Please verify your account."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Login failed."));
        }
    }

    @PostMapping({"/signup", "/register"})
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        Role role;
        if ("nainabhagat2003@gmail.com".equalsIgnoreCase(signUpRequest.getEmail())) {
            role = Role.ROLE_ADMIN;
        } else {
            role = Role.ROLE_CUSTOMER;
        }

        user.setRole(role);
        user.setEnabled(false); // User must verify OTP to be enabled
        userRepository.save(user);

        // Generate and send OTP
        String otp = otpService.generateAndSaveOtp(user.getEmail());
        try {
            emailService.sendOtpEmail(user.getEmail(), otp);
        } catch (Exception e) {
            // Log the error in a real app. For now, continue but maybe the user won't get the email.
            // In dev environment, this prevents crash if SMTP is misconfigured
            e.printStackTrace();
        }

        return ResponseEntity.ok(new MessageResponse("User registered successfully! Please check your email for the OTP."));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        if (otpService.validateOtp(request.getEmail(), request.getOtp())) {
            User user = userRepository.findByUsername(request.getEmail())
                    .orElse(userRepository.findByEmail(request.getEmail())
                            .orElse(null));

            if (user != null) {
                user.setEnabled(true);
                userRepository.save(user);
                otpService.deleteOtp(request.getEmail());
                return ResponseEntity.ok(new MessageResponse("Account verified successfully! You can now log in."));
            } else {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found!"));
            }
        }
        return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid or expired OTP!"));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        return ResponseEntity.ok(new ProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()));
    }

    @PostMapping("/change-password")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<?> changePassword(@Valid @RequestBody PasswordChangeRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        if (!encoder.matches(request.getOldPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Old password is incorrect!"));
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Password changed successfully!"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody com.smartcourier.authservice.dto.request.ForgotPasswordRequest request) {
        // In a real system, you would send an email with a reset link
        return ResponseEntity.ok(new MessageResponse("If an account exists for " + request.getEmail() + ", a password reset link has been sent."));
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{id}/block")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> blockUser(@PathVariable("id") Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setBlocked(true);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User blocked successfully"));
    }

    @PutMapping("/users/{id}/unblock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> unblockUser(@PathVariable("id") Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setBlocked(false);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User unblocked successfully"));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<java.util.List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/users/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteAllUsers() {
        java.util.List<User> users = userRepository.findAll();
        for (User user : users) {
            // Preserve the main admin account
            if (!"nainabhagat2003@gmail.com".equalsIgnoreCase(user.getEmail())) {
                userRepository.delete(user);
            }
        }
        return ResponseEntity.ok(new MessageResponse("All customer accounts cleared successfully."));
    }
}
