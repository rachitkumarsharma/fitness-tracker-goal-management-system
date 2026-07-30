package com.fitness.tracker.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for workout type distribution data.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutTypeDistributionResponse {

    private String workoutType;
    private String type;
    private Long count;
}