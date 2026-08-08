import { useState, useMemo } from "react";
import { FitnessTipCard } from "../../components/shared/FitnessTipCard";
import { WaterTracker } from "../../components/shared/WaterTracker";
import { BMIWidget } from "../../components/shared/BMIWidget";
import { RefreshCw } from "lucide-react";

const tipsData = [
  { text: "Stay hydrated throughout the day.", category: "Nutrition" },
  { text: "Sleep at least 7–8 hours per night.", category: "Recovery" },
  { text: "Track your workouts to monitor progress.", category: "Motivation" },
  {
    text: "Warm up before exercising to prevent injuries.",
    category: "Exercise",
  },
  { text: "Avoid processed foods and sugary drinks.", category: "Nutrition" },
  {
    text: "Maintain proper posture, especially when sitting.",
    category: "Exercise",
  },
  {
    text: "Stretch after workouts to improve flexibility.",
    category: "Recovery",
  },
  { text: "Be consistent with your workout routine.", category: "Motivation" },
  {
    text: "Focus on progressive overload to build strength.",
    category: "Exercise",
  },
  { text: "Listen to your body and rest when needed.", category: "Recovery" },
  {
    text: "Eat a balanced diet with plenty of protein.",
    category: "Nutrition",
  },
  {
    text: "Incorporate compound exercises into your routine.",
    category: "Exercise",
  },
  { text: "Don't skip leg day.", category: "Exercise" },
  { text: "Find a workout partner to stay motivated.", category: "Motivation" },
  {
    text: "Set realistic and achievable fitness goals.",
    category: "Motivation",
  },
  { text: "Foam roll to relieve muscle soreness.", category: "Recovery" },
  { text: "Plan your meals for the week.", category: "Nutrition" },
  { text: "Stay active on your rest days.", category: "Exercise" },
  { text: "Celebrate your fitness milestones.", category: "Motivation" },
  { text: "Don't be afraid to try new exercises.", category: "Exercise" },
];

export function FitnessTipsPage() {
  const [category, setCategory] = useState("All");
  const [randomTip, setRandomTip] = useState(
    tipsData[Math.floor(Math.random() * tipsData.length)],
  );

  const filteredTips = tipsData.filter((tip) => {
    return category === "All" || tip.category === category;
  });

  const generateRandomTip = () => {
    const newTip = tipsData[Math.floor(Math.random() * tipsData.length)];
    setRandomTip(newTip);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl py-6 px-4 text-center text-white shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Fitness Tips
        </h1>

        <p className="mt-1 text-sm md:text-base text-emerald-50">
          Daily advice to support your fitness journey.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 space-y-16">
        {/* Daily Tip */}
        <section>
          <div
            className="
      bg-gradient-to-r
      from-emerald-50
      to-teal-50
      dark:from-slate-800
      dark:to-slate-900
      rounded-2xl
      shadow-md
      p-5
      border
    "
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  💡 Daily Tip
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Small habits create big changes.
                </p>
              </div>

              <button
                onClick={generateRandomTip}
                className="
          flex items-center gap-2
          px-4 py-2
          bg-emerald-600
          text-white
          text-sm
          rounded-lg
          hover:bg-emerald-700
          transition
        "
              >
                <RefreshCw className="w-4 h-4" />
                New Tip
              </button>
            </div>

            <FitnessTipCard tip={randomTip} />
          </div>
        </section>

        {/* Health Insights */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold">Health Insights</h2>

            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Monitor hydration levels and body health metrics.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 w-full">
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6">
                <WaterTracker />
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6">
                <BMIWidget />
              </div>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Explore Tips</h2>

            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Filter fitness tips by category.
            </p>
          </div>

          <div className="flex justify-center mb-10">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="
              w-full
              md:w-72
              px-4
              py-3
              rounded-xl
              border
              border-slate-300
              dark:border-slate-600
              shadow-md
              dark:bg-slate-800
            "
            >
              <option value="All">All Categories</option>
              <option value="Nutrition">Nutrition</option>
              <option value="Exercise">Exercise</option>
              <option value="Recovery">Recovery</option>
              <option value="Motivation">Motivation</option>
            </select>
          </div>

          {/* Tips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTips.map((tip, index) => (
              <div
                key={index}
                className="
                transition-all
                duration-300
                hover:-translate-y-2
                hover:shadow-xl
              "
              >
                <FitnessTipCard tip={tip} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
