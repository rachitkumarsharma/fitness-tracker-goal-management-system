package com.fitness.tracker.user.service;

import com.fitness.tracker.user.dto.UserResponse;
import com.fitness.tracker.user.dto.UserStatsResponse;
import com.fitness.tracker.user.dto.UserUpdateRequest;
import com.fitness.tracker.user.entity.User;

/**
 * Service interface for user operations.
 */
public interface UserService {

    /**
     * Get current authenticated user.
     */
    User getCurrentUser();

    /**
     * Get current user ID.
     */
    Long getCurrentUserId();

    /**
     * Get user by ID.
     */
    User getUserById(Long id);

    /**
     * Get user profile.
     */
    UserResponse getUserProfile(Long userId);

    /**
     * Update user profile.
     */
    UserResponse updateUserProfile(Long userId, UserUpdateRequest request);

    /**
     * Delete user account.
     */
    void deleteUser(Long userId);

    /**
     * Change user password.
     */
    void changePassword(Long userId, com.fitness.tracker.user.dto.ChangePasswordRequest request);

    /**
     * Get user statistics.
     */
    UserStatsResponse getUserStats(Long userId);

    /**
     * Check if user exists.
     */
    boolean userExists(Long userId);
}
