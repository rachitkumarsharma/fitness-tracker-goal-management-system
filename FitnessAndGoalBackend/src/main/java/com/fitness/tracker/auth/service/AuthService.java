package com.fitness.tracker.auth.service;

import com.fitness.tracker.auth.dto.*;

/**
 * Service interface for authentication operations.
 */
public interface AuthService {

    /**
     * Register a new user.
     */
    RegisterResponse register(RegisterRequest request);

    /**
     * Authenticate user and return tokens.
     */
    LoginResponse login(LoginRequest request);

    /**
     * Refresh access token using refresh token.
     */
    LoginResponse refreshToken(RefreshTokenRequest request);

    /**
     * Logout user and invalidate tokens.
     */
    void logout();

    /**
     * Check if username is available.
     */
    boolean isUsernameAvailable(String username);

    /**
     * Check if email is available.
     */
    boolean isEmailAvailable(String email);
}
