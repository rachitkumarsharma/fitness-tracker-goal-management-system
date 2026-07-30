package com.fitness.tracker.workout.controller;

import com.fitness.tracker.workout.dto.WorkoutListResponse;
import com.fitness.tracker.workout.dto.WorkoutRequest;
import com.fitness.tracker.workout.dto.WorkoutResponse;
import com.fitness.tracker.workout.service.WorkoutService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
 * REST Controller for workout management operations.
 */
@RestController
@RequestMapping("/workouts")
@RequiredArgsConstructor
@Tag(name = "Workout", description = "Workout management APIs")
@SecurityRequirement(name = "bearerAuth")
public class WorkoutController {

    private final WorkoutService workoutService;

    @Operation(summary = "Create a new workout", description = "Logs a new workout activity for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Workout created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    @PostMapping
    public ResponseEntity<WorkoutResponse> createWorkout(@Valid @RequestBody WorkoutRequest request) {
        WorkoutResponse workout = workoutService.createWorkout(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(workout);
    }

    @Operation(summary = "Get workout by ID", description = "Retrieves a specific workout by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved workout"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "404", description = "Workout not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<WorkoutResponse> getWorkoutById(@PathVariable Long id) {
        WorkoutResponse workout = workoutService.getWorkoutById(id);
        return ResponseEntity.ok(workout);
    }

    @Operation(summary = "Get all workouts", description = "Retrieves paginated list of workouts for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved workouts"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    @GetMapping
    public ResponseEntity<WorkoutListResponse> getWorkouts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String type) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        WorkoutListResponse workouts;
        if (type != null && !type.isEmpty()) {
            workouts = workoutService.getWorkoutsByType(type, pageable);
        } else {
            workouts = workoutService.getWorkouts(pageable);
        }

        return ResponseEntity.ok(workouts);
    }

    @Operation(summary = "Get recent workouts", description = "Retrieves the most recent workouts for the user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved recent workouts"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    @GetMapping("/recent")
    public ResponseEntity<List<WorkoutResponse>> getRecentWorkouts(
            @RequestParam(defaultValue = "5") int limit) {

        List<WorkoutResponse> workouts = workoutService.getRecentWorkouts(limit);
        return ResponseEntity.ok(workouts);
    }

    @Operation(summary = "Update a workout", description = "Updates an existing workout entry")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Workout updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "404", description = "Workout not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<WorkoutResponse> updateWorkout(
            @PathVariable Long id,
            @Valid @RequestBody WorkoutRequest request) {

        WorkoutResponse workout = workoutService.updateWorkout(id, request);
        return ResponseEntity.ok(workout);
    }

    @Operation(summary = "Delete a workout", description = "Permanently deletes a workout entry")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Workout deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "404", description = "Workout not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable Long id) {
        workoutService.deleteWorkout(id);
        return ResponseEntity.noContent().build();
    }
}

