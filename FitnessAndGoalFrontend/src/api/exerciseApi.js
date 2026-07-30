import apiClient from "./apiClient";

/**
 * Search exercises by muscle group.
 * @param {string} muscle - Muscle group (e.g., chest, biceps, legs, abs, back, shoulders, triceps)
 * @returns {Promise<Array>} List of exercises
 */
export const searchByMuscle = async (muscle) => {
  try {
    const response = await apiClient.get("/exercises/search/muscle", {
      params: { muscle },
    });
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching exercises for muscle "${muscle}":`, error);
    throw error;
  }
};

/**
 * Search exercises by name.
 * @param {string} name - Exercise name or partial name
 * @returns {Promise<Array>} List of matching exercises
 */
export const searchByName = async (name) => {
  try {
    const response = await apiClient.get("/exercises/search/name", {
      params: { name },
    });
    return response.data || [];
  } catch (error) {
    console.error(`Error searching exercises by name "${name}":`, error);
    throw error;
  }
};

/**
 * Search exercises by difficulty level.
 * @param {string} difficulty - Difficulty level (beginner, intermediate, expert)
 * @returns {Promise<Array>} List of exercises
 */
export const searchByDifficulty = async (difficulty) => {
  try {
    const response = await apiClient.get("/exercises/search/difficulty", {
      params: { difficulty },
    });
    return response.data || [];
  } catch (error) {
    console.error(
      `Error fetching exercises by difficulty "${difficulty}":`,
      error,
    );
    throw error;
  }
};

/**
 * Search exercises by type.
 * @param {string} type - Exercise type (e.g., cardio, strength, stretching)
 * @returns {Promise<Array>} List of exercises
 */
export const searchByType = async (type) => {
  try {
    const response = await apiClient.get("/exercises/search/type", {
      params: { type },
    });
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching exercises by type "${type}":`, error);
    throw error;
  }
};

/**
 * Search exercises with multiple optional filters.
 * @param {Object} params - Search parameters
 * @param {string} [params.muscle] - Muscle group
 * @param {string} [params.type] - Exercise type
 * @param {string} [params.difficulty] - Difficulty level
 * @param {string} [params.name] - Exercise name
 * @returns {Promise<Array>} List of exercises
 */
export const searchExercises = async ({
  muscle,
  type,
  difficulty,
  name,
} = {}) => {
  try {
    const params = {};
    if (muscle) params.muscle = muscle;
    if (type) params.type = type;
    if (difficulty) params.difficulty = difficulty;
    if (name) params.name = name;

    const response = await apiClient.get("/exercises/search", { params });
    return response.data || [];
  } catch (error) {
    console.error("Error searching exercises:", error);
    throw error;
  }
};
