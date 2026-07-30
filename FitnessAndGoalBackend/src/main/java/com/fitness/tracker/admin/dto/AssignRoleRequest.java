package com.fitness.tracker.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * Request DTO for assigning role to user.
 */
@Data
public class AssignRoleRequest {

    @NotBlank(message = "Role name is required")
    @Pattern(regexp = "ROLE_USER|ROLE_ADMIN", message = "Role must be either ROLE_USER or ROLE_ADMIN")
    private String roleName;
}