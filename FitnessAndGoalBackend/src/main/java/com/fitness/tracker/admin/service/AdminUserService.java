package com.fitness.tracker.admin.service;

import com.fitness.tracker.admin.dto.AdminUserResponse;
import com.fitness.tracker.admin.dto.AdminUserUpdateRequest;
import com.fitness.tracker.admin.dto.AssignRoleRequest;
import com.fitness.tracker.user.entity.User;

import java.util.List;

/**
 * Service interface for admin user management operations.
 */
public interface AdminUserService {

    /**
     * Get all users (for admin).
     * @return list of admin user responses
     */
    List<AdminUserResponse> getAllUsers();

    /**
     * Get user by ID (for admin).
     * @param userId the user ID
     * @return admin user response
     */
    AdminUserResponse getUserById(Long userId);

    /**
     * Search users by username or email (for admin).
     * @param username username to search (can be partial
     * @param email email to search partial
     * @return list of admin user responses
     */
    List<AdminUserResponse> searchUsers(String username, String email);

    /**
     * Get users by role (for admin).
     * @param roleName role name (ROLE_USER or ROLE_ADMIN)
     * @return list of admin user responses
     */
    List<AdminUserResponse> getUsersByRole(String roleName);

    /**
     * Update user by admin.
     * @param userId the user ID
     * @param request the update request
     * @return updated admin user response
     */
    AdminUserResponse updateUser(Long userId, AdminUserUpdateRequest request);

    /**
     * Delete user by admin.
     * @param userId the user ID
     */
    void deleteUser(Long userId);

    /**
     * Block user (disable account).
     * @param userId the user ID
     */
    void blockUser(Long userId);

    /**
     * Unblock user (enable account).
     * @param userId the user ID
     */
    void unblockUser(Long userId);

    /**
     * Suspend user (disable account).
     * @param userId the user ID
     */
    void suspendUser(Long userId);

    /**
     * Activate user (enable account).
     * @param userId the user ID
     */
    void activateUser(Long userId);

    /**
     * Reset user password (generate temporary password and return it).
     * @param userId the user ID
     * @return temporary password
     */
    String resetPassword(Long userId);

    /**
     * Assign role to user.
     * @param userId the user ID
     * @param request the role assignment request
     */
    void assignRole(Long userId, AssignRoleRequest request);

    /**
     * Remove role from user.
     * @param userId the user ID
     * @param roleName the role name to remove
     */
    void removeRole(Long userId, String roleName);
}