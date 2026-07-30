package com.fitness.tracker.goal.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * Paginated response for goal list.
 */
@Data
@Builder
public class GoalListResponse {

    private List<GoalResponse> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean first;
    private boolean last;
}
