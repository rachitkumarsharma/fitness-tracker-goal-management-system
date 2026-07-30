package com.fitness.tracker.goal.repository;

import com.fitness.tracker.goal.entity.Goal;
import com.fitness.tracker.goal.entity.GoalStatus;
import com.fitness.tracker.goal.entity.GoalType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Goal entity operations.
 */
@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {

    /**
     * Find all goals by user ID with pagination.
     */
    Page<Goal> findByUserId(Long userId, Pageable pageable);

    /**
     * Find goal by ID and user ID.
     */
    Optional<Goal> findByIdAndUserId(Long id, Long userId);

    /**
     * Find goals by status across all users.
     */
    List<Goal> findByStatus(GoalStatus status);

    /**
     * Find goals by user and status.
     */
    Page<Goal> findByUserIdAndStatus(Long userId, GoalStatus status, Pageable pageable);

    /**
     * Find goals within a start and end date range.
     */
    @Query("SELECT g FROM Goal g WHERE g.startDate >= :startDate AND g.targetDate <= :endDate")
    List<Goal> findGoalsInDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Count active/in-progress goals for a specific user.
     */
    @Query("SELECT COUNT(g) FROM Goal g WHERE g.user.id = :userId AND (g.status = com.fitness.tracker.goal.entity.GoalStatus.ACTIVE OR g.status = com.fitness.tracker.goal.entity.GoalStatus.IN_PROGRESS)")
    Long countActiveGoalsByUserId(@Param("userId") Long userId);

    /**
     * Find goals by user and type.
     */
    Page<Goal> findByUserIdAndGoalType(Long userId, GoalType goalType, Pageable pageable);

    /**
     * Find active goals expiring soon.
     */
    @Query("SELECT g FROM Goal g WHERE g.user.id = :userId AND g.status = 'IN_PROGRESS' AND g.targetDate <= :date ORDER BY g.targetDate ASC")
    List<Goal> findExpiringGoals(@Param("userId") Long userId, @Param("date") LocalDate date);

    /**
     * Count goals by user.
     */
    Long countByUserId(Long userId);

    /**
     * Check if goal exists for user.
     */
    boolean existsByIdAndUserId(Long id, Long userId);

    /**
     * Count all goals.
     */
    @Query("SELECT COUNT(g) FROM Goal g")
    Long countAllGoals();

    /**
     * Count completed goals.
     */
    @Query("SELECT COUNT(g) FROM Goal g WHERE g.status = 'COMPLETED'")
    Long countCompletedGoals();

    /**
     * Get recent goals (all goals ordered by creation date descending).
     */
    @Query("SELECT g FROM Goal g ORDER BY g.createdAt DESC")
    List<Goal> findRecentGoals(Pageable pageable);

    /**
     * Get goal count by status.
     */
    @Query("SELECT g.status, COUNT(g) FROM Goal g GROUP BY g.status")
    List<Object[]> countByStatus();

    /**
     * Count goals ending on a specific date.
     */
    @Query("SELECT COUNT(g) FROM Goal g WHERE g.targetDate = :date")
    Long countByEndDate(@Param("date") LocalDate date);

    /**
     * Count completed goals ending on a specific date.
     */
    @Query("SELECT COUNT(g) FROM Goal g WHERE g.status = 'COMPLETED' AND g.targetDate = :date")
    Long countCompletedByEndDate(@Param("date") LocalDate date);
}

