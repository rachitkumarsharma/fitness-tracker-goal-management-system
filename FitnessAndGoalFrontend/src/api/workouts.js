import apiClient from "./apiClient";

/**
 * Map workout type string for API calls (backend expects UPPER_SNAKE_CASE).
 */
function mapWorkoutTypeToBackend(frontendType) {
  const mapping = {
    running: "RUNNING",
    cycling: "CYCLING",
    swimming: "SWIMMING",
    weight_lifting: "WEIGHT_LIFTING",
    weightlifting: "WEIGHT_LIFTING",
    yoga: "YOGA",
    hiit: "HIIT",
    walking: "WALKING",
    cardio: "CARDIO",
    crossfit: "CROSSFIT",
    pilates: "PILATES",
    other: "OTHER",
  };
  return mapping[frontendType] || frontendType?.toUpperCase() || "OTHER";
}

/**
 * Transform backend workout response to frontend format.
 */
function transformWorkoutResponse(workout) {
  return {
    id: workout.id?.toString(),
    user_id: workout.userId,
    workout_type: workout.workoutType?.toLowerCase() || "other",
    workout_type_name: workout.workoutTypeName,
    muscle: workout.muscle || "",
    exercise_name: workout.exerciseName || "",
    equipment: workout.equipment || "",
    difficulty: workout.difficulty || "",
    sets: workout.sets ?? null,
    reps: workout.reps ?? null,
    weight: workout.weight ?? null,
    distance: workout.distance ?? null,
    calories: workout.calories ?? null,
    duration: workout.duration ?? null,
    notes: workout.notes || "",
    created_at: workout.createdAt,
    updated_at: workout.updatedAt,
  };
}

/**
 * Get all workouts for the current user.
 */
export const getWorkouts = async () => {
  const response = await apiClient.get("/workouts");
  return (response.data.content || []).map(transformWorkoutResponse);
};

/**
 * Get a single workout by ID.
 */
export const getWorkout = async (workoutId) => {
  try {
    const response = await apiClient.get(`/workouts/${workoutId}`);
    return transformWorkoutResponse(response.data);
  } catch (error) {
    return null;
  }
};

/**
 * Create a new workout.
 */
export const createWorkout = async (workout) => {
  const backendWorkout = {
    workoutType: mapWorkoutTypeToBackend(workout.workout_type),
    muscle: workout.muscle || null,
    exerciseName: workout.exercise_name || null,
    equipment: workout.equipment || null,
    difficulty: workout.difficulty || null,
    sets: workout.sets || null,
    reps: workout.reps || null,
    weight: workout.weight || null,
    distance: workout.distance || null,
    calories: workout.calories || null,
    duration: workout.duration || null,
    notes: workout.notes || null,
  };

  const response = await apiClient.post("/workouts", backendWorkout);
  return transformWorkoutResponse(response.data);
};

/**
 * Update an existing workout.
 */
export const updateWorkout = async (workoutId, updates) => {
  const backendUpdates = {};
  if (updates.workout_type !== undefined)
    backendUpdates.workoutType = mapWorkoutTypeToBackend(updates.workout_type);
  if (updates.muscle !== undefined) backendUpdates.muscle = updates.muscle;
  if (updates.exercise_name !== undefined)
    backendUpdates.exerciseName = updates.exercise_name;
  if (updates.equipment !== undefined)
    backendUpdates.equipment = updates.equipment;
  if (updates.difficulty !== undefined)
    backendUpdates.difficulty = updates.difficulty;
  if (updates.sets !== undefined) backendUpdates.sets = updates.sets;
  if (updates.reps !== undefined) backendUpdates.reps = updates.reps;
  if (updates.weight !== undefined) backendUpdates.weight = updates.weight;
  if (updates.distance !== undefined)
    backendUpdates.distance = updates.distance;
  if (updates.calories !== undefined)
    backendUpdates.calories = updates.calories;
  if (updates.duration !== undefined)
    backendUpdates.duration = updates.duration;
  if (updates.notes !== undefined) backendUpdates.notes = updates.notes;

  const response = await apiClient.put(
    `/workouts/${workoutId}`,
    backendUpdates,
  );
  return transformWorkoutResponse(response.data);
};

/**
 * Delete a workout.
 */
export const deleteWorkout = async (workoutId) => {
  await apiClient.delete(`/workouts/${workoutId}`);
};

/**
 * Get recent workouts.
 */
export const getRecentWorkouts = async (limit = 5) => {
  const response = await apiClient.get("/workouts/recent", {
    params: { limit },
  });
  return (response.data || []).map(transformWorkoutResponse);
};
