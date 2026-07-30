import { useState, useEffect } from "react";
import { Card } from "../../components/ui";
import {
  getUserRegistrationTrend,
  getWorkoutTrend,
  getGoalCompletionRateTrend,
  getWorkoutTypeDistribution,
  getTopActiveUsers,
} from "../../api/admin";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, Dumbbell, Target, Zap } from "lucide-react";

const COLORS = [
  "#ff9f1c",
  "#2ec4b6",
  "#e71d36",
  "#8ac926",
  "#ff6b6b",
  "#4ecdc4",
  "#45b7d1",
  "#96ceb4",
  "#ffeaa7",
  "#dda0dd",
];

const StatCard = ({ title, value, trend, icon, color }) => {
  const colorMap = {
    blue: "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300",
    green:
      "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300",
    purple:
      "border-purple-500 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300",
    orange:
      "border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300",
  };

  return (
    <Card
      className={`p-6 ${colorMap[color] || "border-gray-300 bg-gray-50 dark:bg-slate-800"}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
            {ICONS[icon] || (
              <Users className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-slate-300">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
              {value}
            </p>
          </div>
        </div>
        {trend !== undefined && (
          <div className="text-sm">
            {typeof trend === "number" ? (
              <>
                <p className={trend >= 0 ? "text-green-600" : "text-red-600"}>
                  {trend >= 0 ? `+${trend}` : trend}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  vs last period
                </p>
              </>
            ) : (
              <p className="text-gray-500 dark:text-slate-400">{trend}</p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

const ICONS = {
  Users: <Users className="w-5 h-5" />,
  Dumbbell: <Dumbbell className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
};

export default function AdminAnalytics() {
  const [registrationTrend, setRegistrationTrend] = useState([]);
  const [workoutTrend, setWorkoutTrend] = useState([]);
  const [goalCompletionTrend, setGoalCompletionTrend] = useState([]);
  const [workoutTypes, setWorkoutTypes] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [regData, workoutData, goalData, typeData, topUserData] =
          await Promise.all([
            getUserRegistrationTrend(days),
            getWorkoutTrend(days),
            getGoalCompletionRateTrend(days),
            getWorkoutTypeDistribution(),
            getTopActiveUsers(10),
          ]);

        setRegistrationTrend(regData);
        setWorkoutTrend(workoutData);
        setGoalCompletionTrend(goalData);
        setWorkoutTypes(typeData);
        setTopUsers(topUserData);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [days]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">
          Analytics Dashboard
        </h1>
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
            Time Period:
          </label>
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="px-3 py-1 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
          >
            <option value={7}>7 Days</option>
            <option value={30}>30 Days</option>
            <option value={90}>90 Days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="New Users"
          value={registrationTrend.reduce(
            (sum, day) => sum + (day.count || 0),
            0,
          )}
          trend={`Last ${days} days`}
          icon="Users"
          color="blue"
        />
        <StatCard
          title="Workouts"
          value={workoutTrend.reduce((sum, day) => sum + (day.count || 0), 0)}
          trend={`Last ${days} days`}
          icon="Dumbbell"
          color="green"
        />
        <StatCard
          title="Average Goal Completion Rate"
          value={
            goalCompletionTrend.length > 0
              ? `${(
                  goalCompletionTrend.reduce(
                    (sum, day) => sum + (day.completionRate || 0),
                    0,
                  ) / goalCompletionTrend.length
                ).toFixed(1)}%`
              : "0%"
          }
          trend={`Last ${days} days`}
          icon="Target"
          color="purple"
        />
        <StatCard
          title="Active Users"
          value={topUsers.length}
          trend={`Top ${topUsers.length}`}
          icon="Zap"
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registration Trend */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4">
            User Registrations Trend
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={registrationTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Registrations"
                  stroke="#ff9f1c"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Workout Type Distribution */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4">
            Workout Type Distribution
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={workoutTypes}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={(entry) => entry.type}
                >
                  {workoutTypes.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Goal Completion Trend */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4">
            Goal Completion Rate Trend (%)
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={goalCompletionTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="completionRate"
                  name="Completion Rate (%)"
                  stroke="#2ec4b6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Active Users */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4">
            Top Active Users
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-600 dark:text-slate-300 dark:border-slate-700">
                  <th className="pb-2">User</th>
                  <th className="pb-2">Workouts</th>
                  <th className="pb-2">Goals Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-700">
                {topUsers.map((user, idx) => (
                  <tr
                    key={user.userId || idx}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700/50"
                  >
                    <td className="py-2 font-medium text-gray-800 dark:text-slate-100">
                      {user.username || user.name || `User #${user.userId}`}
                    </td>
                    <td className="py-2 text-gray-600 dark:text-slate-300">
                      {user.workoutCount ?? user.totalWorkouts ?? 0}
                    </td>
                    <td className="py-2 text-gray-600 dark:text-slate-300">
                      {user.completedGoalsCount ?? user.completedGoals ?? 0}
                    </td>
                  </tr>
                ))}
                {topUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan="3"
                      className="py-4 text-center text-gray-500 dark:text-slate-400"
                    >
                      No active users data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
