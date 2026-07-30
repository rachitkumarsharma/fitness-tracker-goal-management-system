package com.fitness.tracker.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Response DTO for successful registration.
 */
@Data
@Builder
@Schema(description = "Registration response")
public class RegisterResponse {

    @Schema(description = "Success message", example = "User registered successfully")
    private String message;

    @Schema(description = "Created user ID", example = "1")
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

    @Schema(description = "User profile picture URL", example = "https://example.com/profile.jpg")
    private String profilePictureUrl;

    @Schema(description = "Account creation timestamp", example = "2023-01-01T10:00:00")
    private LocalDateTime createdAt;

    @Schema(description = "Account last update timestamp", example = "2023-01-01T10:00:00")
    private LocalDateTime updatedAt;
}