package com.examly.springapp.service;

import com.examly.springapp.dto.AuthRequest;
import com.examly.springapp.dto.AuthResponse;
import com.examly.springapp.dto.RegisterRequest;
import com.examly.springapp.exception.InvalidNameException;
import com.examly.springapp.exception.InvalidPhoneException;
import com.examly.springapp.model.AuditLog;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.AuditLogRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    public AuthResponse register(RegisterRequest request) {
        // Validate name: alphabetic and spaces only, 2-100 chars
        if (request.getFullName() == null || !request.getFullName().matches("^[a-zA-Z\\s]{2,100}$")) {
            throw new InvalidNameException("Name must not contain numbers or special characters");
        }

        // Validate phone: exactly 10 digits
        if (request.getPhoneNumber() == null || !request.getPhoneNumber().matches("^\\d{10}$")) {
            throw new InvalidPhoneException("Phone Number must be exactly 10 digits long");
        }

        // Validate unique email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("This email is already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPhoneNumber(request.getPhoneNumber().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : "USER");

        if (request.getPanNumber() != null && !request.getPanNumber().isBlank()) {
            user.setPanHash(hashPan(request.getPanNumber()));
        }

        userRepository.save(user);

        // Audit log
        auditLogRepository.save(new AuditLog(user.getId(), user.getEmail(), user.getRole(), "USER_REGISTER", "AUTH", "127.0.0.1"));

        String token = jwtUtils.generateToken(user.getId(), user.getEmail(), user.getRole());
        String refreshToken = jwtUtils.generateToken(user.getId(), user.getEmail(), "REFRESH");

        return new AuthResponse(token, refreshToken, user.getId(), user.getEmail(), user.getFullName(), user.getRole());
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials. Please check your email and password."));

        // Audit log
        auditLogRepository.save(new AuditLog(user.getId(), user.getEmail(), user.getRole(), "USER_LOGIN", "AUTH", "127.0.0.1"));

        String token = jwtUtils.generateToken(user.getId(), user.getEmail(), user.getRole());
        String refreshToken = jwtUtils.generateToken(user.getId(), user.getEmail(), "REFRESH");

        return new AuthResponse(token, refreshToken, user.getId(), user.getEmail(), user.getFullName(), user.getRole());
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found: " + authentication.getName()));
    }

    private String hashPan(String pan) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(pan.trim().toUpperCase().getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : encodedhash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            return pan;
        }
    }
}
