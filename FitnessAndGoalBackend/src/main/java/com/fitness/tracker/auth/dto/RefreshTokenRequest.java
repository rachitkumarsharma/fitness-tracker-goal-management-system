package com.fitness.tracker.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Request DTO for refreshing access token.
 */
@Data
@Schema(description = "Refresh token request")
public class RefreshTokenRequest {

    @NotBlank(message = "Refresh token is required")
    @Schema(description = "Refresh token", example = "a1b2c3d4-e5f6-...", requiredMode = Schema.RequiredMode.REQUIRED)
    private String refreshToken;
}
