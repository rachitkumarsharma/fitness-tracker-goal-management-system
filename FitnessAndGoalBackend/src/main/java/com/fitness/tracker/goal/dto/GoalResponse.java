package com.fitness.tracker.goal.dto;

import com.fitness.tracker.goal.entity.GoalStatus;
import com.fitness.tracker.goal.entity.GoalType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Response DTO for goal data.
 */
@Data
@Builder
public class GoalResponse {

    private Long id;
    private Long userId;
    private GoalType goalType;
    private String goalTypeName;
    private String title;
    private String description;
    private String target;
    private String progress;
    private Double targetValue;
    private Double currentValue;
    private LocalDate startDate;
    private LocalDate targetDate;
    private GoalStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

