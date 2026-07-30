package com.fitness.tracker.admin.controller;

import com.fitness.tracker.admin.dto.AdminUserResponse;
import com.fitness.tracker.admin.dto.AdminUserUpdateRequest;
import com.fitness.tracker.admin.dto.AssignRoleRequest;
import com.fitness.tracker.admin.service.AdminUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for admin user management operations.
 */
@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@Tag(name = "Admin - User Management", description = "APIs for managing users by admin")
@SecurityRequirement(name = "bearerAuth")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @Operation(summary = "Get all users", description = "Retrieves a list of all users (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of users",
                    content = @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = AdminUserResponse.class)))),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        List<AdminUserResponse> users = adminUserService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Get user by ID", description = "Retrieves a specific user by ID (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved user",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = AdminUserResponse.class))),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<AdminUserResponse> getUserById(@PathVariable Long userId) {
        AdminUserResponse user = adminUserService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @Operation(summary = "Search users", description = "Searches users by username or email (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully searched users",
                    content = @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = AdminUserResponse.class)))),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    @GetMapping("/search")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<AdminUserResponse>> searchUsers(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email) {
        List<AdminUserResponse> users = adminUserService.searchUsers(username, email);
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Get users by role", description = "Retrieves users by role (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved users by role",
                    content = @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = AdminUserResponse.class)))),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "400", description = "Invalid role name")
    })
    @GetMapping("/role/{roleName}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<AdminUserResponse>> getUsersByRole(
            @Parameter(in = ParameterIn.PATH, description = "Role name (ROLE_USER or ROLE_ADMIN)", required = true)
            @PathVariable String roleName) {
        List<AdminUserResponse> users = adminUserService.getUsersByRole(roleName);
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Update user", description = "Updates a user's information (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully updated user",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = AdminUserResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<AdminUserResponse> updateUser(
            @PathVariable Long userId,
            @Valid @RequestBody AdminUserUpdateRequest request) {
        AdminUserResponse updatedUser = adminUserService.updateUser(userId, request);
        return ResponseEntity.ok(updatedUser);
    }

    @Operation(summary = "Delete user", description = "Deletes a user (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Successfully deleted user"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        adminUserService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Block user", description = "Blocks (disables) a user account (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully blocked user"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PatchMapping("/{userId}/block")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> blockUser(@PathVariable Long userId) {
        adminUserService.blockUser(userId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Unblock user", description = "Unblocks (enables) a user account (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully unblocked user"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PatchMapping("/{userId}/unblock")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> unblockUser(@PathVariable Long userId) {
        adminUserService.unblockUser(userId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Suspend user", description = "Suspends (disables) a user account (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully suspended user"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PutMapping("/{userId}/suspend")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> suspendUser(@PathVariable Long userId) {
        adminUserService.suspendUser(userId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Activate user", description = "Activates (enables) a user account (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully activated user"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PutMapping("/{userId}/activate")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> activateUser(@PathVariable Long userId) {
        adminUserService.activateUser(userId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Reset user password", description = "Resets a user's password and returns temporary password (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully reset password",
                    content = @Content(mediaType = "text/plain")),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PostMapping("/{userId}/reset-password")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> resetPassword(@PathVariable Long userId) {
        String tempPassword = adminUserService.resetPassword(userId);
        return ResponseEntity.ok(tempPassword);
    }

    @Operation(summary = "Assign role to user", description = "Assigns a role to a user (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully assigned role"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "User or role not found")
    })
    @PostMapping("/{userId}/roles")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> assignRole(
            @PathVariable Long userId,
            @Valid @RequestBody AssignRoleRequest request) {
        adminUserService.assignRole(userId, request);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Remove role from user", description = "Removes a role from a user (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully removed role"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "User or role not found")
    })
    @DeleteMapping("/{userId}/roles/{roleName}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> removeRole(
            @PathVariable Long userId,
            @PathVariable String roleName) {
        adminUserService.removeRole(userId, roleName);
        return ResponseEntity.ok().build();
    }
}