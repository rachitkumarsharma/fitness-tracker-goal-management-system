import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Dumbbell,
  Target,
  Flame,
  Clock,
  ChevronRight,
  Calendar,
  Award,
} from "lucide-react";
import { useAuth } from "../../context";
import { getWorkouts, getGoals } from "../../api";
import {
  Card,
  Badge,
  ProgressBar,
  Spinner,
  EmptyState,
} from "../../components";

const workoutTypeIcons = {
  weight_lifting: "🏋️",
  running: "🏃",
  cycling: "🚴",
  swimming: "🏊",
  yoga: "🧘",
  hiit: "⚡",
  walking: "🚶",
  cardio: "💓",
  crossfit: "🔥",
  pilates: "🤸",
  other: "🎯",
};

function parseNumericValue(str) {
  if (!str) return 0;
  const match = str.match(/^([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

export function DashboardPage() {
  const { user, profile } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        const [workoutsData, goalsData] = await Promise.all([
          getWorkouts(),
          getGoals(),
        ]);

        const safeWorkouts = Array.isArray(workoutsData) ? workoutsData : [];
        const safeGoals = Array.isArray(goalsData) ? goalsData : [];

        setWorkouts(safeWorkouts);
        setGoals(safeGoals);

        const totalCalories = safeWorkouts.reduce(
          (sum, w) => sum + (w.calories || 0),
          0,
        );
        const totalMinutes = safeWorkouts.reduce(
          (sum, w) => sum + (w.duration || 0),
          0,
        );

        const activeGoals = safeGoals.filter((g) => g.status === "in_progress");
        const completedGoals = safeGoals.filter(
          (g) => g.status === "completed",
        );

        setStats({
          totalWorkouts: safeWorkouts.length,
          totalCalories,
          totalMinutes,
          activeGoals: activeGoals.length,
          completedGoals: completedGoals.length,
        });
      } catch (err) {
        console.error("Dashboard load error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard",
        );
        setWorkouts([]);
        setGoals([]);
        setStats({
          totalWorkouts: 0,
          totalCalories: 0,
          totalMinutes: 0,
          activeGoals: 0,
          completedGoals: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
          <p className="text-rose-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const recentWorkouts = workouts.slice(0, 5);
  const activeGoals = goals
    .filter((g) => g.status === "in_progress")
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Welcome back, {profile?.full_name?.split(" ")[0] || "Athlete"}!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Here's your fitness overview for today
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/workouts">
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/25 flex items-center gap-2">
              <Dumbbell className="w-4 h-4" />
              Log Workout
            </button>
          </Link>
          <Link to="/goals">
            <button className="px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-xl font-medium hover:bg-emerald-50 transition-colors flex items-center gap-2">
              <Target className="w-4 h-4" />
              Set Goal
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-full -mr-8 -mt-8" />
          <div className="relative">
            <div className="mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Total Workouts
              </p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                {stats?.totalWorkouts || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 rounded-full -mr-8 -mt-8" />
          <div className="relative">
            <div className="mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Calories Burned
              </p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                {stats?.totalCalories.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-100 rounded-full -mr-8 -mt-8" />
          <div className="relative">
            <div className="mb-4">
              <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-sky-600" />
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Total Minutes
              </p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                {stats?.totalMinutes.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-100 rounded-full -mr-8 -mt-8" />
          <div className="relative">
            <div className="mb-4">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-teal-600" />
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Active Goals
              </p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                {stats?.activeGoals || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Workouts */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Recent Workouts
            </h2>
            <Link
              to="/workouts"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-500 flex items-center gap-1"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {recentWorkouts.length === 0 ? (
            <EmptyState
              title="No workouts yet"
              description="Start logging your workouts to track your progress"
              action={
                <Link to="/workouts">
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                    Add Workout
                  </button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-4">
              {recentWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-2xl shadow-sm">
                    {workoutTypeIcons[workout.workout_type] || "🎯"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {workout.exercise_name ||
                        workout.workout_type?.replace(/_/g, " ") ||
                        "Workout"}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      {workout.duration && (
                        <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {workout.duration} min
                        </span>
                      )}
                      {workout.calories && (
                        <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5" />
                          {workout.calories} cal
                        </span>
                      )}
                    </div>
                    {workout.muscle && (
                      <span className="text-xs text-slate-400 capitalize">
                        {workout.muscle}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">
                    {workout.created_at &&
                      new Date(workout.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Active Goals */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Active Goals
            </h2>
            <Link
              to="/goals"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-500 flex items-center gap-1"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {activeGoals.length === 0 ? (
            <EmptyState
              title="No active goals"
              description="Set goals to stay motivated"
              action={
                <Link to="/goals">
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                    Set Goal
                  </button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-4">
              {activeGoals.map((goal) => {
                const progress = parseNumericValue(goal.progress);
                const target = parseNumericValue(goal.target) || 1;
                const pct = Math.min(
                  Math.round((progress / target) * 100),
                  100,
                );
                return (
                  <div
                    key={goal.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 space-y-3"
                  >
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-100">
                        {goal.title}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                        {goal.goal_type?.replace(/_/g, " ")}
                      </p>
                    </div>
                    <ProgressBar
                      value={progress}
                      max={target}
                      color="emerald"
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">
                        {goal.progress || "0"} / {goal.target || "—"}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Achievements Section */}
      {stats && stats.completedGoals > 0 && (
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                {stats.completedGoals} Goals Completed!
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Keep pushing yourself to achieve more
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
