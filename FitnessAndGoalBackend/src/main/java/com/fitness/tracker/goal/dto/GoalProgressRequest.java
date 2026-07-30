package com.fitness.tracker.goal.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

/**
 * Request DTO for updating goal progress.
 */
@Data
public class GoalProgressRequest {

    @NotNull(message = "Current value is required")
    @DecimalMin(value = "0.0", message = "Current value must be non-negative")
    @Digits(integer = 10, fraction = 4, message = "Current value format invalid")
    private BigDecimal currentValue;
}