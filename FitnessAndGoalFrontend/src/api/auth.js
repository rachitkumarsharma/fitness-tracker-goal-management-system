import apiClient from "./apiClient";

const mapUserResponse = (userData) => ({
  id: (userData?.id ?? userData?.userId ?? "").toString(),
  email: userData?.email ?? "",
  full_name:
    userData?.fullName ||
    `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim(),
  avatar_url: userData?.profilePictureUrl ?? null,
  fitness_level: "beginner",
  role: userData?.roles?.length > 0 ? Array.from(userData.roles)[0] : "ROLE_USER",
  roles: userData?.roles || [],
  created_at: userData?.createdAt || new Date().toISOString(),
  updated_at: userData?.updatedAt || new Date().toISOString(),
});

export const signUp = async ({
  username,
  email,
  password,
  firstName,
  lastName,
}) => {
  const response = await apiClient.post("/auth/register", {
    username,
    email,
    password,
    firstName,
    lastName,
  });

  return response.data;
};

export const signIn = async ({ username, password }) => {
  const response = await apiClient.post("/auth/login", {
    username,
    password,
  });

  // Store tokens
  const { accessToken, refreshToken } = response.data;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  // Return user data in the format expected by the frontend
  return {
    user: mapUserResponse(response.data),
    session: {
      access_token: accessToken,
      refresh_token: refreshToken,
    },
  };
};

export const signOut = async () => {
  try {
    await apiClient.post("/auth/logout");
  } catch (error) {
    // Ignore logout errors
  }

  // Clear tokens
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
};

export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get("/users/me");
    return mapUserResponse(response.data);
  } catch (error) {
    return null;
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await apiClient.put("/users/change-password", {
    currentPassword,
    newPassword,
  });
  return response.data;
};

export const updateCurrentUser = async (updates) => {
  const backendUpdates = {};
  if (updates.firstName !== undefined)
    backendUpdates.firstName = updates.firstName;
  if (updates.lastName !== undefined)
    backendUpdates.lastName = updates.lastName;
  if (updates.avatar_url !== undefined)
    backendUpdates.profilePictureUrl = updates.avatar_url;

  const response = await apiClient.put("/users/me", backendUpdates);
  return mapUserResponse(response.data);
};

export const deleteCurrentUser = async () => {
  await apiClient.delete("/users/me");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
};

export const getProfile = async (userId) => {
  try {
    const response = await apiClient.get("/users/me");
    return mapUserResponse(response.data);
  } catch (error) {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return mapUserResponse(response.data);
    } catch (fallbackError) {
      return null;
    }
  }
};

export const updateProfile = async (userId, updates) => {
  // Map frontend Profile updates to backend UserUpdateRequest
  const backendUpdates = {};

  if (updates.full_name !== undefined) {
    const nameParts = updates.full_name.split(" ");
    if (nameParts.length >= 2) {
      backendUpdates.firstName = nameParts[0];
      backendUpdates.lastName = nameParts.slice(1).join(" ");
    } else if (nameParts.length === 1) {
      // backward compatibility
    }
    // backward compatibility
  }

  if (updates.avatar_url !== undefined) {
    backendUpdates.profilePictureUrl = updates.avatar_url;
  }

  const response = await apiClient.put(`/users/me`, backendUpdates);
  return mapUserResponse(response.data);
};

export const checkUsernameAvailability = async (username) => {
  const response = await apiClient.get("/auth/check-username", {
    params: { username },
  });
  return response.data;
};

export const checkEmailAvailability = async (email) => {
  const response = await apiClient.get("/auth/check-email", {
    params: { email },
  });
  return response.data;
};

export const getUserStats = async () => {
  const response = await apiClient.get("/users/me/stats");
  return response.data;
};
