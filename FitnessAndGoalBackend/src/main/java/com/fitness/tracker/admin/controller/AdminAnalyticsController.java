package com.fitness.tracker.admin.controller;

import com.fitness.tracker.admin.dto.GoalCompletionRateResponse;
import com.fitness.tracker.admin.dto.TopActiveUsersResponse;
import com.fitness.tracker.admin.dto.UserRegistrationTrendResponse;
import com.fitness.tracker.admin.dto.WorkoutTypeDistributionResponse;
import com.fitness.tracker.admin.dto.WorkoutTrendResponse;
import com.fitness.tracker.admin.service.AdminAnalyticsService;
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
 * REST Controller for admin analytics data.
 */
@RestController
@RequestMapping("/admin/analytics")
@RequiredArgsConstructor
@Tag(name = "Admin - Analytics", description = "APIs for admin analytics and charts data")
@SecurityRequirement(name = "bearerAuth")
public class AdminAnalyticsController {

    private final AdminAnalyticsService adminAnalyticsService;

    @Operation(summary = "Get user registration trend", description = "Retrieves user registration trend for the last N days")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved user registration trend",
                    content = @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = UserRegistrationTrendResponse.class)))),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    @GetMapping("/user-registration-trend")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<UserRegistrationTrendResponse>> getUserRegistrationTrend(
            @Parameter(in = ParameterIn.QUERY, description = "Number of days to look back (default 30)", required = false)
            @RequestParam(defaultValue = "30") int days) {
        List<UserRegistrationTrendResponse> trend = adminAnalyticsService.getUserRegistrationTrend(days);
        return ResponseEntity.ok(trend);
    }

    @Operation(summary = "Get workout trend", description = "Retrieves workout trend for the last N days")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved workout trend",
                    content = @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = WorkoutTrendResponse.class)))),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    @GetMapping("/workout-trend")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<WorkoutTrendResponse>> getWorkoutTrend(
            @Parameter(in = ParameterIn.QUERY, description = "Number of days to look back (default 30)", required = false)
            @RequestParam(defaultValue = "30") int days) {
        List<WorkoutTrendResponse> trend = adminAnalyticsService.getWorkoutTrend(days);
        return ResponseEntity.ok(trend);
    }

    @Operation(summary = "Get goal completion rate trend", description = "Retrieves goal completion rate trend for the last N days")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved goal completion rate trend",
                    content = @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = GoalCompletionRateResponse.class)))),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    @GetMapping("/goal-completion-rate-trend")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<GoalCompletionRateResponse>> getGoalCompletionRateTrend(
            @Parameter(in = ParameterIn.QUERY, description = "Number of days to look back (default 30)", required = false)
            @RequestParam(defaultValue = "30") int days) {
        List<GoalCompletionRateResponse> trend = adminAnalyticsService.getGoalCompletionRateTrend(days);
        return ResponseEntity.ok(trend);
    }

    @Operation(summary = "Get workout type distribution", description = "Retrieves distribution of workouts by type")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved workout type distribution",
                    content = @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = WorkoutTypeDistributionResponse.class)))),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    @GetMapping("/workout-type-distribution")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<WorkoutTypeDistributionResponse>> getWorkoutTypeDistribution() {
        List<WorkoutTypeDistributionResponse> distribution = adminAnalyticsService.getWorkoutTypeDistribution();
        return ResponseEntity.ok(distribution);
    }

    @Operation(summary = "Get top active users", description = "Retrieves top active users by workout count")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved top active users",
                    content = @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = TopActiveUsersResponse.class)))),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    @GetMapping("/top-active-users")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<TopActiveUsersResponse>> getTopActiveUsers(
            @Parameter(in = ParameterIn.QUERY, description = "Maximum number of users to return (default 10)", required = false)
            @RequestParam(defaultValue = "10") int limit) {
        List<TopActiveUsersResponse> topUsers = adminAnalyticsService.getTopActiveUsers(limit);
        return ResponseEntity.ok(topUsers);
    }
}