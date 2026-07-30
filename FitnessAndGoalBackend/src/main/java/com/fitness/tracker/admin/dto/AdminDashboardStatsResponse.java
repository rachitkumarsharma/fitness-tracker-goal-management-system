package com.fitness.tracker.admin.dto;

import lombok.Builder;
import lombok.Data;

/**
 * Response DTO for admin dashboard statistics.
 */
@Data
@Builder
public class AdminDashboardStatsResponse {

    private Long totalUsers;
    private Long newUsersToday;
    private Long activeUsers;
    private Long totalWorkouts;
    private Long totalGoals;
    private Long completedGoals;
    private Long caloriesBurnedToday;
    private Double averageWorkoutsPerUser;
}