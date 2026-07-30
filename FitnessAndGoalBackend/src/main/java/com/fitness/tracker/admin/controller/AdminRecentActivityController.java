package com.fitness.tracker.admin.controller;

import com.fitness.tracker.admin.dto.RecentGoalResponse;
import com.fitness.tracker.admin.dto.RecentUserResponse;
import com.fitness.tracker.admin.dto.RecentWorkoutResponse;
import com.fitness.tracker.admin.service.AdminRecentActivityService;
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
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST Controller for admin recent activity data.
 */
@RestController
@RequestMapping("/admin/recent")
@RequiredArgsConstructor
@Tag(name = "Admin - Recent Activity", description = "APIs for admin recent activity data")
@SecurityRequirement(name = "bearerAuth")
public class AdminRecentActivityController {

    private final AdminRecentActivityService adminRecentActivityService;

    @Operation(summary = "Get recent users", description = "Retrieves recent users (all users ordered by creation date descending)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved recent users",
                    content = @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = RecentUserResponse.class)))),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    @GetMapping("/users")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<RecentUserResponse>> getRecentUsers(
            @Parameter(in = ParameterIn.QUERY, description = "Maximum number of users to return (default 10)", required = false)
            @RequestParam(defaultValue = "10") int limit) {
        List<RecentUserResponse> recentUsers = adminRecentActivityService.getRecentUsers(limit);
        return ResponseEntity.ok(recentUsers);
    }

    @Operation(summary = "Get recent workouts", description = "Retrieves recent workouts (all workouts ordered by workout date descending)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved recent workouts",
                    content = @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = RecentWorkoutResponse.class)))),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    @GetMapping("/workouts")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<RecentWorkoutResponse>> getRecentWorkouts(
            @Parameter(in = ParameterIn.QUERY, description = "Maximum number of workouts to return (default 10)", required = false)
            @RequestParam(defaultValue = "10") int limit) {
        List<RecentWorkoutResponse> recentWorkouts = adminRecentActivityService.getRecentWorkouts(limit);
        return ResponseEntity.ok(recentWorkouts);
    }

    @Operation(summary = "Get recent goals", description = "Retrieves recent goals (all goals ordered by creation date descending)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved recent goals",
                    content = @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = RecentGoalResponse.class)))),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    @GetMapping("/goals")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<RecentGoalResponse>> getRecentGoals(
            @Parameter(in = ParameterIn.QUERY, description = "Maximum number of goals to return (default 10)", required = false)
            @RequestParam(defaultValue = "10") int limit) {
        List<RecentGoalResponse> recentGoals = adminRecentActivityService.getRecentGoals(limit);
        return ResponseEntity.ok(recentGoals);
    }
}