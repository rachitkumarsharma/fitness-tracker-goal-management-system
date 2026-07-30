package com.fitness.tracker.goal.entity;

import com.fitness.tracker.common.entity.BaseEntity;
import com.fitness.tracker.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Goal entity representing a fitness goal.
 * Supports both String-based (target/progress) and numeric (targetValue/currentValue) fields.
 */
@Entity
@Table(name = "goals", indexes = {
        @Index(name = "idx_goals_user", columnList = "user_id"),
        @Index(name = "idx_goals_status", columnList = "status"),
        @Index(name = "idx_goals_type", columnList = "goal_type"),
        @Index(name = "idx_goals_user_status", columnList = "user_id, status"),
        @Index(name = "idx_goals_target_date", columnList = "target_date"),
        @Index(name = "idx_goals_start_date", columnList = "start_date")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@NamedQueries({
    @NamedQuery(name = "Goal.findActiveGoalsByUserId",
                query = "SELECT g FROM Goal g WHERE g.user.id = :userId AND (g.status = 'ACTIVE' OR g.status = 'IN_PROGRESS')"),
    @NamedQuery(name = "Goal.countActiveGoalsByUserId",
                query = "SELECT COUNT(g) FROM Goal g WHERE g.user.id = :userId AND (g.status = 'ACTIVE' OR g.status = 'IN_PROGRESS')"),
    @NamedQuery(name = "Goal.findGoalsInDateRange",
                query = "SELECT g FROM Goal g WHERE g.startDate >= :startDate AND g.targetDate <= :endDate"),
    @NamedQuery(name = "Goal.getDashboardStats",
                query = "SELECT COUNT(g), COALESCE(SUM(CASE WHEN g.status = 'COMPLETED' THEN 1 ELSE 0 END), 0) FROM Goal g WHERE g.user.id = :userId")
})
public class Goal extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "goal_type", length = 30, nullable = false)
    private GoalType goalType;

    @Column(name = "title", length = 255, nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "target", length = 50)
    private String target;

    @Column(name = "progress", length = 50)
    private String progress;

    @Column(name = "target_value")
    private Double targetValue;

    @Column(name = "current_value")
    @Builder.Default
    private Double currentValue = 0.0;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "target_date")
    private LocalDate targetDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    @Builder.Default
    private GoalStatus status = GoalStatus.NOT_STARTED;

    // Helper methods
    public String getGoalTypeName() {
        return goalType != null ? goalType.getDisplayName() : null;
    }

    public String getDisplayTargetValue() {
        return target;
    }

    public void setDisplayTargetValue(String targetValue) {
        this.target = targetValue;
    }

    public String getDisplayCurrentValue() {
        return progress;
    }

    public void setDisplayCurrentValue(String currentValue) {
        this.progress = currentValue;
    }

    public LocalDate getEndDate() {
        return targetDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.targetDate = endDate;
    }
}

