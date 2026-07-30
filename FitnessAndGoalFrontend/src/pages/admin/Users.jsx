import { useState, useEffect } from "react";
import { Card, Button } from "../../components/ui";
import {
  getAllUsers,
  deleteUser,
  blockUser,
  unblockUser,
} from "../../api/admin";
import { useAuth } from "../../context";
import { Trash2, Ban, CheckCircle, Edit, List } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers(0, 100, searchTerm); // Increased limit for demo
        setUsers(data.content || data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load users");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchTerm]);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        setUsers((prev) => prev.filter((user) => user.id !== userId));
      } catch (err) {
        alert("Failed to delete user: " + err.message);
      }
    }
  };

  const handleBlockUser = async (userId) => {
    if (window.confirm("Are you sure you want to block this user?")) {
      try {
        await blockUser(userId);
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, enabled: false } : user,
          ),
        );
      } catch (err) {
        alert("Failed to block user: " + err.message);
      }
    }
  };

  const handleUnblockUser = async (userId) => {
    if (window.confirm("Are you sure you want to unblock this user?")) {
      try {
        await unblockUser(userId);
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, enabled: true } : user,
          ),
        );
      } catch (err) {
        alert("Failed to unblock user: " + err.message);
      }
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">
          User Management
        </h1>
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
          />
          <Button
            variant="outline"
            onClick={() => {
              // In a real app, this would open a modal to create/edit user
              alert("User creation/edit functionality would go here");
            }}
          >
            Add User
          </Button>
        </div>
      </div>

      {users.length === 0 ? (
        <p className="text-center py-8 text-gray-500 dark:text-slate-400">
          No users found
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700/30"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center dark:text-slate-100">
                        {(user.fullName || user.email?.split("@")[0] || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                          {user.fullName || user.email || "Unknown User"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      {user.email}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                      {Array.isArray(user.roles) &&
                      user.roles.includes("ROLE_ADMIN")
                        ? "Admin"
                        : "User"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.enabled !== false
                          ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300"
                          : "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300"
                      }`}
                    >
                      {user.enabled !== false ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user.enabled !== false ? (
                      <button
                        onClick={() => handleBlockUser(user.id)}
                        className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-slate-700 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                        title="Block user"
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnblockUser(user.id)}
                        className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-slate-700 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30"
                        title="Unblock user"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="ml-2 p-1.5 rounded hover:bg-gray-100 dark:hover:bg-slate-700 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
