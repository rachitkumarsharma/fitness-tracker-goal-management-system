package com.fitness.tracker.external.controller;

import com.fitness.tracker.external.dto.ExerciseDTO;
import com.fitness.tracker.external.service.ExerciseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for exercise search operations.
 * Provides endpoints to search exercises from the API Ninjas Exercise API.
 */
@RestController
@RequestMapping("/exercises")
@RequiredArgsConstructor
@Tag(name = "Exercise", description = "Exercise search APIs (powered by API Ninjas)")
@SecurityRequirement(name = "bearerAuth")
public class ExerciseController {

    private final ExerciseService exerciseService;

    @Operation(summary = "Search exercises by muscle group",
            description = "Returns exercises targeting a specific muscle group (e.g., chest, biceps, legs)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Exercises retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid muscle parameter"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    @GetMapping("/search")
    public ResponseEntity<List<ExerciseDTO>> searchExercises(
            @RequestParam(required = false)
            @Parameter(description = "Muscle group to target (e.g., chest, biceps, legs, abs, back)")
            String muscle,
            @RequestParam(required = false)
            @Parameter(description = "Exercise type (e.g., cardio, strength, stretching)")
            String type,
            @RequestParam(required = false)
            @Parameter(description = "Difficulty level (beginner, intermediate, expert)")
            String difficulty,
            @RequestParam(required = false)
            @Parameter(description = "Exercise name to search for")
            String name) {

        List<ExerciseDTO> exercises;

        if (muscle != null && !muscle.isBlank()) {
            exercises = exerciseService.searchByMuscle(muscle);
        } else if (name != null && !name.isBlank()) {
            exercises = exerciseService.searchByName(name);
        } else if (difficulty != null && !difficulty.isBlank()) {
            exercises = exerciseService.searchByDifficulty(difficulty);
        } else if (type != null && !type.isBlank()) {
            exercises = exerciseService.searchByType(type);
        } else {
            exercises = exerciseService.searchByMuscle("chest"); // default
        }

        return ResponseEntity.ok(exercises);
    }

    @Operation(summary = "Search exercises by muscle group",
            description = "Dedicated endpoint to search exercises by muscle group")
    @GetMapping("/search/muscle")
    public ResponseEntity<List<ExerciseDTO>> searchByMuscle(
            @RequestParam
            @Parameter(description = "Muscle group (e.g., chest, biceps, legs, abs, back, shoulders, triceps)")
            String muscle) {
        return ResponseEntity.ok(exerciseService.searchByMuscle(muscle));
    }

    @Operation(summary = "Search exercises by type",
            description = "Dedicated endpoint to search exercises by type")
    @GetMapping("/search/type")
    public ResponseEntity<List<ExerciseDTO>> searchByType(
            @RequestParam
            @Parameter(description = "Exercise type (e.g., cardio, strength, stretching, plyometrics)")
            String type) {
        return ResponseEntity.ok(exerciseService.searchByType(type));
    }

    @Operation(summary = "Search exercises by difficulty",
            description = "Dedicated endpoint to search exercises by difficulty level")
    @GetMapping("/search/difficulty")
    public ResponseEntity<List<ExerciseDTO>> searchByDifficulty(
            @RequestParam
            @Parameter(description = "Difficulty level (beginner, intermediate, expert)")
            String difficulty) {
        return ResponseEntity.ok(exerciseService.searchByDifficulty(difficulty));
    }

    @Operation(summary = "Search exercises by name",
            description = "Dedicated endpoint to search exercises by name")
    @GetMapping("/search/name")
    public ResponseEntity<List<ExerciseDTO>> searchByName(
            @RequestParam
            @Parameter(description = "Exercise name or partial name to search")
            String name) {
        return ResponseEntity.ok(exerciseService.searchByName(name));
    }
}

