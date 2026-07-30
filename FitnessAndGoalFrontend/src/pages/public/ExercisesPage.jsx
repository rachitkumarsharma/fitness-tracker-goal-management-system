import { useState, useEffect, useCallback } from "react";
import { ExerciseCard } from "../../components/shared/ExerciseCard";
import { Search, Filter, RefreshCw, AlertCircle } from "lucide-react";
import { searchExercises } from "../../api/exerciseApi";

const MUSCLE_GROUPS = [
  { value: "", label: "All Muscles" },
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

const DIFFICULTY_LEVELS = [
  { value: "", label: "All Difficulties" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "expert", label: "Expert" },
];

const EXERCISE_TYPES = [
  { value: "", label: "All Types" },
  { value: "cardio", label: "Cardio" },
  { value: "strength", label: "Strength" },
  { value: "stretching", label: "Stretching" },
  { value: "plyometrics", label: "Plyometrics" },
  { value: "powerlifting", label: "Powerlifting" },
  { value: "olympic_weightlifting", label: "Olympic Weightlifting" },
  { value: "strongman", label: "Strongman" },
  { value: "calisthenics", label: "Calisthenics" },
  { value: "bodyweight", label: "Bodyweight" },
];

const ITEMS_PER_PAGE = 12;

export function ExercisesPage() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search & filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [allExercises, setAllExercises] = useState([]);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch exercises
  const fetchExercises = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedMuscle) params.muscle = selectedMuscle;
      if (selectedDifficulty) params.difficulty = selectedDifficulty;
      if (selectedType) params.type = selectedType;
      if (debouncedSearch) params.name = debouncedSearch;

      const data = await searchExercises(params);
      setAllExercises(data || []);
      setCurrentPage(1);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load exercises. Please try again.",
      );
      setAllExercises([]);
    } finally {
      setLoading(false);
    }
  }, [selectedMuscle, selectedDifficulty, selectedType, debouncedSearch]);

  // Fetch on filter change
  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  // Pagination
  const totalPages = Math.ceil(allExercises.length / ITEMS_PER_PAGE);
  const paginatedExercises = allExercises.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900 dark:text-slate-100">
          Exercise Library
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Discover exercises from our extensive database. Search by name, muscle
          group, difficulty, or type.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search exercises by name..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm
                dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                className="pl-9 pr-8 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg
                  dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                  outline-none transition-all appearance-none cursor-pointer"
                value={selectedMuscle}
                onChange={(e) => setSelectedMuscle(e.target.value)}
              >
                {MUSCLE_GROUPS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <select
              className="px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg
                dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                outline-none transition-all appearance-none cursor-pointer"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              {DIFFICULTY_LEVELS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              className="px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg
                dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                outline-none transition-all appearance-none cursor-pointer"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {EXERCISE_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={fetchExercises}
              className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-600
                hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
              title="Refresh"
            >
              <RefreshCw
                className={`w-5 h-5 text-slate-500 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <p className="text-rose-700 dark:text-rose-300 font-medium">
              {error}
            </p>
          </div>
          <button
            onClick={fetchExercises}
            className="mt-2 text-sm font-medium text-rose-600 hover:text-rose-500"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Loading exercises...
            </p>
          </div>
        </div>
      )}

      {/* Exercises Grid */}
      {!loading && !error && (
        <>
          {paginatedExercises.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                No exercises found
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Showing {paginatedExercises.length} of {allExercises.length}{" "}
                exercises
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedExercises.map((exercise, index) => (
                  <ExerciseCard
                    key={`${exercise.name}-${index}`}
                    exercise={exercise}
                    showInstructions={true}
                  />
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600
                  text-sm font-medium text-slate-600 dark:text-slate-300
                  hover:bg-slate-100 dark:hover:bg-slate-700
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all"
              >
                Previous
              </button>

              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (currentPage <= 4) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = currentPage - 3 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all
                      ${
                        currentPage === pageNum
                          ? "bg-emerald-600 text-white shadow-md"
                          : "border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600
                  text-sm font-medium text-slate-600 dark:text-slate-300
                  hover:bg-slate-100 dark:hover:bg-slate-700
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
