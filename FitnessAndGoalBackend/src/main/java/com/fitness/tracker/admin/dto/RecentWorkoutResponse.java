package com.fitness.tracker.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

/**
 * Response DTO for recent workout data.
 */
@Data
@Builder
public class RecentWorkoutResponse {

    private Long id;
    private String workoutName;
    private String workoutType;
    private Integer durationMinutes;
    private Integer caloriesBurned;
    private LocalDate workoutDate;
    private String username;
}