import { useState, useMemo } from "react";
import { FitnessTipCard } from "../../components/shared/FitnessTipCard";
import { WaterTracker } from "../../components/shared/WaterTracker";
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
    <div className="space-y-8">
      <div className="text-center space-y-4 pt-16">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Fitness Tips
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Daily advice to help you on your fitness journey.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Daily Tip</h2>
          <FitnessTipCard tip={randomTip} />
          <button
            onClick={generateRandomTip}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            New Tip
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <select
            className="p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm dark:bg-slate-700"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Nutrition">Nutrition</option>
            <option value="Exercise">Exercise</option>
            <option value="Recovery">Recovery</option>
            <option value="Motivation">Motivation</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTips.map((tip, index) => (
            <FitnessTipCard key={index} tip={tip} />
          ))}
        </div>
      </div>

      {/* Water Intake Tracker Widget */}
      <div className="max-w-md mx-auto mt-16">
        <WaterTracker />
      </div>
    </div>
  );
}
