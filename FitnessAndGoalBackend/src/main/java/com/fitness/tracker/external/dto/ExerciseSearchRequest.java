package com.fitness.tracker.external.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Search request parameters for querying exercises from API Ninjas.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseSearchRequest {

    private String muscle;
    private String type;
    private String difficulty;
    private String name;
    private Integer offset;
}

