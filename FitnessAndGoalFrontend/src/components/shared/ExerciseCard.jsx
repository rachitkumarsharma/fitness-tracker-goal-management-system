import { Dumbbell, Zap, Target, ChevronRight } from "lucide-react";
import { useState } from "react";

const difficultyStyles = {
  beginner: {
    bg: "bg-emerald-100 dark:bg-emerald-900",
    text: "text-emerald-800 dark:text-emerald-200",
    label: "Beginner",
  },
  intermediate: {
    bg: "bg-amber-100 dark:bg-amber-900",
    text: "text-amber-800 dark:text-amber-200",
    label: "Intermediate",
  },
  expert: {
    bg: "bg-rose-100 dark:bg-rose-900",
    text: "text-rose-800 dark:text-rose-200",
    label: "Expert",
  },
};

export function ExerciseCard({ exercise, onSelect, showInstructions = true }) {
  const [showFullInstructions, setShowFullInstructions] = useState(false);
  const difficulty = exercise.difficulty?.toLowerCase() || "beginner";
  const style = difficultyStyles[difficulty] || difficultyStyles.beginner;

  const truncateInstructions = (text, maxLength = 150) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden
        transform hover:-translate-y-1 transition-all duration-300
        ${onSelect ? "cursor-pointer hover:shadow-lg hover:ring-2 hover:ring-emerald-500" : ""}
      `}
      onClick={() => onSelect && onSelect(exercise)}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {exercise.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                {exercise.type?.replace(/_/g, " ")}
              </p>
            </div>
          </div>
          {onSelect && (
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {exercise.muscle && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 capitalize">
              <Target className="w-3 h-3" />
              {exercise.muscle}
            </span>
          )}
          {exercise.difficulty && (
            <span
              className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full capitalize ${style.bg} ${style.text}`}
            >
              <Zap className="w-3 h-3" />
              {style.label}
            </span>
          )}
          {exercise.equipment && exercise.equipment !== "body only" && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 capitalize">
              {exercise.equipment}
            </span>
          )}
        </div>

        {/* Instructions */}
        {showInstructions && exercise.instructions && (
          <div className="mt-2">
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {showFullInstructions
                ? exercise.instructions
                : truncateInstructions(exercise.instructions)}
            </p>
            {exercise.instructions.length > 150 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullInstructions(!showFullInstructions);
                }}
                className="mt-1 text-xs font-medium text-emerald-600 hover:text-emerald-500"
              >
                {showFullInstructions ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
