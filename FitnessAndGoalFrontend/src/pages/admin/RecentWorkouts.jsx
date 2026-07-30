import { useState, useEffect } from "react";
import { getRecentWorkouts } from "../../api/admin";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "../../components/ui";

export default function RecentWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const data = await getRecentWorkouts(limit);
        setWorkouts(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load recent workouts");
        setWorkouts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [limit]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Recent Workouts</h1>
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Show:</label>
          <select
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            className="px-3 py-1 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div> {/* Added closing div here */}

      {workouts.length === 0 ? (
        <p className="text-center py-8 text-gray-500 dark:text-slate-400">No recent workouts found</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Workout Name</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Duration (min)</TableHeader>
              <TableHeader>Calories</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>User</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {workouts.map((workout) => (
              <TableRow key={workout.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                <TableCell className="font-medium">{workout.workoutName}</TableCell>
                <TableCell>{workout.workoutType}</TableCell>
                <TableCell>{workout.durationMinutes}</TableCell>
                <TableCell>{workout.caloriesBurned}</TableCell>
                <TableCell>{new Date(workout.workoutDate).toLocaleDateString()}</TableCell>
                <TableCell className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center text-xs font-medium dark:text-slate-100">
                    {(workout.username || "U").charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm dark:text-slate-300">{workout.username}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

