import apiClient from "./apiClient";

/**
 * Transform backend goal response to frontend format.
 */
function transformGoalResponse(goal) {
  return {
    id: goal.id?.toString(),
    user_id: goal.userId,
    title: goal.title || "",
    description: goal.description || "",
    goal_type: goal.goalType?.toLowerCase() || "custom",
    target: goal.target || "",
    progress: goal.progress || "",
    target_value: goal.targetValue ?? null,
    current_value: goal.currentValue ?? null,
    start_date: goal.startDate,
    target_date: goal.targetDate,
    status: (goal.status || "NOT_STARTED").toLowerCase(),
    created_at: goal.createdAt,
    updated_at: goal.updatedAt,
  };
}

/**
 * Get all goals for the current user.
 */
export const getGoals = async () => {
  const response = await apiClient.get("/goals");
  return (response.data.content || []).map(transformGoalResponse);
};

/**
 * Get a single goal by ID.
 */
export const getGoal = async (goalId) => {
  try {
    const response = await apiClient.get(`/goals/${goalId}`);
    return transformGoalResponse(response.data);
  } catch (error) {
    return null;
  }
};

/**
 * Create a new goal.
 */
export const createGoal = async (goal) => {
  const backendGoal = {
    title: goal.title,
    description: goal.description || null,
    goalType: goal.goal_type ? goal.goal_type.toUpperCase() : "CUSTOM",
    target: goal.target || null,
    progress: goal.progress || null,
    targetValue: goal.target_value ?? null,
    currentValue: goal.current_value ?? null,
    startDate: goal.start_date || null,
    targetDate: goal.target_date || null,
    status: goal.status ? goal.status.toUpperCase() : "NOT_STARTED",
  };

  const response = await apiClient.post("/goals", backendGoal);
  return transformGoalResponse(response.data);
};

/**
 * Update an existing goal.
 */
export const updateGoal = async (goalId, updates) => {
  const backendUpdates = {};
  if (updates.title !== undefined) backendUpdates.title = updates.title;
  if (updates.description !== undefined)
    backendUpdates.description = updates.description;
  if (updates.goal_type !== undefined)
    backendUpdates.goalType = updates.goal_type.toUpperCase();
  if (updates.target !== undefined) backendUpdates.target = updates.target;
  if (updates.progress !== undefined)
    backendUpdates.progress = updates.progress;
  if (updates.target_value !== undefined)
    backendUpdates.targetValue = updates.target_value;
  if (updates.current_value !== undefined)
    backendUpdates.currentValue = updates.current_value;
  if (updates.start_date !== undefined)
    backendUpdates.startDate = updates.start_date;
  if (updates.target_date !== undefined)
    backendUpdates.targetDate = updates.target_date;
  if (updates.status !== undefined)
    backendUpdates.status = updates.status.toUpperCase();

  const response = await apiClient.put(`/goals/${goalId}`, backendUpdates);
  return transformGoalResponse(response.data);
};

/**
 * Delete a goal.
 */
export const deleteGoal = async (goalId) => {
  await apiClient.delete(`/goals/${goalId}`);
};

/**
 * Get active goals (status = in_progress).
 */
export const getActiveGoals = async () => {
  const response = await apiClient.get("/goals", {
    params: { status: "IN_PROGRESS" },
  });
  return (response.data.content || []).map(transformGoalResponse);
};

/**
 * Get completed goals.
 */
export const getCompletedGoals = async () => {
  const response = await apiClient.get("/goals", {
    params: { status: "COMPLETED" },
  });
  return (response.data.content || []).map(transformGoalResponse);
};

/**
 * Update goal progress.
 */
export const updateGoalProgress = async (goalId, progress) => {
  const response = await apiClient.put(`/goals/${goalId}/progress`, null, {
    params: { progress },
  });
  return transformGoalResponse(response.data);
};
