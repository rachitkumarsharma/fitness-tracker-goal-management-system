import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Dumbbell,
  Target,
  Menu,
  X,
  User,
  LogOut,
  Sun,
  Moon,
  Home,
  Sparkles,
  HelpCircle,
  Mail,
  Info,
  Shield,
  ArrowLeftFromLine,
} from "lucide-react";
import { useState } from "react";
import { useAuth, useTheme } from "../../context";
import { Button } from "../ui";

const userNavItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/workouts", label: "Workouts", icon: Dumbbell },
  { path: "/goals", label: "Goals", icon: Target },
];

const publicNavItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/about", label: "About", icon: Info },
  { path: "/exercises", label: "Exercises", icon: Dumbbell },
  { path: "/healthy-food", label: "Healthy Food", icon: Sparkles },
  { path: "/fitness-tips", label: "Fitness Tips", icon: HelpCircle },
  { path: "/contact", label: "Contact", icon: Mail },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, profile, signOut, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminUser = isAdmin && isAdmin();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;
  const navItems = user ? userNavItems : publicNavItems;
  const logoPath = user ? "/dashboard" : "/";

  return (
    <>
      {/* Admin mode banner */}
      {isAdminUser && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center text-xs sm:text-sm py-1.5 px-4">
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Admin Mode — You are viewing the user dashboard</span>
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-1 ml-2 px-2.5 py-0.5 rounded-md bg-white/20 hover:bg-white/30 transition-colors font-medium text-xs"
            >
              <ArrowLeftFromLine className="w-3 h-3" />
              Back to Admin
            </Link>
          </div>
        </div>
      )}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors ${isAdminUser ? "mt-7 sm:mt-8" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="group flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-20 animate-ping" />

                  <div
                    className="
      relative w-10 h-10 rounded-xl
      bg-gradient-to-br from-emerald-500 to-teal-600
      flex items-center justify-center
      shadow-[0_0_20px_rgba(16,185,129,0.5)]
      animate-[float_3s_ease-in-out_infinite]
      group-hover:scale-110
      transition-all duration-300
    "
                  >
                    <Dumbbell className="w-6 h-6 text-white group-hover:rotate-12" />
                  </div>
                </div>

                <span
                  className="
    font-bold text-lg
    bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500
    bg-[length:200%]
    animate-[shine_3s_linear_infinite]
    bg-clip-text text-transparent
  "
                >
                  FitTracker
                </span>
              </Link>

              <div className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`
                      flex items-center space-x-2 px-3 py-2 rounded-xl
                      transition-all duration-200 text-sm font-medium
                      ${
                        isActive(item.path)
                          ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-semibold"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                      }
                    `.replace(/\s+/g, " ")}
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Dark mode toggle */}
              <button
                onClick={toggleTheme}
                type="button"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:rotate-180 hover:scale-110 transition-all duration-500"
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600" />
                )}
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className=" group flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center transition-all duration-300 group-hover:ring-4 group-hover:ring-emerald-300">
                      <span className="text-white font-semibold text-sm">
                        {(profile?.full_name || user?.email || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden sm:block font-medium text-slate-700 dark:text-slate-200 text-sm">
                      {profile?.full_name || user?.email?.split("@")[0]}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-1 z-20">
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700/60 transition-colors rounded-lg mx-1"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2 px-4 py-2 w-full text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors rounded-lg mx-1"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="group relative overflow-hidden rounded-xl"
                  >
                    <div className="absolute top-0 -left-full h-full w-full bg-white/30 skew-x-12 group-hover:left-full transition-all duration-700" />
                    <Button
                      variant={isActive("/login") ? "primary" : "ghost"}
                      size="sm"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    to="/register"
                    className="group relative overflow-hidden rounded-xl"
                  >
                    <div className="absolute top-0 -left-full h-full w-full bg-white/20 skew-x-12 group-hover:left-full transition-all duration-700" />
                    <Button
                      variant={isActive("/register") ? "primary" : "outline"}
                      size="sm"
                    >
                      Register
                    </Button>
                  </Link>
                </div>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-4 px-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${
                      isActive(item.path)
                        ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }
                  `.replace(/\s+/g, " ")}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
