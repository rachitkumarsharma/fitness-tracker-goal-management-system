import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Clock,
  Pencil,
  Trash2,
  Dumbbell,
  Flame,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../context";
import {
  getWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from "../../api";
import { searchByMuscle } from "../../api/exerciseApi";
import {
  Button,
  Input,
  Select,
  Textarea,
  Card,
  Modal,
  Badge,
  Spinner,
  EmptyState,
} from "../../components";

// ========== Workout Types ==========
const WORKOUT_TYPES = [
  { value: "weight_lifting", label: "Weight Lifting", emoji: "🏋️" },
  { value: "running", label: "Running", emoji: "🏃" },
  { value: "cycling", label: "Cycling", emoji: "🚴" },
  { value: "swimming", label: "Swimming", emoji: "🏊" },
  { value: "yoga", label: "Yoga", emoji: "🧘" },
  { value: "hiit", label: "HIIT", emoji: "⚡" },
  { value: "walking", label: "Walking", emoji: "🚶" },
  { value: "cardio", label: "Cardio", emoji: "💓" },
  { value: "crossfit", label: "CrossFit", emoji: "🔥" },
  { value: "pilates", label: "Pilates", emoji: "🤸" },
  { value: "other", label: "Other", emoji: "🎯" },
];

const MUSCLE_GROUPS = [
  { value: "chest", label: "Chest" },
  { value: "back", label: "Back" },
  { value: "biceps", label: "Biceps" },
  { value: "triceps", label: "Triceps" },
  { value: "legs", label: "Legs" },
  { value: "shoulders", label: "Shoulders" },
  { value: "abs", label: "Abs" },
  { value: "glutes", label: "Glutes" },
  { value: "hamstrings", label: "Hamstrings" },
  { value: "cardio", label: "Cardio" },
];

const DIFFICULTY_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "expert", label: "Expert" },
];

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

// ========== Initial State ==========
const initialFormData = {
  workout_type: "weight_lifting",
  muscle: "",
  exercise_name: "",
  equipment: "",
  difficulty: "",
  sets: "",
  reps: "",
  weight: "",
  distance: "",
  calories: "",
  duration: "",
  notes: "",
};

