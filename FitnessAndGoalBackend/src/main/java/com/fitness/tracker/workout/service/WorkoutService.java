package com.fitness.tracker.workout.service;

import com.fitness.tracker.workout.dto.WorkoutListResponse;
import com.fitness.tracker.workout.dto.WorkoutRequest;
import com.fitness.tracker.workout.dto.WorkoutResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service interface for workout operations.
 */
public interface WorkoutService {

    /**
     * Create a new workout for the current user.
     */
    WorkoutResponse createWorkout(WorkoutRequest request);

    /**
     * Get workout by ID.
     */
    WorkoutResponse getWorkoutById(Long workoutId);

    /**
     * Get all workouts for current user with pagination.
     */
    WorkoutListResponse getWorkouts(Pageable pageable);

    /**
     * Get workouts by type for current user (type is String, e.g. "RUNNING").
     */
    WorkoutListResponse getWorkoutsByType(String type, Pageable pageable);

    /**
     * Update a workout.
     */
    WorkoutResponse updateWorkout(Long workoutId, WorkoutRequest request);

    /**
     * Delete a workout.
     */
    void deleteWorkout(Long workoutId);

    /**
     * Get recent workouts for current user.
     */
    List<WorkoutResponse> getRecentWorkouts(int limit);
}

