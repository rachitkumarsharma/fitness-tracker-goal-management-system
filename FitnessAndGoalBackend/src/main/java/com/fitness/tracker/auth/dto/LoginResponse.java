package com.fitness.tracker.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.Set;

/**
 * Response DTO for successful login.
 */
@Data
@Builder
@Schema(description = "Login response with JWT tokens")
public class LoginResponse {

    @Schema(description = "JWT access token", example = "eyJhbGciOiJIUzI1NiJ9...")
    private String accessToken;

    @Schema(description = "Refresh token for getting new access tokens", example = "a1b2c3d4-e5f6-...")
    private String refreshToken;

    @Schema(description = "Token type", example = "Bearer")
    private String tokenType;

    @Schema(description = "Token expiration time in seconds", example = "3600")
    private Long expiresIn;

    @Schema(description = "User ID", example = "1")
    private Long userId;

    @Schema(description = "Username", example = "fitness_user")
    private String username;

    @Schema(description = "User email", example = "user@example.com")
    private String email;

    @Schema(description = "User first name", example = "John")
    private String firstName;

    @Schema(description = "User last name", example = "Doe")
    private String lastName;

    @Schema(description = "User full name", example = "John Doe")
    private String fullName;

    @Schema(description = "User roles", example = "[\"ROLE_USER\"]")
    private Set<String> roles;
}
