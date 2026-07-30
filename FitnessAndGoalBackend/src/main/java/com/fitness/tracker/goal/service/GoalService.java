package com.fitness.tracker.goal.service;

import com.fitness.tracker.goal.dto.GoalListResponse;
import com.fitness.tracker.goal.dto.GoalRequest;
import com.fitness.tracker.goal.dto.GoalResponse;
import com.fitness.tracker.goal.entity.GoalStatus;
import com.fitness.tracker.goal.entity.GoalType;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service interface for goal operations.
 */
public interface GoalService {

    /**
     * Create a new goal for the current user.
     */
    GoalResponse createGoal(GoalRequest request);

    /**
     * Get goal by ID.
     */
    GoalResponse getGoalById(Long goalId);

    /**
     * Get all goals for current user with pagination.
     */
    GoalListResponse getGoals(Pageable pageable);

    /**
     * Get goals by status for current user.
     */
    GoalListResponse getGoalsByStatus(GoalStatus status, Pageable pageable);

    /**
     * Get goals by type for current user.
     */
    GoalListResponse getGoalsByType(GoalType type, Pageable pageable);

    /**
     * Update a goal.
     */
    GoalResponse updateGoal(Long goalId, GoalRequest request);

    /**
     * Update goal progress.
     */
    GoalResponse updateGoalProgress(Long goalId, String progress);

    /**
     * Update goal status.
     */
    GoalResponse updateGoalStatus(Long goalId, GoalStatus status);

    /**
     * Delete a goal.
     */
    void deleteGoal(Long goalId);

    /**
     * Get expiring goals (goals ending soon).
     */
    List<GoalResponse> getExpiringGoals(int days);

    /**
     * Complete achieved goals automatically.
     */
    void completeAchievedGoals();
}

