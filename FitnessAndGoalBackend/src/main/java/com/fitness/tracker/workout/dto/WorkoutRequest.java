package com.fitness.tracker.workout.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * Request DTO for creating/updating a workout.
 * Simplified: calories and duration are optional.
 */
@Data
public class WorkoutRequest {

    @Size(max = 100, message = "Workout type must not exceed 100 characters")
    private String workoutType;

    @Size(max = 100, message = "Muscle must not exceed 100 characters")
    private String muscle;

    @Size(max = 255, message = "Exercise name must not exceed 255 characters")
    private String exerciseName;

    @Size(max = 255, message = "Equipment must not exceed 255 characters")
    private String equipment;

    @Size(max = 50, message = "Difficulty must not exceed 50 characters")
    private String difficulty;

    @Min(value = 1, message = "Sets must be at least 1")
    @Max(value = 100, message = "Sets cannot exceed 100")
    private Integer sets;

    @Min(value = 1, message = "Reps must be at least 1")
    @Max(value = 1000, message = "Reps cannot exceed 1000")
    private Integer reps;

    @DecimalMin(value = "0.0", message = "Weight must be non-negative")
    private Double weight;

    @DecimalMin(value = "0.0", message = "Distance must be non-negative")
    private Double distance;

    private java.time.LocalDate workoutDate;


    @DecimalMin(value = "0.0", message = "Calories must be non-negative")
    private Double calories;

    @Min(value = 1, message = "Duration must be at least 1 minute")
    @Max(value = 1440, message = "Duration cannot exceed 24 hours (1440 minutes)")
    private Integer duration;

    @Size(max = 2000, message = "Notes must not exceed 2000 characters")
    private String notes;
}

