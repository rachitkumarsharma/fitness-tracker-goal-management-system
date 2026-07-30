import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { useAuth } from "../../context";
import { Button, Input, Card } from "../../components";
import { Navbar } from "../../components/layout";

export function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      setError("Password must include uppercase, lowercase, and a digit (e.g. SecurePass123)");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    setIsLoading(true);

    try {
      await signUp(username, email, password, firstName, lastName);
      navigate("/login", {
        state: { message: "Registration successful. Please sign in." },
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create account";
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
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Create account</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Start your fitness journey today
          </p>
        </div>

        <Card className="sm:rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                <p className="text-rose-700 dark:text-rose-300 text-sm font-medium">{error}</p>
              </div>
            )}

            <Input
              label="Username"
              placeholder="e.g. fitness_user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              helperText="3–50 chars, letters/numbers/underscore only (e.g. john_doe123)"
              leftIcon={<User className="w-5 h-5 text-slate-400" />}
            />

            <Input
              type="email"
              label="Email address"
              placeholder="e.g. user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              helperText="Must be a valid email (e.g. john.doe@gmail.com)"
              leftIcon={<Mail className="w-5 h-5 text-slate-400" />}
            />

            <Input
              label="First Name"
              placeholder="e.g. John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              helperText="2–100 characters (e.g. John)"
              leftIcon={<User className="w-5 h-5 text-slate-400" />} // maybe use a different icon, but okay
            />

            <Input
              label="Last Name"
              placeholder="e.g. Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              helperText="2–100 characters (e.g. Doe)"
              leftIcon={<User className="w-5 h-5 text-slate-400" />} // same
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="e.g. SecurePass123!"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                helperText="Min 8 chars with 1 uppercase, 1 lowercase, and 1 digit (e.g. SecurePass123!)"
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

            <Input
              type={showPassword ? "text" : "password"}
              label="Confirm password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
              Create account
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link to="/login">
                <Button variant="outline" fullWidth size="lg">
                  Sign in instead
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          By creating an account, you agree to our{" "}
          <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
