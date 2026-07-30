package com.fitness.tracker.workout.repository;

import com.fitness.tracker.workout.entity.Workout;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for Workout entity operations.
 */
@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {

    /**
     * Find all workouts by user ID with pagination.
     */
    Page<Workout> findByUserId(Long userId, Pageable pageable);

    /**
     * Find all workouts by user ID without pagination.
     */
    java.util.List<Workout> findByUserId(Long userId);

    /**
     * Get recent workouts for a user (top 10 by workout date).
     */
    java.util.List<Workout> findTop10ByUserIdOrderByWorkoutDateDesc(Long userId);

    /**
     * Calculate dashboard statistics for a user (total workouts and total calories burned).
     */
    @Query("SELECT COUNT(w), COALESCE(SUM(w.calories), 0.0) FROM Workout w WHERE w.user.id = :userId")
    Object[] getUserWorkoutStats(@Param("userId") Long userId);

    /**
     * Find workout by ID and user ID.
     */
    Optional<Workout> findByIdAndUserId(Long id, Long userId);

    /**
     * Find workouts by user and type.
     */
    Page<Workout> findByUserIdAndWorkoutType(Long userId, String workoutType, Pageable pageable);

    /**
     * Count workouts by user ID.
     */
    Long countByUserId(Long userId);

    /**
     * Check if workout exists for user.
     */
    boolean existsByIdAndUserId(Long id, Long userId);

    /**
     * Count all workouts.
     */
    @Query("SELECT COUNT(w) FROM Workout w")
    Long countAllWorkouts();

    /**
     * Get recent workouts with user information for admin dashboard.
     */
    @Query("SELECT w.id, w.workoutType, w.exerciseName, w.duration, w.calories, " +
           "w.createdAt, u.username " +
           "FROM Workout w JOIN w.user u " +
           "ORDER BY w.createdAt DESC")
    java.util.List<Object[]> findRecentWorkoutsWithUserInfo(Pageable pageable);

    /**
     * Count workouts by type (for distribution analytics).
     */
    @Query("SELECT w.workoutType, COUNT(w) FROM Workout w GROUP BY w.workoutType")
    java.util.List<Object[]> countByWorkoutTypeGrouped();

    /**
     * Count workouts by date (for workout trend).
     */
    @Query("SELECT COUNT(w) FROM Workout w WHERE w.workoutDate = :date")
    Long countByWorkoutDate(@Param("date") java.time.LocalDate date);

    /**
     * Sum calories for all workouts today.
     */
    @Query("SELECT COALESCE(SUM(w.calories), 0.0) FROM Workout w WHERE w.workoutDate = CURRENT_DATE")
    Double sumCaloriesToday();
}

