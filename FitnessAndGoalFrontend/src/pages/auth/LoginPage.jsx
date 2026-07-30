import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Dumbbell, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { useAuth } from "../../context";
import { Button, Input, Card } from "../../components";
import { Navbar } from "../../components/layout";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn(username, password);

      // Check if user is admin from localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const isAdmin = storedUser?.roles?.includes("ROLE_ADMIN");

      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to sign in";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-100 dark:bg-emerald-950/30 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-100 dark:bg-teal-950/30 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/25">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Welcome back
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Sign in to continue your fitness journey
          </p>
        </div>

        <Card className="sm:rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {successMessage && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <p className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">
                  {successMessage}
                </p>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                <p className="text-rose-700 dark:text-rose-300 text-sm font-medium">
                  {error}
                </p>
              </div>
            )}

            <div>
              <Input
                type="text"
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                leftIcon={<User className="w-5 h-5 text-slate-400" />}
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-slate-600 dark:text-slate-300">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500"
              >
                Forgot password?
              </a>
            </div>

            <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
              Sign in
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  New to FitTracker?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link to="/register">
                <Button variant="outline" fullWidth size="lg">
                  Create an account
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
