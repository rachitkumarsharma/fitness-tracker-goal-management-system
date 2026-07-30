package com.fitness.tracker.goal.dto;

import com.fitness.tracker.goal.entity.GoalType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

/**
 * Request DTO for creating/updating a goal.
 * Supports both String-based target/progress and Double-based targetValue/currentValue.
 */
@Data
public class GoalRequest {

    private GoalType goalType;

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @Size(max = 50, message = "Target must not exceed 50 characters")
    private String target;

    @Size(max = 50, message = "Progress must not exceed 50 characters")
    private String progress;

    @DecimalMin(value = "0.0", message = "Target value must be non-negative")
    private Double targetValue;

    @DecimalMin(value = "0.0", message = "Current value must be non-negative")
    private Double currentValue;

    private LocalDate startDate;

    private LocalDate targetDate;

    private String status;
}

