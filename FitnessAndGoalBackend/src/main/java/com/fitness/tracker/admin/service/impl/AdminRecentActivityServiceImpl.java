package com.fitness.tracker.admin.service.impl;

import com.fitness.tracker.admin.dto.RecentGoalResponse;
import com.fitness.tracker.admin.dto.RecentUserResponse;
import com.fitness.tracker.admin.dto.RecentWorkoutResponse;
import com.fitness.tracker.admin.service.AdminRecentActivityService;
import com.fitness.tracker.goal.entity.Goal;
import com.fitness.tracker.goal.repository.GoalRepository;
import com.fitness.tracker.user.entity.User;
import com.fitness.tracker.user.repository.UserRepository;
import com.fitness.tracker.workout.repository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Implementation of admin recent activity service.
 */
@Service
@RequiredArgsConstructor
public class AdminRecentActivityServiceImpl implements AdminRecentActivityService {

    private final UserRepository userRepository;
    private final WorkoutRepository workoutRepository;
    private final GoalRepository goalRepository;

    @Override
    @Transactional(readOnly = true)
    public List<RecentUserResponse> getRecentUsers(int limit) {
        List<RecentUserResponse> recentUsers = new ArrayList<>();
        Pageable pageable = PageRequest.of(0, limit);
        List<User> users = userRepository.findRecentUsers(pageable);

        for (User user : users) {
            RecentUserResponse response = RecentUserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .profilePictureUrl(user.getProfilePictureUrl())
                .createdAt(user.getCreatedAt())
                .build();
            recentUsers.add(response);
        }

        return recentUsers;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecentWorkoutResponse> getRecentWorkouts(int limit) {
        List<RecentWorkoutResponse> recentWorkouts = new ArrayList<>();
        Pageable pageable = PageRequest.of(0, limit);
        List<Object[]> workoutData = workoutRepository.findRecentWorkoutsWithUserInfo(pageable);

        for (Object[] row : workoutData) {
            LocalDate workoutDate = null;
            if (row[4] instanceof LocalDate) {
                workoutDate = (LocalDate) row[4];
            } else if (row[4] instanceof java.sql.Date) {
                workoutDate = ((java.sql.Date) row[4]).toLocalDate();
            }

            RecentWorkoutResponse response = RecentWorkoutResponse.builder()
                .id(row[0] != null ? ((Number) row[0]).longValue() : null)
                .workoutType((String) row[1])
                .workoutName((String) row[2])
                .durationMinutes(row[3] != null ? ((Number) row[3]).intValue() : 0)
                .caloriesBurned(row[4] != null ? ((Number) row[4]).intValue() : 0)
                .workoutDate(workoutDate)
                .username((String) row[6])
                .build();
            recentWorkouts.add(response);
        }

        return recentWorkouts;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecentGoalResponse> getRecentGoals(int limit) {
        List<RecentGoalResponse> recentGoals = new ArrayList<>();
        Pageable pageable = PageRequest.of(0, limit);
        List<Goal> goals = goalRepository.findRecentGoals(pageable);

        for (Goal goal : goals) {
            RecentGoalResponse response = RecentGoalResponse.builder()
                .id(goal.getId())
                .goalName(goal.getTitle())
                .goalType(goal.getGoalType() != null ? goal.getGoalType().name() : null)
                .status(goal.getStatus())
                .target(goal.getTarget())
                .progress(goal.getProgress())
                .startDate(goal.getStartDate())
                .targetDate(goal.getTargetDate())
                .username(goal.getUser() != null ? goal.getUser().getUsername() : null)
                .build();
            recentGoals.add(response);
        }

        return recentGoals;
    }
}

