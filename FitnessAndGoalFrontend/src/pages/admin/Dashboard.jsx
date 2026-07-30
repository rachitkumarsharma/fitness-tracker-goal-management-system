import { useState, useEffect } from "react";
import { Card } from "../../components/ui";
import { getAdminDashboardStats } from "../../api/admin";
import { Loading } from "../../components";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getAdminDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load dashboard stats");
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loading message="Loading dashboard stats..." />;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!stats)
    return <div className="p-4 text-yellow-500">No data available</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">
        Admin Dashboard
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers ?? 0}
          icon="users"
          color="blue"
        />
        <StatCard
          title="New Today"
          value={stats?.newUsersToday ?? 0}
          icon="plus-circle"
          color="green"
        />
        <StatCard
          title="Total Workouts"
          value={stats?.totalWorkouts ?? 0}
          icon="dumbbell"
          color="purple"
        />
        <StatCard
          title="Calories Burned Today"
          value={`${stats?.caloriesBurnedToday?.toLocaleString() || 0} kcal`}
          icon="fire"
          color="red"
        />
        <StatCard
          title="Total Goals"
          value={stats?.totalGoals ?? 0}
          icon="target"
          color="teal"
        />
        <StatCard
          title="Completed Goals"
          value={stats?.completedGoals ?? 0}
          icon="check-circle"
          color="green"
        />
        <StatCard
          title="Active Users"
          value={stats?.activeUsers ?? 0}
          icon="zap"
          color="orange"
        />
        <StatCard
          title="Premium Users"
          value={stats?.premiumUsers ?? 0}
          icon="star"
          color="yellow"
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorMap = {
    blue: "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300",
    green:
      "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300",
    purple:
      "border-purple-500 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300",
    teal: "border-teal-500 bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300",
    red: "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300",
    orange:
      "border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300",
    yellow:
      "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300",
  };

  const iconMap = {
    users: <Users className="w-5 h-5" />,
    "plus-circle": <PlusCircle className="w-5 h-5" />,
    dumbbell: <Dumbbell className="w-5 h-5" />,
    fire: <Flame className="w-5 h-5" />,
    target: <Target className="w-5 h-5" />,
    "check-circle": <CheckCircle className="w-5 h-5" />,
    zap: <Zap className="w-5 h-5" />,
    star: <Star className="w-5 h-5" />,
  };

  return (
    <Card className={`border-l-4 ${colorMap[color] || "border-gray-300"} `}>
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-full">
          {iconMap[icon] || <Users className="w-5 h-5" />}
        </div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
}

// Import icons
import {
  Users,
  PlusCircle,
  Dumbbell,
  Flame,
  Target,
  CheckCircle,
  Zap,
  Star,
} from "lucide-react";
