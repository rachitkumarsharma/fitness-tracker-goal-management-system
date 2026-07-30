package com.fitness.tracker.admin.dto;

import com.fitness.tracker.goal.entity.GoalStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

/**
 * Response DTO for recent goal data.
 */
@Data
@Builder
public class RecentGoalResponse {

    private Long id;
    private String goalName;
    private String goalType;
    private GoalStatus status;
    private String target;
    private String progress;
    private LocalDate startDate;
    private LocalDate targetDate;
    private String username;
}

