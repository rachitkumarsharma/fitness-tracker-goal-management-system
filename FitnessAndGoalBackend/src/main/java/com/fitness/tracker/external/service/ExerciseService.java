package com.fitness.tracker.external.service;

import com.fitness.tracker.external.dto.ExerciseDTO;

import java.util.List;

/**
 * Service interface for exercise-related operations.
 * Provides methods to search exercises from the external API Ninjas API.
 */
public interface ExerciseService {

    /**
     * Search exercises by muscle group.
     *
     * @param muscle the muscle group to search (e.g., chest, biceps, legs)
     * @return list of exercises for the given muscle group
     */
    List<ExerciseDTO> searchByMuscle(String muscle);

    /**
     * Search exercises by name.
     *
     * @param name the exercise name or partial name to search
     * @return list of matching exercises
     */
    List<ExerciseDTO> searchByName(String name);

    /**
     * Search exercises by difficulty level.
     *
     * @param difficulty the difficulty level (beginner, intermediate, expert)
     * @return list of exercises with the given difficulty
     */
    List<ExerciseDTO> searchByDifficulty(String difficulty);

    /**
     * Search exercises by type.
     *
     * @param type the exercise type (e.g., cardio, strength, stretching)
     * @return list of exercises of the given type
     */
    List<ExerciseDTO> searchByType(String type);
}

