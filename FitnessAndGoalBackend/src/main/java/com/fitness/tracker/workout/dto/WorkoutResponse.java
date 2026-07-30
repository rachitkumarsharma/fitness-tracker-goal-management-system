package com.fitness.tracker.workout.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Response DTO for workout data.
 */
@Data
@Builder
public class WorkoutResponse {

    private Long id;
    private Long userId;
    private String workoutType;
    private String workoutTypeName;
    private String muscle;
    private String exerciseName;
    private String equipment;
    private String difficulty;
    private Integer sets;
    private Integer reps;
    private Double weight;
    private Double distance;
    private java.time.LocalDate workoutDate;
    private Double calories;
    private Integer duration;
    private String notes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

