package com.fitness.tracker.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request DTO for updating user profile.
 */
@Data
public class UserUpdateRequest {

    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @Size(min = 1, max = 100, message = "First name must be between 1 and 100 characters")
    private String firstName;

    @Size(min = 1, max = 100, message = "Last name must be between 1 and 100 characters")
    private String lastName;

    @Min(value = 1, message = "Age must be at least 1")
    @Max(value = 150, message = "Age must be realistic")
    private Integer age;

    @Size(max = 20, message = "Gender must not exceed 20 characters")
    private String gender;

    private Double height;

    private Double weight;

    @Size(max = 500, message = "Profile picture URL must not exceed 500 characters")
    private String profilePictureUrl;
}
