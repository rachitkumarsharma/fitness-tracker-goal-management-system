package com.fitness.tracker.admin.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request DTO for updating user by admin.
 */
@Data
public class AdminUserUpdateRequest {

    @Size(min = 2, max = 100, message = "First name must be between 2 and 100 characters")
    private String firstName;

    @Size(min = 2, max = 100, message = "Last name must be between 2 and 100 characters")
    private String lastName;

    @Size(max = 500, message = "Profile picture URL must not exceed 500 characters")
    private String profilePictureUrl;

    /**
     * Whether the account is enabled (active) or disabled (suspended).
     */
    private Boolean enabled;

    /**
     * Whether the account is not locked (true) or locked (false).
     */
    private Boolean accountNonLocked;
}