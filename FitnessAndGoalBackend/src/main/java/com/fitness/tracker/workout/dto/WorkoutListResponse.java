package com.fitness.tracker.workout.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * Paginated response for workout list.
 */
@Data
@Builder
public class WorkoutListResponse {

    private List<WorkoutResponse> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean first;
    private boolean last;
}
