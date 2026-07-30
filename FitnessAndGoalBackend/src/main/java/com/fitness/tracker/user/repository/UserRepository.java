package com.fitness.tracker.user.repository;

import com.fitness.tracker.user.entity.User;
import com.fitness.tracker.user.entity.Role;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository for User entity operations.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by username.
     */
    Optional<User> findByUsername(String username);

    /**
     * Find user by email.
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if username exists.
     */
    boolean existsByUsername(String username);

    /**
     * Check if email exists.
     */
    boolean existsByEmail(String email);

    /**
     * Find user by username or email (for login).
     */
    @Query("SELECT u FROM User u WHERE u.username = :identifier OR u.email = :identifier")
    Optional<User> findByUsernameOrEmail(@Param("identifier") String identifier);

    /**
     * Find user with roles by username.
     */
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.username = :username")
    Optional<User> findByUsernameWithRoles(@Param("username") String username);

    /**
     * Check if user has a specific role.
     */
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u JOIN u.roles r WHERE u.id = :userId AND r.name = :roleName")
    boolean hasRole(@Param("userId") Long userId, @Param("roleName") Role.RoleName roleName);

    /**
     * Search users by username or email (for admin).
     */
    @Query("SELECT u FROM User u WHERE (LOWER(u.username) LIKE LOWER(CONCAT('%', :username, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%')))")
    List<User> findByUsernameContainingOrEmailContaining(@Param("username") String username, @Param("email") String email);

    /**
     * Find users by role name (for admin).
     */
    @Query("SELECT DISTINCT u FROM User u JOIN u.roles r WHERE r.name = :roleName")
    List<User> findByRoles_Name(@Param("roleName") Role.RoleName roleName);

    /**
     * Count users created today.
     */
    @Query("SELECT COUNT(u) FROM User u WHERE CAST(u.createdAt AS date) = CURRENT_DATE")
    Long countByCreatedAtToday();

    /**
     * Count enabled users (active users).
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.enabled = true")
    Long countByEnabledTrue();

    /**
     * Find users by username containing (case insensitive).
     */
    @Query("SELECT u FROM User u WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :username, '%'))")
    List<User> findByUsernameContainingIgnoreCase(@Param("username") String username);

    /**
     * Find users by email containing (case insensitive).
     */
    @Query("SELECT u FROM User u WHERE LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%'))")
    List<User> findByEmailContainingIgnoreCase(@Param("email") String email);

    /**
     * Count users created on a specific date.
     */
    @Query("SELECT COUNT(u) FROM User u WHERE CAST(u.createdAt AS date) = :date")
    Long countByCreatedAt(@Param("date") LocalDate date);

    /**
     * Find top active users by workout count with limit.
     */
    @Query("SELECT u.id, u.username, CONCAT(u.firstName, ' ', u.lastName), COUNT(w) " +
           "FROM User u LEFT JOIN Workout w ON u.id = w.user.id " +
           "GROUP BY u.id, u.username, u.firstName, u.lastName " +
           "ORDER BY COUNT(w) DESC")
    List<Object[]> findTopActiveUsers(Pageable pageable);

    /**
     * Get recent users (all users ordered by creation date descending).
     */
    @Query("SELECT u FROM User u ORDER BY u.createdAt DESC")
    List<User> findRecentUsers(Pageable pageable);
}
