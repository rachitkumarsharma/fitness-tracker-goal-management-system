package com.fitness.tracker.admin.service;

import com.fitness.tracker.admin.dto.GoalCompletionRateResponse;
import com.fitness.tracker.admin.dto.TopActiveUsersResponse;
import com.fitness.tracker.admin.dto.UserRegistrationTrendResponse;
import com.fitness.tracker.admin.dto.WorkoutTypeDistributionResponse;
import com.fitness.tracker.admin.dto.WorkoutTrendResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Service interface for admin analytics data.
 */
public interface AdminAnalyticsService {

    /**
     * Get user registration trend for the last N days.
     * @param days number of days to look back
     * @return list of user registration data points
     */
    List<UserRegistrationTrendResponse> getUserRegistrationTrend(int days);

    /**
     * Get workout trend for the last N days.
     * @param days number of days to look back
     * @return list of workout data points
     */
    List<WorkoutTrendResponse> getWorkoutTrend(int days);

    /**
     * Get goal completion rate trend for the last N days.
     * @param days number of days to look back
     * @return list of goal completion rate data points
     */
    List<GoalCompletionRateResponse> getGoalCompletionRateTrend(int days);

    /**
     * Get workout type distribution.
     * @return map of workout type to count
     */
    List<WorkoutTypeDistributionResponse> getWorkoutTypeDistribution();

    /**
     * Get top active users by workout count.
     * @param limit maximum number of users to return
     * @return list of top active users
     */
    List<TopActiveUsersResponse> getTopActiveUsers(int limit);
}