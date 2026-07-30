import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, Save, Trash2, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context";
import {
  updateCurrentUser,
  changePassword,
  deleteCurrentUser,
  getUserStats,
} from "../../api";
import { Button, Input, Card, Loading } from "../../components";

export function ProfilePage() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (profile) {
      const nameParts = (profile.full_name || "").split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
    }
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const fetchStats = async () => {
    try {
      const data = await getUserStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSaving(true);
    try {
      await updateCurrentUser({
        firstName,
        lastName,
        avatar_url: profilePictureUrl,
      });
      await refreshProfile();
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    if (
      !/[a-z]/.test(newPassword) ||
      !/[A-Z]/.test(newPassword) ||
      !/\d/.test(newPassword)
    ) {
      setError("New password must include uppercase, lowercase, and a digit");
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess("Password changed successfully! Please sign in again.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(async () => {
        await signOut();
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    ) {
      return;
    }
    if (
      !window.confirm("This will permanently delete all your data. Confirm again?")
    ) {
      return;
    }
    try {
      await deleteCurrentUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete account");
    }
  };

  if (loading) {
    return <Loading message="Loading profile..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard">
          <Button variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Profile & Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
          <p className="text-rose-700 font-medium">{error}</p>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <p className="text-emerald-700 font-medium">{success}</p>
        </div>
      )}

      <Card>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <User className="w-5 h-5" /> Account Information
        </h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <Input
            label="Email"
            value={user?.email || ""}
            disabled
            helperText="Email cannot be changed"
          />
          <Input
            label="Profile Picture URL (optional)"
            placeholder="https://example.com/avatar.jpg"
            value={profilePictureUrl}
            onChange={(e) => setProfilePictureUrl(e.target.value)}
          />
          <Button type="submit" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
            Save Changes
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" /> Change Password
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input
            type="password"
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            helperText="Min 8 chars, 1 uppercase, 1 lowercase, 1 digit"
          />
          <Input
            type="password"
            label="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="secondary"
            isLoading={isChangingPassword}
            leftIcon={<Lock className="w-4 h-4" />}
          >
            Change Password
          </Button>
        </form>
      </Card>

      {stats && (
        <Card>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Your Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium">
                  {key.replace(/_/g, " ")}
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                  {String(value)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="border-2 border-rose-200 dark:border-rose-800">
        <h2 className="text-lg font-bold text-rose-700 dark:text-rose-300 mb-2">Danger Zone</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button
          variant="danger"
          onClick={handleDeleteAccount}
          leftIcon={<Trash2 className="w-4 h-4" />}
        >
          Delete My Account
        </Button>
      </Card>
    </div>
  );
}
