package com.fitness.tracker.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Response DTO for recent user data.
 */
@Data
@Builder
public class RecentUserResponse {

    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String fullName;
    private String profilePictureUrl;
    private LocalDateTime createdAt;
}