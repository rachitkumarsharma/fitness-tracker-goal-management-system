package com.fitness.tracker.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

/**
 * Response DTO for goal completion rate data.
 */
@Data
@Builder
public class GoalCompletionRateResponse {

    private LocalDate date;
    private Double completionRate; // percentage
}