package com.fitness.tracker.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

/**
 * Response DTO for workout trend data.
 */
@Data
@Builder
public class WorkoutTrendResponse {

    private LocalDate date;
    private Long count;
}