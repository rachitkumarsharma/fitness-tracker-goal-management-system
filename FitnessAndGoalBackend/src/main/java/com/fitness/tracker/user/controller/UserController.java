package com.fitness.tracker.user.controller;

import com.fitness.tracker.user.dto.UserResponse;
import com.fitness.tracker.user.dto.UserStatsResponse;
import com.fitness.tracker.user.dto.UserUpdateRequest;
import com.fitness.tracker.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for user profile operations.
 */
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "User", description = "User profile management APIs")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    @Operation(summary = "Get current user profile", description = "Retrieves the authenticated user's profile information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved user profile"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUserProfile() {
        Long userId = userService.getCurrentUserId();
        UserResponse user = userService.getUserProfile(userId);
        return ResponseEntity.ok(user);
    }

    @Operation(summary = "Update current user profile", description = "Updates the authenticated user's profile information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully updated user profile"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateCurrentUserProfile(@Valid @RequestBody UserUpdateRequest request) {
        Long userId = userService.getCurrentUserId();
        UserResponse updatedUser = userService.updateUserProfile(userId, request);
        return ResponseEntity.ok(updatedUser);
    }

    @Operation(summary = "Change current user password", description = "Changes the authenticated user's password")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully changed password"),
            @ApiResponse(responseCode = "400", description = "Invalid input data or incorrect current password"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody com.fitness.tracker.user.dto.ChangePasswordRequest request) {
        Long userId = userService.getCurrentUserId();
        userService.changePassword(userId, request);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Delete current user account", description = "Permanently deletes the authenticated user's account")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Successfully deleted user account"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteCurrentUserAccount() {
        Long userId = userService.getCurrentUserId();
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get user statistics", description = "Retrieves workout and goal statistics for the current user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved user statistics"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/me/stats")
    public ResponseEntity<UserStatsResponse> getUserStats() {
        Long userId = userService.getCurrentUserId();
        UserStatsResponse stats = userService.getUserStats(userId);
        return ResponseEntity.ok(stats);
    }
}
