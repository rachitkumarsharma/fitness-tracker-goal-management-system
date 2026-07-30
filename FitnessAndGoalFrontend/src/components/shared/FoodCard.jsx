import { Zap } from "lucide-react";

export function FoodCard({ food }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <img
        // src={`https://source.unsplash.com/random/400x300/?${food.name}`}
        src={food.url}
        alt={food.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {food.name}
        </h3>
        <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">
          {food.description}
        </p>
        <div className="mt-4">
          <h4 className="font-semibold text-slate-900 dark:text-slate-100">
            Nutritional Highlights:
          </h4>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {food.nutrition}
          </p>
        </div>
        <div className="mt-4 flex justify-between items-center text-sm">
          <div className="flex items-center">
            <Zap className="w-4 h-4 text-yellow-500 mr-1" />
            <span>{food.calories}</span>
          </div>
          <div>
            <span className="font-semibold">Best Time: </span>
            <span>{food.bestTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
