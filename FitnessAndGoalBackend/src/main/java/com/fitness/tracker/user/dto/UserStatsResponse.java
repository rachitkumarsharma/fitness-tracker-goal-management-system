package com.fitness.tracker.user.dto;

import lombok.Builder;
import lombok.Data;

/**
 * Response DTO for user statistics.
 */
@Data
@Builder
public class UserStatsResponse {

    private Long totalWorkouts;
    private Long totalCaloriesBurned;
    private Long totalDurationMinutes;
    private Long activeGoals;
    private Long completedGoals;
    private Long workoutsThisMonth;
    private Long caloriesThisMonth;
}
