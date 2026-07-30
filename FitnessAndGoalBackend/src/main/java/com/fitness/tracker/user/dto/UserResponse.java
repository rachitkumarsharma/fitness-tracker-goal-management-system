package com.fitness.tracker.user.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * Response DTO for user data.
 */
@Data
@Builder
public class UserResponse {

    private Long id;
    private String name;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String fullName;
    private Integer age;
    private String gender;
    private Double height;
    private Double weight;
    private String profilePictureUrl;
    private Set<String> roles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
