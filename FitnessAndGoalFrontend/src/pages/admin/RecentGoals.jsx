import { useState, useEffect } from "react";
import { Card, Button } from "../../components/ui";
import { getRecentGoals } from "../../api/admin";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "../../components/ui";

export default function RecentGoals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const data = await getRecentGoals(limit);
        setGoals(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load recent goals");
        setGoals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [limit]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Recent Goals</h1>
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-gray-700">Show:</label>
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
      </div>

      {goals.length === 0 ? (
        <p className="text-center py-8 text-gray-500">No recent goals found</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Goal Name</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Target</TableHeader>
              <TableHeader>Current</TableHeader>
              <TableHeader>Progress</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>User</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {goals.map((goal) => (
              <TableRow key={goal.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{goal.goalName}</TableCell>
                <TableCell>{goal.goalType}</TableCell>
                <TableCell>{goal.target || "—"}</TableCell>
                <TableCell>{goal.progress || "—"}</TableCell>
                <TableCell>
                  {goal.target
                    ? `${Math.round((parseFloat(goal.progress || 0) / parseFloat(goal.target)) * 100)}%`
                    : "—"}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      goal.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : goal.status === "ACTIVE"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {goal.status}
                  </span>
                </TableCell>
                <TableCell className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                    {(goal.username || "U").charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm">{goal.username}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
