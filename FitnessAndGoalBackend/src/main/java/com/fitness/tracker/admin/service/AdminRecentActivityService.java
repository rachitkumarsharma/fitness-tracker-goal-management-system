package com.fitness.tracker.admin.service;

import com.fitness.tracker.admin.dto.RecentGoalResponse;
import com.fitness.tracker.admin.dto.RecentUserResponse;
import com.fitness.tracker.admin.dto.RecentWorkoutResponse;

import java.util.List;

/**
 * Service interface for admin recent activity data.
 */
public interface AdminRecentActivityService {

    /**
     * Get recent users (all users ordered by creation date descending).
     * @param limit maximum number of users to return
     * @return list of recent users
     */
    List<RecentUserResponse> getRecentUsers(int limit);

    /**
     * Get recent workouts (all workouts ordered by workout date descending).
     * @param limit maximum number of workouts to return
     * @return list of recent workouts
     */
    List<RecentWorkoutResponse> getRecentWorkouts(int limit);

    /**
     * Get recent goals (all goals ordered by creation date descending).
     * @param limit maximum number of goals to return
     * @return list of recent goals
     */
    List<RecentGoalResponse> getRecentGoals(int limit);
}