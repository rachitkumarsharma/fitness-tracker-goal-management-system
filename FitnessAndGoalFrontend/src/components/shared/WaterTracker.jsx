import { useState } from "react";
import { Droplets, Plus, RotateCcw } from "lucide-react";
import { ProgressBar } from "../ui/ProgressBar";

const DAILY_GOAL_LITRES = 3;
const INCREMENT_LITRES = 0.25;

export function WaterTracker() {
  const [consumed, setConsumed] = useState(0);

  const addWater = () => {
    setConsumed((prev) => {
      const next = prev + INCREMENT_LITRES;
      return next > DAILY_GOAL_LITRES
        ? DAILY_GOAL_LITRES
        : Math.round(next * 100) / 100;
    });
  };

  const reset = () => {
    setConsumed(0);
  };

  const percentage = Math.round((consumed / DAILY_GOAL_LITRES) * 100);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
          <Droplets className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Water Intake Tracker
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Stay hydrated throughout the day
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Daily Goal
            </p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {DAILY_GOAL_LITRES}L
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Consumed
            </p>
            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {consumed.toFixed(2)}L
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Progress
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {percentage}%
            </span>
          </div>
          <ProgressBar value={consumed} max={DAILY_GOAL_LITRES} size="lg" />
        </div>

        {/* Water drops visual */}
        <div className="flex flex-wrap gap-2">
          {Array.from({
            length: Math.ceil(DAILY_GOAL_LITRES / INCREMENT_LITRES),
          }).map((_, i) => {
            const threshold = (i + 1) * INCREMENT_LITRES;
            const filled = consumed >= threshold;
            return (
              <div
                key={i}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  filled
                    ? "bg-sky-500 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-400"
                }`}
              >
                <Droplets className="w-3 h-3" />
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={addWater}
            disabled={consumed >= DAILY_GOAL_LITRES}
            className="flex-1 px-4 py-2.5 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add {INCREMENT_LITRES}L
          </button>
          <button
            onClick={reset}
            className="px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {consumed >= DAILY_GOAL_LITRES && (
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl text-center">
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
              🎉 Great job! You've reached your daily water goal!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
