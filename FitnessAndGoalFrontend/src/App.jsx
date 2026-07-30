import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, ThemeProvider } from "./context";
import { ProtectedRoute, PublicRoute } from "./routes";
import { AdminProtectedRoute, AdminPublicRoute } from "./routes/AdminRoute";
import { Layout } from "./components/layout";
import { AdminLayout } from "./components/layout/AdminLayout";
import {
  LoginPage,
  RegisterPage,
  DashboardPage,
  WorkoutsPage,
  GoalsPage,
  ProfilePage,
  HomePage,
  AboutPage,
  ContactPage,
  ExercisesPage,
  HealthyFoodPage,
  FitnessTipsPage,
} from "./pages";
import {
  AdminDashboard,
  AdminUsers,
  AdminRecentWorkouts,
  AdminRecentGoals,
  AdminAnalytics,
} from "./pages/admin";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />

            {/* Protected User Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/workouts"
              element={
                <ProtectedRoute>
                  <Layout>
                    <WorkoutsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/goals"
              element={
                <ProtectedRoute>
                  <Layout>
                    <GoalsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Profile Route */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProfilePage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <AdminProtectedRoute>
                  <AdminLayout>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route
                        path="recent/workouts"
                        element={<AdminRecentWorkouts />}
                      />
                      <Route
                        path="recent/goals"
                        element={<AdminRecentGoals />}
                      />
                      <Route path="analytics" element={<AdminAnalytics />} />
                      <Route path="profile" element={<ProfilePage />} />
                      <Route
                        path="*"
                        element={<Navigate to="/admin/dashboard" replace />}
                      />
                    </Routes>
                  </AdminLayout>
                </AdminProtectedRoute>
              }
            />

            {/* Public Website */}
            <Route path="/" element={<HomePage />} />
            <Route
              path="/about"
              element={
                <Layout>
                  <AboutPage />
                </Layout>
              }
            />
            <Route
              path="/contact"
              element={
                <Layout>
                  <ContactPage />
                </Layout>
              }
            />
            <Route
              path="/exercises"
              element={
                <Layout>
                  <ExercisesPage />
                </Layout>
              }
            />
            <Route
              path="/healthy-food"
              element={
                <Layout>
                  <HealthyFoodPage />
                </Layout>
              }
            />
            <Route
              path="/fitness-tips"
              element={
                <Layout>
                  <FitnessTipsPage />
                </Layout>
              }
            />

            {/* 404 - Redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
