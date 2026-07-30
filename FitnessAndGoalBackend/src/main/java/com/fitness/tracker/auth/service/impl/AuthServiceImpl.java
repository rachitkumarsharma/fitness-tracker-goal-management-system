package com.fitness.tracker.auth.service.impl;

import com.fitness.tracker.auth.dto.LoginRequest;
import com.fitness.tracker.auth.dto.LoginResponse;
import com.fitness.tracker.auth.dto.RefreshTokenRequest;
import com.fitness.tracker.auth.dto.RegisterRequest;
import com.fitness.tracker.auth.dto.RegisterResponse;
import com.fitness.tracker.common.enums.ErrorCode;
import com.fitness.tracker.exception.BusinessException;
import com.fitness.tracker.user.entity.Role;
import com.fitness.tracker.user.entity.User;
import com.fitness.tracker.security.entity.RefreshToken;
import com.fitness.tracker.user.repository.RoleRepository;
import com.fitness.tracker.user.repository.UserRepository;
import com.fitness.tracker.security.repository.RefreshTokenRepository;
import com.fitness.tracker.auth.service.AuthService;
import com.fitness.tracker.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.Optional;
import java.util.Set;

/**
 * Implementation of authentication service operations.
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        // Note: profilePictureUrl is not in RegisterRequest, so we leave it null/default

        // Assign default role
        Role userRole = roleRepository.findByName(Role.RoleName.ROLE_USER)
                .orElseThrow(() -> new BusinessException(ErrorCode.INTERNAL_ERROR));
        user.addRole(userRole);

        User savedUser = userRepository.save(user);

        return RegisterResponse.builder()
                .message("User registered successfully")
                .userId(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .fullName(savedUser.getFullName())
                .profilePictureUrl(savedUser.getProfilePictureUrl())
                .createdAt(savedUser.getCreatedAt())
                .updatedAt(savedUser.getUpdatedAt())
                .build();
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            // Generate tokens
            String accessToken = jwtTokenProvider.generateAccessToken(authentication);
            String refreshToken = jwtTokenProvider.generateRefreshToken();

            // Save refresh token to database
            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

            RefreshToken refreshTokenEntity = RefreshToken.builder()
                    .user(user)
                    .token(refreshToken)
                    .expiresAt(java.time.LocalDateTime.now().plusDays(30)) // 30 days expiration
                    .build();
            refreshTokenRepository.save(refreshTokenEntity);

            java.util.Set<String> roles = user.getRoles().stream()
                    .map(role -> role.getName().name())
                    .collect(java.util.stream.Collectors.toSet());

            return LoginResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .expiresIn(jwtTokenProvider.getExpirationInSeconds())
                    .userId(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .fullName(user.getFullName())
                    .roles(roles)
                    .build();
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }
    }

    @Override
    @Transactional
    public LoginResponse refreshToken(RefreshTokenRequest request) {

        RefreshToken storedToken = refreshTokenRepository
                .findByToken(request.getRefreshToken())
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.REFRESH_TOKEN_INVALID));

        if (storedToken.isExpired()) {
            refreshTokenRepository.delete(storedToken);
            throw new BusinessException(ErrorCode.TOKEN_EXPIRED);
        }

        if (Boolean.TRUE.equals(storedToken.getRevoked())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        User user = storedToken.getUser();

        String accessToken =
                jwtTokenProvider.generateAccessToken(user.getUsername());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(storedToken.getToken())
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getExpirationInSeconds())
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .build();
    }

    @Override
    @Transactional
    public void logout() {
        // Extract the current user from security context and revoke their refresh tokens
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

            // Revoke all refresh tokens for this user
            refreshTokenRepository.revokeAllByUserId(user.getId());
        }
    }

    @Override
    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUsername(username);
    }

    @Override
    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmail(email);
    }
}