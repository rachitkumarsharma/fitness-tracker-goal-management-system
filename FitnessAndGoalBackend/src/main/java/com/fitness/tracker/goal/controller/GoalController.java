package com.fitness.tracker.goal.controller;

import com.fitness.tracker.goal.dto.GoalListResponse;
import com.fitness.tracker.goal.dto.GoalRequest;
import com.fitness.tracker.goal.dto.GoalResponse;
import com.fitness.tracker.goal.entity.GoalStatus;
import com.fitness.tracker.goal.entity.GoalType;
import com.fitness.tracker.goal.service.GoalService;
import io.swagger.v3.oas.annotations.Operation;
// import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for goal management operations.
 */
@RestController
@RequestMapping("/goals")
@RequiredArgsConstructor
@Tag(name = "Goal", description = "Goal management APIs")
@SecurityRequirement(name = "bearerAuth")
public class GoalController {

    private final GoalService goalService;

    @Operation(summary = "Create a new goal", description = "Creates a new fitness goal for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Goal created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    @PostMapping
    public ResponseEntity<GoalResponse> createGoal(@Valid @RequestBody GoalRequest request) {
        GoalResponse goal = goalService.createGoal(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(goal);
    }

    @Operation(summary = "Get goal by ID", description = "Retrieves a specific goal by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved goal"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "404", description = "Goal not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<GoalResponse> getGoalById(@PathVariable Long id) {
        GoalResponse goal = goalService.getGoalById(id);
        return ResponseEntity.ok(goal);
    }

    @Operation(summary = "Get all goals", description = "Retrieves paginated list of goals for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved goals"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    @GetMapping
    public ResponseEntity<GoalListResponse> getGoals(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) GoalStatus status,
            @RequestParam(required = false) GoalType type) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        GoalListResponse goals;
        if (status != null) {
            goals = goalService.getGoalsByStatus(status, pageable);
        } else if (type != null) {
            goals = goalService.getGoalsByType(type, pageable);
        } else {
            goals = goalService.getGoals(pageable);
        }

        return ResponseEntity.ok(goals);
    }

    @Operation(summary = "Get expiring goals", description = "Retrieves goals that will expire within the specified days")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved expiring goals"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    @GetMapping("/expiring")
    public ResponseEntity<List<GoalResponse>> getExpiringGoals(
            @RequestParam(defaultValue = "7") int days) {

        List<GoalResponse> goals = goalService.getExpiringGoals(days);
        return ResponseEntity.ok(goals);
    }

    @Operation(summary = "Update a goal", description = "Updates an existing goal entry")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Goal updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "404", description = "Goal not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<GoalResponse> updateGoal(
            @PathVariable Long id,
            @Valid @RequestBody GoalRequest request) {

        GoalResponse goal = goalService.updateGoal(id, request);
        return ResponseEntity.ok(goal);
    }

    @Operation(summary = "Update goal progress", description = "Updates the current progress towards a goal")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Progress updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or goal already completed"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "404", description = "Goal not found")
    })
    @PutMapping("/{id}/progress")
    public ResponseEntity<GoalResponse> updateGoalProgress(
            @PathVariable Long id,
            @RequestParam String progress) {

        GoalResponse goal = goalService.updateGoalProgress(id, progress);
        return ResponseEntity.ok(goal);
    }

    @Operation(summary = "Update goal status", description = "Manually updates the status of a goal")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Status updated successfully"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "404", description = "Goal not found")
    })
    @PatchMapping("/{id}/status")
    public ResponseEntity<GoalResponse> updateGoalStatus(
            @PathVariable Long id,
            @RequestParam GoalStatus status) {

        GoalResponse goal = goalService.updateGoalStatus(id, status);
        return ResponseEntity.ok(goal);
    }

    @Operation(summary = "Delete a goal", description = "Permanently deletes a goal entry")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Goal deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "404", description = "Goal not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
        return ResponseEntity.noContent().build();
    }
}
