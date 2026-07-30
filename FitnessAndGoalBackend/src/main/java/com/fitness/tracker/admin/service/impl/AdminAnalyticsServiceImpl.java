package com.fitness.tracker.admin.service.impl;

import com.fitness.tracker.admin.dto.GoalCompletionRateResponse;
import com.fitness.tracker.admin.dto.TopActiveUsersResponse;
import com.fitness.tracker.admin.dto.UserRegistrationTrendResponse;
import com.fitness.tracker.admin.dto.WorkoutTypeDistributionResponse;
import com.fitness.tracker.admin.dto.WorkoutTrendResponse;
import com.fitness.tracker.admin.service.AdminAnalyticsService;
import com.fitness.tracker.user.entity.User;
import com.fitness.tracker.user.repository.UserRepository;
import com.fitness.tracker.workout.entity.Workout;
import com.fitness.tracker.workout.entity.WorkoutType;
import com.fitness.tracker.workout.repository.WorkoutRepository;
import com.fitness.tracker.goal.entity.Goal;
import com.fitness.tracker.goal.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of admin analytics service.
 */
@Service
@RequiredArgsConstructor
public class AdminAnalyticsServiceImpl implements AdminAnalyticsService {

    private final UserRepository userRepository;
    private final WorkoutRepository workoutRepository;
    private final GoalRepository goalRepository;

    @Override
    @Transactional(readOnly = true)
    public List<UserRegistrationTrendResponse> getUserRegistrationTrend(int days) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days - 1); // Include today

        // Using native query for date grouping since JPQL doesn't support DATE() function well in all databases
        // We'll use a simpler approach: get daily counts for the last N days
        List<UserRegistrationTrendResponse> result = new ArrayList<>();

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            Long count = userRepository.countByCreatedAt(date);
            result.add(UserRegistrationTrendResponse.builder()
                    .date(date)
                    .count(count != null ? count : 0L)
                    .build());
        }

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkoutTrendResponse> getWorkoutTrend(int days) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days - 1); // Include today

        List<WorkoutTrendResponse> result = new ArrayList<>();

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            Long count = workoutRepository.countByWorkoutDate(date);
            result.add(WorkoutTrendResponse.builder()
                    .date(date)
                    .count(count != null ? count : 0L)
                    .build());
        }

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<GoalCompletionRateResponse> getGoalCompletionRateTrend(int days) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days - 1); // Include today

        List<GoalCompletionRateResponse> result = new ArrayList<>();

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            // For each date, calculate completion rate of goals that ended on that date
            Long totalGoalsEnded = goalRepository.countByEndDate(date);
            Long completedGoalsEnded = goalRepository.countCompletedByEndDate(date);

            double completionRate = 0.0;
            if (totalGoalsEnded > 0) {
                completionRate = ((double) completedGoalsEnded / totalGoalsEnded) * 100.0;
            }

            result.add(GoalCompletionRateResponse.builder()
                    .date(date)
                    .completionRate(completionRate)
                    .build());
        }

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkoutTypeDistributionResponse> getWorkoutTypeDistribution() {
        // Using the repository method that returns Object[][workoutType, count]
        List<Object[]> results = workoutRepository.countByWorkoutTypeGrouped();

        return results.stream()
                .map(row -> {
                    String typeStr = row[0] != null ? row[0].toString() : "OTHER";

                    Long countVal = row[1] != null ? ((Number) row[1]).longValue() : 0L;

                    return WorkoutTypeDistributionResponse.builder()
                            .workoutType(typeStr)
                            .type(typeStr)
                            .count(countVal)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TopActiveUsersResponse> getTopActiveUsers(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Object[]> results = userRepository.findTopActiveUsers(pageable);

        return results.stream()
                .map(row -> TopActiveUsersResponse.builder()
                        .userId(row[0] != null ? ((Number) row[0]).longValue() : null)
                        .username(row[1] != null ? (String) row[1] : "")
                        .fullName(row[2] != null ? (String) row[2] : "")
                        .workoutCount(row[3] != null ? ((Number) row[3]).longValue() : 0L)
                        .build())
                .collect(Collectors.toList());
    }
}