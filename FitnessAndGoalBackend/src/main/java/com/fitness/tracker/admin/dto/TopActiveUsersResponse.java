package com.fitness.tracker.admin.dto;

import lombok.Builder;
import lombok.Data;

/**
 * Response DTO for top active users data.
 */
@Data
@Builder
public class TopActiveUsersResponse {

    private Long userId;
    private String username;
    private String fullName;
    private Long workoutCount;
}