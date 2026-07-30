package com.fitness.tracker.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Request DTO for user login.
 */
@Data
@Schema(description = "Login request")
public class LoginRequest {

    @NotBlank(message = "Username or email is required")
    @Schema(description = "Username or email", example = "fitness_user", requiredMode = Schema.RequiredMode.REQUIRED)
    private String username;

    @NotBlank(message = "Password is required")
    @Schema(description = "User password", example = "SecurePass123!", requiredMode = Schema.RequiredMode.REQUIRED)
    private String password;
}
