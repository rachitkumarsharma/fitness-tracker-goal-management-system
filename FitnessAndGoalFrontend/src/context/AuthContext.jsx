import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  signIn as authSignIn,
  signUp as authSignUp,
  signOut as authSignOut,
  getCurrentUser,
  getProfile,
} from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshProfile = useCallback(async () => {
    if (user) {
      try {
        const profileData = await getProfile(user.id);
        setProfile(profileData);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    }
  }, [user]);

  const isAdmin = useCallback(() => {
    return user && user.roles && user.roles.includes("ROLE_ADMIN");
  }, [user]);

  const hasRole = useCallback(
    (role) => {
      return user && user.roles && user.roles.includes(role);
    },
    [user],
  );

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
          const profileData = await getProfile(currentUser.id);
          setProfile(profileData);
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (username, password) => {
    setError(null);
    try {
      const { user: authUser, session } = await authSignIn({
        username,
        password,
      });

      // /auth/login now returns roles in the response.
      // Store user in localStorage for role-based routing
      if (authUser) {
        // Ensure roles is an array
        const userWithRoles = {
          ...authUser,
          roles: authUser.roles || [],
        };
        localStorage.setItem("user", JSON.stringify(userWithRoles));
        setUser(userWithRoles);

        const profileData = await getProfile(userWithRoles.id);
        setProfile(profileData);
      } else {
        // Fallback: fetch current user if login response doesn't have user data
        const currentUser = await getCurrentUser();
        if (currentUser) {
          const userWithRoles = {
            ...currentUser,
            roles: currentUser.roles || [],
          };
          localStorage.setItem("user", JSON.stringify(userWithRoles));
          setUser(userWithRoles);

          const profileData = await getProfile(currentUser.id);
          setProfile(profileData);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
      throw err;
    }
  };

  const signUp = async (username, email, password, firstName, lastName) => {
    setError(null);
    try {
      await authSignUp({
        username,
        email,
        password,
        firstName,
        lastName,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account");
      throw err;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authSignOut();
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      setUser(null);
      setProfile(null);
      localStorage.removeItem("user");
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  if (loading) {
    return <></>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        clearError,
        refreshProfile,
        isAdmin,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
