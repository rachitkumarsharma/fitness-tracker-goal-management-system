package com.fitness.tracker.admin.service.impl;

import com.fitness.tracker.admin.dto.AdminDashboardStatsResponse;
import com.fitness.tracker.admin.service.AdminDashboardService;
import com.fitness.tracker.user.repository.UserRepository;
import com.fitness.tracker.workout.repository.WorkoutRepository;
import com.fitness.tracker.goal.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of admin dashboard service.
 */
@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final UserRepository userRepository;
    private final WorkoutRepository workoutRepository;
    private final GoalRepository goalRepository;

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardStatsResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        Long newUsersTodayObj = userRepository.countByCreatedAtToday();
        long newUsersToday = newUsersTodayObj != null ? newUsersTodayObj : 0L;
        long activeUsers = userRepository.countByEnabledTrue();
        long totalWorkouts = workoutRepository.countAllWorkouts();
        long totalGoals = goalRepository.countAllGoals();
        long completedGoals = goalRepository.countCompletedGoals();
        Double caloriesBurnedTodayObj = workoutRepository.sumCaloriesToday();
        long caloriesBurnedToday = caloriesBurnedTodayObj != null ? caloriesBurnedTodayObj.longValue() : 0L;
        double averageWorkoutsPerUser = totalUsers > 0 ? (double) totalWorkouts / totalUsers : 0.0;

        return AdminDashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .newUsersToday(newUsersToday)
                .activeUsers(activeUsers)
                .totalWorkouts(totalWorkouts)
                .totalGoals(totalGoals)
                .completedGoals(completedGoals)
                .caloriesBurnedToday(caloriesBurnedToday)
                .averageWorkoutsPerUser(averageWorkoutsPerUser)
                .build();
    }
}

