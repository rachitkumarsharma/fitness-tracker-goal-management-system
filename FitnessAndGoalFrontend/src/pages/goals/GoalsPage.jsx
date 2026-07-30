import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Calendar,
  Pencil,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  updateGoalProgress,
} from "../../api";
import {
  Button,
  Input,
  Select,
  Textarea,
  Card,
  Modal,
  Badge,
  ProgressBar,
  Spinner,
  EmptyState,
} from "../../components";

const GOAL_TYPES = [
  { value: "weight_loss", label: "Weight Loss", emoji: "⚖️" },
  { value: "weight_gain", label: "Weight Gain", emoji: "📈" },
  { value: "muscle_gain", label: "Muscle Gain", emoji: "💪" },
  { value: "flexibility", label: "Flexibility", emoji: "🧘" },
  { value: "cardio", label: "Cardio", emoji: "💓" },
  { value: "strength", label: "Strength", emoji: "🏋️" },
  { value: "body_fat_reduction", label: "Body Fat Reduction", emoji: "🎯" },
  { value: "custom", label: "Custom", emoji: "⭐" },
];

const GOAL_STATUSES = [
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const goalTypeIcons = {
  weight_loss: "⚖️",
  weight_gain: "📈",
  muscle_gain: "💪",
  flexibility: "🧘",
  cardio: "💓",
  strength: "🏋️",
  body_fat_reduction: "🎯",
  custom: "⭐",
};

const initialFormData = {
  title: "",
  description: "",
  goal_type: "custom",
  target: "",
  progress: "",
  start_date: new Date().toISOString().split("T")[0],
  target_date: "",
  status: "not_started",
};

export function GoalsPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const fetchGoals = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getGoals();
      setGoals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  const filteredGoals = goals.filter((goal) => {
    const matchesSearch =
      goal.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || goal.status === filterStatus;
    const matchesType = filterType === "all" || goal.goal_type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleOpenModal = (goal) => {
    if (goal) {
      setEditingGoal(goal);
      setFormData({
        title: goal.title || "",
        description: goal.description || "",
        goal_type: goal.goal_type || "custom",
        target: goal.target || "",
        progress: goal.progress || "",
        start_date: goal.start_date || new Date().toISOString().split("T")[0],
        target_date: goal.target_date || "",
        status: goal.status || "not_started",
      });
    } else {
      setEditingGoal(null);
      setFormData(initialFormData);
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGoal(null);
    setFormData(initialFormData);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !validateForm()) return;

    setIsSubmitting(true);
    try {
      const goalData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        goal_type: formData.goal_type,
        target: formData.target.trim() || undefined,
        progress: formData.progress.trim() || undefined,
        start_date: formData.start_date || undefined,
        target_date: formData.target_date || undefined,
        status: formData.status || "not_started",
      };

      if (editingGoal) {
        await updateGoal(editingGoal.id, goalData);
      } else {
        await createGoal(goalData);
      }

      await fetchGoals();
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save goal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (goalId) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;
    try {
      await deleteGoal(goalId);
      await fetchGoals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete goal");
    }
  };

  const handleMarkComplete = async (goal) => {
    try {
      await updateGoal(goal.id, { ...goal, status: "completed" });
      await fetchGoals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update goal");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "in_progress":
        return <Badge variant="info">In Progress</Badge>;
      default:
        return <Badge variant="warning">Not Started</Badge>;
    }
  };

  const parseNumericValue = (str) => {
    if (!str) return 0;
    const match = str.match(/^([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const getProgressPercent = (goal) => {
    const target = parseNumericValue(goal.target);
    const progress = parseNumericValue(goal.progress);
    if (target === 0) return 0;
    return Math.min(Math.round((progress / target) * 100), 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Goals
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Set and track your fitness targets
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          leftIcon={<Plus className="w-5 h-5" />}
          size="lg"
        >
          Add Goal
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
          <p className="text-rose-700 font-medium">{error}</p>
        </div>
      )}

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search goals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-5 h-5 text-slate-400" />}
            />
          </div>
          <div className="flex gap-3">
            <Select
              options={[
                { value: "all", label: "All Statuses" },
                ...GOAL_STATUSES,
              ]}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-40"
            />
            <Select
              options={[
                { value: "all", label: "All Types" },
                ...GOAL_TYPES.map((t) => ({ value: t.value, label: t.label })),
              ]}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-44"
            />
          </div>
        </div>
      </Card>

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <Card>
          <EmptyState
            title={
              goals.length === 0
                ? "No goals yet"
                : "No goals match your filters"
            }
            description={
              goals.length === 0
                ? "Set your first fitness goal to start tracking progress"
                : "Try adjusting your search or filters"
            }
            action={
              goals.length === 0 ? (
                <Button onClick={() => handleOpenModal()}>
                  Set Your First Goal
                </Button>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGoals.map((goal) => {
            const progressPercent = getProgressPercent(goal);
            return (
              <Card
                key={goal.id}
                hover
                className="relative overflow-hidden group"
              >
                {goal.status === "completed" && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                    Achieved!
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xl">
                      {goalTypeIcons[goal.goal_type] || "🎯"}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100">
                        {goal.title}
                      </h3>
                      <p className="text-sm text-slate-500 capitalize">
                        {goal.goal_type?.replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>
                </div>

                {goal.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {goal.description}
                  </p>
                )}

                {/* Target / Progress Display */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      Progress
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {goal.progress || "0"} / {goal.target || "—"}
                    </span>
                  </div>
                  <ProgressBar
                    value={parseNumericValue(goal.progress)}
                    max={parseNumericValue(goal.target) || 1}
                    color={
                      progressPercent >= 75
                        ? "emerald"
                        : progressPercent >= 50
                          ? "sky"
                          : "amber"
                    }
                    size="lg"
                  />
                </div>

                {/* Dates */}
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  {goal.start_date && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      Started {new Date(goal.start_date).toLocaleDateString()}
                    </span>
                  )}
                  {goal.target_date && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      Target {new Date(goal.target_date).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-600 pt-4">
                  {getStatusBadge(goal.status)}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {goal.status !== "completed" && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleMarkComplete(goal)}
                        leftIcon={<CheckCircle2 className="w-4 h-4" />}
                      >
                        Complete
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenModal(goal)}
                      leftIcon={<Pencil className="w-4 h-4" />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(goal.id)}
                      leftIcon={<Trash2 className="w-4 h-4" />}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingGoal ? "Edit Goal" : "Add Goal"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Select
            label="Goal Type"
            options={GOAL_TYPES.map((t) => ({
              value: t.value,
              label: `${t.emoji} ${t.label}`,
            }))}
            value={formData.goal_type}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                goal_type: e.target.value,
              }))
            }
          />

          <Input
            label="Title"
            placeholder="e.g. Lose 5kg, Run 100km, Bench Press 80kg"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            error={formErrors.title}
          />

          <Textarea
            label="Description (optional)"
            placeholder="Describe your goal..."
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            rows={2}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Target"
              placeholder="e.g. 5 kg, 100 km, 30 days"
              value={formData.target}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  target: e.target.value,
                }))
              }
            />
            <Input
              label="Progress"
              placeholder="e.g. 2 kg, 25 km"
              value={formData.progress}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  progress: e.target.value,
                }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Start Date"
              value={formData.start_date}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  start_date: e.target.value,
                }))
              }
            />
            <Input
              type="date"
              label="Target Date (optional)"
              value={formData.target_date}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  target_date: e.target.value,
                }))
              }
            />
          </div>

          {editingGoal && (
            <Select
              label="Status"
              options={GOAL_STATUSES}
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
            />
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
              fullWidth
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} fullWidth>
              {editingGoal ? "Update Goal" : "Add Goal"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
