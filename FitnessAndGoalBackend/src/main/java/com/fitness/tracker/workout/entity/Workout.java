package com.fitness.tracker.workout.entity;

import com.fitness.tracker.common.entity.BaseEntity;
import com.fitness.tracker.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

/**
 * Workout entity representing a fitness activity.
 * Simplified: calories and duration are optional.
 * Workout types are meaningful activities (not muscle groups).
 * Muscle groups are used only for API Ninjas exercise filtering.
 */
@Entity
@Table(name = "workouts", indexes = {
        @Index(name = "idx_workouts_user", columnList = "user_id"),
        @Index(name = "idx_workouts_type", columnList = "workout_type"),
        @Index(name = "idx_workouts_muscle", columnList = "muscle")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Workout extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "workout_type", length = 100)
    private String workoutType;

    @Column(name = "muscle", length = 100)
    private String muscle;

    @Column(name = "exercise_name", length = 255)
    private String exerciseName;

    @Column(name = "equipment", length = 255)
    private String equipment;

    @Column(name = "difficulty", length = 50)
    private String difficulty;

    @Column(name = "sets")
    private Integer sets;

    @Column(name = "reps")
    private Integer reps;

    @Column(name = "weight")
    private Double weight;

    @Column(name = "distance")
    private Double distance;

    @Column(name = "workout_date")
    private java.time.LocalDate workoutDate;

    @Column(name = "calories", nullable = true)
    private Double calories;

    @Column(name = "duration", nullable = true)
    private Integer duration;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    // Helper method to get workout type display name
    public String getWorkoutTypeName() {
        if (workoutType == null) return null;
        try {
            return WorkoutType.valueOf(workoutType).getDisplayName();
        } catch (IllegalArgumentException e) {
            return workoutType;
        }
    }

    public String getType() {
        return workoutType;
    }

    public void setType(String type) {
        this.workoutType = type;
    }

    public Integer getCaloriesBurned() {
        return calories != null ? calories.intValue() : null;
    }

    public void setCaloriesBurned(Integer caloriesBurned) {
        this.calories = caloriesBurned != null ? caloriesBurned.doubleValue() : null;
    }

    public Integer getDurationMinutes() {
        return duration;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.duration = durationMinutes;
    }
}

