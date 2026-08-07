package com.project.base.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.project.base.dto.*;
import com.project.base.pojo.*;
import com.project.base.repository.*;
import com.project.base.services.AuthService;
import com.project.base.services.OtpService;
import com.project.base.services.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OtpService otpService;
    
    @PostMapping("/otp/send")
    public ResponseEntity<ApiResponse> sendOtp(@RequestBody @Valid OtpRequestDto dto) {
        try {
            String email = dto.getEmail().trim().toLowerCase();

            if (dto.getPurpose() == OtpPurpose.REGISTRATION) {
                if (userRepository.findByEmail(email).isPresent()) {
                    throw new RuntimeException("An account with this email already exists.");
                }
            } else if (dto.getPurpose() == OtpPurpose.PASSWORD_RESET) {
                if (userRepository.findByEmail(email).isEmpty()) {
                    throw new RuntimeException("No account found with this email.");
                }
            }

            otpService.generateAndSendOtp(dto.getEmail(), dto.getPurpose());
            return ResponseEntity.ok(new ApiResponse("OTP sent to your email."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid AuthRequestDto request) {
        try {
            return ResponseEntity.ok(authService.authenticate(request));
        } catch (org.springframework.security.authentication.DisabledException e) {
            return ResponseEntity.status(403).body(new ApiResponse("Your account has been blocked. Contact support."));
        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(401).body(new ApiResponse("Invalid email or password."));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(
            @RequestParam String email,
            @RequestParam String otp,
            @RequestParam String newPassword) {
        try {
            userService.resetPassword(email, otp, newPassword);
            return ResponseEntity.ok(new ApiResponse("Password updated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody User user) {
        try {
            authService.register(user);
            return ResponseEntity.ok(new ApiResponse("User registered successfully as BUYER"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage()));
        }
    }

    @PostMapping("/register/buyer")
    public ResponseEntity<ApiResponse> registerBuyer(@RequestBody @Valid BuyerRegisterDto dto) {
        try {
            authService.registerBuyer(dto);
            return ResponseEntity.ok(new ApiResponse("Buyer registered successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage()));
        }
    }

    @PostMapping("/register/seller")
    public ResponseEntity<ApiResponse> registerSeller(@RequestBody @Valid SellerRegisterDto dto) {
        try {
            authService.registerSeller(dto);
            return ResponseEntity.ok(new ApiResponse("Seller registered successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage()));
        }
    }
}