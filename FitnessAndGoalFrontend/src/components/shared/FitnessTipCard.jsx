import { Copy, Share2 } from "lucide-react";

export function FitnessTipCard({ tip }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(tip.text);
    // You can add a toast notification here to indicate success
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Fitness Tip",
        text: tip.text,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 flex flex-col justify-between">
      <div>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            tip.category === "Nutrition"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              : tip.category === "Exercise"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                : tip.category === "Recovery"
                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
          }`}
        >
          {tip.category}
        </span>
        <p className="mt-4 text-lg text-slate-700 dark:text-slate-200">
          {tip.text}
        </p>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={handleCopy}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <Copy className="w-5 h-5 text-slate-500" />
        </button>
        <button
          onClick={handleShare}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <Share2 className="w-5 h-5 text-slate-500" />
        </button>
      </div>
    </div>
  );
}
