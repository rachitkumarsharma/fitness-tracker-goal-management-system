import apiClient from "./apiClient";

/**
 * Admin API service functions
 * All endpoints require ROLE_ADMIN authority
 */

/**
 * Get dashboard statistics
 * @returns {Promise<Object>} Dashboard statistics
 */
export const getAdminDashboardStats = async () => {
  const response = await apiClient.get("/admin/dashboard/stats");
  return response.data;
};

/**
 * Get recent users
 * @param {number} limit - Maximum number of users to return (default 10)
 * @returns {Promise<Array>} List of recent users
 */
export const getRecentUsers = async (limit = 10) => {
  const response = await apiClient.get(`/admin/recent/users`, {
    params: { limit },
  });
  return response.data;
};

/**
 * Get recent workouts
 * @param {number} limit - Maximum number of workouts to return (default 10)
 * @returns {Promise<Array>} List of recent workouts with user info
 */
export const getRecentWorkouts = async (limit = 10) => {
  const response = await apiClient.get(`/admin/recent/workouts`, {
    params: { limit },
  });
  return response.data;
};

/**
 * Get recent goals
 * @param {number} limit - Maximum number of goals to return (default 10)
 * @returns {Promise<Array>} List of recent goals with user info
 */
export const getRecentGoals = async (limit = 10) => {
  const response = await apiClient.get(`/admin/recent/goals`, {
    params: { limit },
  });
  return response.data;
};

/**
 * Get user registration trend
 * @param {number} days - Number of days to look back (default 30)
 * @returns {Promise<Array>} User registration trend data
 */
export const getUserRegistrationTrend = async (days = 30) => {
  const response = await apiClient.get(
    `/admin/analytics/user-registration-trend`,
    {
      params: { days },
    },
  );
  return response.data;
};

/**
 * Get workout trend
 * @param {number} days - Number of days to look back (default 30)
 * @returns {Promise<Array>} Workout trend data
 */
export const getWorkoutTrend = async (days = 30) => {
  const response = await apiClient.get(`/admin/analytics/workout-trend`, {
    params: { days },
  });
  return response.data;
};

/**
 * Get goal completion rate trend
 * @param {number} days - Number of days to look back (default 30)
 * @returns {Promise<Array>} Goal completion rate trend data
 */
export const getGoalCompletionRateTrend = async (days = 30) => {
  const response = await apiClient.get(
    `/admin/analytics/goal-completion-rate-trend`,
    {
      params: { days },
    },
  );
  return response.data;
};

/**
 * Get workout type distribution
 * @returns {Promise<Array>} Workout type distribution data
 */
export const getWorkoutTypeDistribution = async () => {
  const response = await apiClient.get(
    `/admin/analytics/workout-type-distribution`,
  );
  return response.data;
};

/**
 * Get top active users
 * @param {number} limit - Maximum number of users to return (default 10)
 * @returns {Promise<Array>} Top active users data
 */
export const getTopActiveUsers = async (limit = 10) => {
  const response = await apiClient.get(`/admin/analytics/top-active-users`, {
    params: { limit },
  });
  return response.data;
};

/**
 * Get all users (admin only)
 * @param {number} page - Page number (default 0)
 * @param {number} size - Page size (default 10)
 * @param {string} search - Search term for username/email
 * @returns {Promise<Object>} Paginated list of users
 */
export const getAllUsers = async (page = 0, size = 10, search = "") => {
  const params = { page, size };
  if (search) {
    params.search = search;
  }
  const response = await apiClient.get(`/admin/users`, { params });
  return response.data;
};

/**
 * Get user by ID (admin only)
 * @param {Long} userId - User ID
 * @returns {Promise<Object>} User details
 */
export const getUserById = async (userId) => {
  const response = await apiClient.get(`/admin/users/${userId}`);
  return response.data;
};

/**
 * Update user (admin only)
 * @param {Long} userId - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} Updated user
 */
export const updateUser = async (userId, userData) => {
  const response = await apiClient.put(`/admin/users/${userId}`, userData);
  return response.data;
};

/**
 * Delete user (admin only)
 * @param {Long} userId - User ID
 * @returns {Promise<void>}
 */
export const deleteUser = async (userId) => {
  await apiClient.delete(`/admin/users/${userId}`);
};

/**
 * Block user (admin only)
 * @param {Long} userId - User ID
 * @returns {Promise<void>}
 */
export const blockUser = async (userId) => {
  await apiClient.patch(`/admin/users/${userId}/block`);
};

/**
 * Unblock user (admin only)
 * @param {Long} userId - User ID
 * @returns {Promise<void>}
 */
export const unblockUser = async (userId) => {
  await apiClient.patch(`/admin/users/${userId}/unblock`);
};

/**
 * Suspend/activate user (admin only)
 * @param {Long} userId - User ID
 * @param {boolean} suspended - Whether to suspend or activate
 * @returns {Promise<Object>} Updated user
 */
export const toggleUserSuspension = async (userId, suspended) => {
  const response = await apiClient.put(`/admin/users/${userId}/suspend`, {
    suspended,
  });
  return response.data;
};

/**
 * Assign role to user (admin only)
 * @param {Object} roleData - Role assignment data (userId, roleName)
 * @returns {Promise<Object>} Response message
 */
export const assignRole = async (roleData) => {
  const response = await apiClient.post(`/admin/users/roles`, roleData);
  return response.data;
};

/**
 * Revoke role from user (admin only)
 * @param {Object} roleData - Role removal data (userId, roleName)
 * @returns {Promise<Object>} Response message
 */
export const revokeRole = async (roleData) => {
  const response = await apiClient.delete(`/admin/users/roles`, {
    data: roleData,
  });
  return response.data;
};