// ========== Component ==========
export function WorkoutsPage() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Exercise search
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [exercises, setExercises] = useState([]);
  const [exercisesLoading, setExercisesLoading] = useState(false);
  const [exerciseSearchError, setExerciseSearchError] = useState(null);
  const [showExercises, setShowExercises] = useState(false);

  // List filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetchWorkouts();
  }, [user]);

  const fetchWorkouts = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getWorkouts();
      setWorkouts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load workouts");
    } finally {
      setLoading(false);
    }
  };

  // ========== Exercise Fetching ==========
  const handleSearchExercises = async () => {
    if (!selectedMuscle) return;
    setExercisesLoading(true);
    setExerciseSearchError(null);
    setShowExercises(true);
    try {
      const data = await searchByMuscle(selectedMuscle);
      setExercises(data || []);
    } catch (err) {
      setExerciseSearchError(
        err instanceof Error ? err.message : "Failed to fetch exercises",
      );
      setExercises([]);
    } finally {
      setExercisesLoading(false);
    }
  };

  const handleSelectExercise = (exercise) => {
    setFormData((prev) => ({
      ...prev,
      exercise_name: exercise.name || "",
      muscle: exercise.muscle || selectedMuscle,
      equipment: exercise.equipment || "",
      difficulty: exercise.difficulty || "",
    }));
    setShowExercises(false);
  };

  // ========== Open/Close Modal ==========
  const handleOpenModal = (workout) => {
    if (workout) {
      setEditingWorkout(workout);
      setFormData({
        workout_type: workout.workout_type || "weight_lifting",
        muscle: workout.muscle || "",
        exercise_name: workout.exercise_name || "",
        equipment: workout.equipment || "",
        difficulty: workout.difficulty || "",
        sets: workout.sets ?? "",
        reps: workout.reps ?? "",
        weight: workout.weight ?? "",
        distance: workout.distance ?? "",
        calories: workout.calories ?? "",
        duration: workout.duration ?? "",
        notes: workout.notes || "",
      });
    } else {
      setEditingWorkout(null);
      setFormData(initialFormData);
      setSelectedMuscle("");
      setExercises([]);
      setShowExercises(false);
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWorkout(null);
    setFormData(initialFormData);
    setFormErrors({});
    setSelectedMuscle("");
    setExercises([]);
    setShowExercises(false);
  };

  // ========== Validation ==========
  const validateForm = () => {
    const errors = {};
    if (!formData.workout_type) {
      errors.workout_type = "Workout type is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ========== Submit ==========
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !validateForm()) return;

    setIsSubmitting(true);
    try {
      const workoutData = {
        workout_type: formData.workout_type,
        muscle: formData.muscle || undefined,
        exercise_name: formData.exercise_name || undefined,
        equipment: formData.equipment || undefined,
        difficulty: formData.difficulty || undefined,
        sets: formData.sets ? Number(formData.sets) : undefined,
        reps: formData.reps ? Number(formData.reps) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        distance: formData.distance ? Number(formData.distance) : undefined,
        calories: formData.calories ? Number(formData.calories) : undefined,
        duration: formData.duration ? Number(formData.duration) : undefined,
        notes: formData.notes || undefined,
      };

      if (editingWorkout) {
        await updateWorkout(editingWorkout.id, workoutData);
      } else {
        await createWorkout(workoutData);
      }

      await fetchWorkouts();
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save workout");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========== Delete ==========
  const handleDelete = async (workoutId) => {
    if (!window.confirm("Are you sure you want to delete this workout?"))
      return;
    try {
      await deleteWorkout(workoutId);
      await fetchWorkouts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete workout");
    }
  };

  // ========== Filtering ==========
  const filteredWorkouts = workouts.filter((workout) => {
    const matchesSearch =
      workout.exercise_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      workout.muscle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.workout_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === "all" || workout.workout_type === filterType;
    return matchesSearch && matchesType;
  });

  // ========== Loading ==========
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
            Workouts
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Log your fitness activities and track your progress
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          leftIcon={<Plus className="w-5 h-5" />}
          size="lg"
        >
          Add Workout
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
          <div className="flex-1 w-2/3">
            <Input
              placeholder="Search workouts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-5 h-5 text-slate-400" />}
            />
          </div>
          <div className="w-1/4">
            <Select
              options={[
                { value: "all", label: "All Types" },
                ...WORKOUT_TYPES.map((t) => ({
                  value: t.value,
                  label: t.label,
                })),
              ]}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-44"
            />
          </div>
        </div>
      </Card>

      {/* Workouts List */}
      {filteredWorkouts.length === 0 ? (
        <Card>
          <EmptyState
            title={
              workouts.length === 0
                ? "No workouts yet"
                : "No workouts match your filters"
            }
            description={
              workouts.length === 0
                ? "Start by logging your first workout!"
                : "Try adjusting your search or filters"
            }
            action={
              workouts.length === 0 ? (
                <Button onClick={() => handleOpenModal()}>
                  Add Your First Workout
                </Button>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkouts.map((workout) => (
            <Card
              key={workout.id}
              hover
              className="relative overflow-hidden group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl">
                    {workoutTypeIcons[workout.workout_type] || "🎯"}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">
                      {workout.exercise_name ||
                        workout.workout_type?.replace("_", " ") ||
                        "Workout"}
                    </h3>
                    <p className="text-sm text-slate-500 capitalize">
                      {workout.workout_type?.replace("_", " ")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Exercise Details */}
              <div className="mb-3 space-y-1.5">
                {(workout.muscle ||
                  workout.difficulty ||
                  workout.equipment) && (
                  <div className="flex flex-wrap gap-2">
                    {workout.muscle && (
                      <Badge variant="info" size="sm">
                        {workout.muscle}
                      </Badge>
                    )}
                    {workout.difficulty && (
                      <Badge variant="secondary" size="sm">
                        {workout.difficulty}
                      </Badge>
                    )}
                    {workout.equipment && (
                      <Badge variant="secondary" size="sm">
                        {workout.equipment}
                      </Badge>
                    )}
                  </div>
                )}
                {(workout.sets || workout.reps || workout.weight) && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    {workout.sets && `${workout.sets} sets`}
                    {workout.sets && workout.reps && " × "}
                    {workout.reps && `${workout.reps} reps`}
                    {workout.weight && ` @ ${workout.weight} kg`}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                {workout.duration && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {workout.duration} min
                  </span>
                )}
                {workout.calories && (
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4" />
                    {workout.calories} cal
                  </span>
                )}
              </div>

              {workout.notes && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                  {workout.notes}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleOpenModal(workout)}
                  leftIcon={<Pencil className="w-4 h-4" />}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(workout.id)}
                  leftIcon={<Trash2 className="w-4 h-4" />}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingWorkout ? "Edit Workout" : "Add Workout"}
        size="xl"
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-5 max-h-[60vh] overflow-y-auto pr-2"
        >
          {/* Workout Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Workout Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {WORKOUT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      workout_type: type.value,
                    }))
                  }
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    formData.workout_type === type.value
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                      : "border-slate-200 dark:border-slate-600 hover:border-emerald-300"
                  }`}
                >
                  <span className="text-xl">{type.emoji}</span>
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              ))}
            </div>
            {formErrors.workout_type && (
              <p className="text-sm text-rose-500 mt-1">
                {formErrors.workout_type}
              </p>
            )}
          </div>

          {/* Dynamic Fields based on Workout Type */}
          {formData.workout_type === "weight_lifting" && (
            <>
              {/* Exercise Search */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Select
                    label="Muscle Group"
                    options={[
                      { value: "", label: "Select muscle..." },
                      ...MUSCLE_GROUPS,
                    ]}
                    value={selectedMuscle}
                    onChange={(e) => setSelectedMuscle(e.target.value)}
                    className="flex-1"
                  />
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleSearchExercises}
                      disabled={!selectedMuscle || exercisesLoading}
                      leftIcon={
                        exercisesLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )
                      }
                    >
                      Search
                    </Button>
                  </div>
                </div>

                {exerciseSearchError && (
                  <p className="text-sm text-rose-500">{exerciseSearchError}</p>
                )}

                {showExercises && exercises.length > 0 && (
                  <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-600 rounded-xl divide-y divide-slate-100 dark:divide-slate-700">
                    {exercises.map((ex, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectExercise(ex)}
                        className="w-full text-left px-4 py-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                      >
                        <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">
                          {ex.name}
                        </p>
                        <p className="text-xs text-slate-500 capitalize">
                          {ex.muscle} · {ex.equipment} · {ex.difficulty}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {showExercises &&
                  exercises.length === 0 &&
                  !exercisesLoading && (
                    <p className="text-sm text-slate-500">
                      No exercises found for this muscle group.
                    </p>
                  )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Exercise Name"
                  placeholder="Bench Press"
                  value={formData.exercise_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      exercise_name: e.target.value,
                    }))
                  }
                />
                <Select
                  label="Difficulty"
                  options={[{ value: "", label: "Any" }, ...DIFFICULTY_OPTIONS]}
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      difficulty: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Input
                  type="number"
                  label="Sets"
                  placeholder="3"
                  value={formData.sets}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sets: e.target.value,
                    }))
                  }
                  min={1}
                />
                <Input
                  type="number"
                  label="Reps"
                  placeholder="12"
                  value={formData.reps}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      reps: e.target.value,
                    }))
                  }
                  min={1}
                />
                <Input
                  type="number"
                  label="Weight (kg)"
                  placeholder="50"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      weight: e.target.value,
                    }))
                  }
                  min={0}
                  step={0.5}
                />
              </div>
            </>
          )}

          {(formData.workout_type === "running" ||
            formData.workout_type === "cycling" ||
            formData.workout_type === "walking") && (
            <Input
              type="number"
              label="Distance (km)"
              placeholder="5"
              value={formData.distance}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  distance: e.target.value,
                }))
              }
              min={0}
              step={0.1}
            />
          )}

          {(formData.workout_type === "yoga" ||
            formData.workout_type === "cardio" ||
            formData.workout_type === "hiit" ||
            formData.workout_type === "pilates" ||
            formData.workout_type === "crossfit") && (
            <div className="border-l-4 border-emerald-400 pl-4 py-2 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-r-xl">
              <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                ⏱ Set duration in the <strong>Optional Details</strong> section
                below
              </p>
            </div>
          )}

          {/* Optional fields - shown for all types */}
          <div className="border-t border-slate-200 dark:border-slate-600 pt-4">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
              Optional Details
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                label="Calories Burned"
                placeholder="e.g. 200"
                value={formData.calories}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    calories: e.target.value,
                  }))
                }
                min={0}
              />
              <Input
                type="number"
                label="Duration (min)"
                placeholder="e.g. 30"
                value={formData.duration}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    duration: e.target.value,
                  }))
                }
                min={1}
              />
            </div>
          </div>

          {/* Equipment */}
          <Input
            label="Equipment (optional)"
            placeholder="Dumbbell, Barbell, Mat..."
            value={formData.equipment}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                equipment: e.target.value,
              }))
            }
          />

          {/* Notes */}
          <Textarea
            label="Notes (optional)"
            placeholder="How did this workout feel?"
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                notes: e.target.value,
              }))
            }
            rows={2}
          />

          {/* Submit/Cancel */}
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
              {editingWorkout ? "Update Workout" : "Save Workout"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
