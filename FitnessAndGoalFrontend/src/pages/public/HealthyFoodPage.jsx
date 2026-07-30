import { useState } from "react";
import { FoodCard } from "../../components/shared/FoodCard";
import { Search } from "lucide-react";

const foodData = [
  {
    name: "Oats",
    description: "A whole-grain food, known for being a great source of fiber.",
    nutrition: "Rich in complex carbs and fiber.",
    calories: "150 per 1/2 cup",
    benefits: [
      "Lowers blood sugar levels",
      "Provides antioxidants",
      "Promotes healthy bacteria in your gut",
    ],
    bestTime: "Breakfast",
    url: "https://plus.unsplash.com/premium_photo-1663924212091-377b19fbb6b1?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Eggs",
    description: "A great source of high-quality protein.",
    nutrition: "Rich in protein, vitamin D, and choline.",
    calories: "70 per egg",
    benefits: [
      "Supports muscle growth",
      "Improves recovery",
      "Boosts brain health",
    ],
    bestTime: "Breakfast",
    url: "https://images.unsplash.com/photo-1582169505937-b9992bd01ed9?q=80&w=2220&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Bananas",
    description:
      "A convenient source of potassium and other essential nutrients.",
    nutrition: "High in potassium, vitamin B6, and vitamin C.",
    calories: "105 per medium banana",
    benefits: [
      "Provides quick energy",
      "Supports heart health",
      "Aids digestion",
    ],
    bestTime: "Any time",
    url: "https://media.istockphoto.com/id/1448164704/photo/delicious-bananas-on-black.jpg?s=1024x1024&w=is&k=20&c=8wMTLqKNlVlSTYKdVdOZuKGxISM7q4NlxY7MgeWiTHM=",
  },
  {
    name: "Almonds",
    description: "A nutrient-dense nut with healthy fats and protein.",
    nutrition: "Rich in healthy fats, protein, and fiber.",
    calories: "160 per 1/4 cup",
    benefits: [
      "Lowers cholesterol levels",
      "Reduces blood pressure",
      "Supports weight management",
    ],
    bestTime: "Snack",
    url: "https://images.unsplash.com/photo-1611774017274-ec655f187ef3?q=80&w=2316&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Chicken Breast",
    description: "A lean source of high-quality protein.",
    nutrition: "High in protein, low in fat.",
    calories: "165 per 3oz",
    benefits: [
      "Builds and repairs muscle tissue",
      "Supports bone health",
      "Boosts metabolism",
    ],
    bestTime: "Lunch/Dinner",
    url: "https://images.unsplash.com/photo-1670398564097-0762e1b30b3a?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Brown Rice",
    description: "A whole grain that is a good source of fiber.",
    nutrition: "Rich in fiber, magnesium, and selenium.",
    calories: "215 per cup",
    benefits: [
      "Aids in digestion",
      "Lowers risk of heart disease",
      "Helps with weight management",
    ],
    bestTime: "Lunch/Dinner",
    url: "https://images.unsplash.com/photo-1665400808116-f0e6339b7e9a?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Spinach",
    description: "A leafy green vegetable packed with nutrients.",
    nutrition: "Rich in vitamins A, C, and K, as well as iron and calcium.",
    calories: "7 per cup",
    benefits: [
      "Improves eye health",
      "Reduces oxidative stress",
      "Strengthens bones",
    ],
    bestTime: "Any time",
    url: "https://plus.unsplash.com/premium_photo-1703260007808-bdc648fd29b7?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Greek Yogurt",
    description: "A thick, creamy yogurt that is high in protein.",
    nutrition: "High in protein and probiotics.",
    calories: "100 per 6oz",
    benefits: ["Improves gut health", "Boosts metabolism", "Strengthens bones"],
    bestTime: "Any time",
    url: "https://media.istockphoto.com/id/1135585760/photo/two-glass-bowls-with-white-yogurt-on-old-wooden-desk.jpg?s=1024x1024&w=is&k=20&c=jEHQZW2BZlFRRvCFj7HbyxoEdx8oEo6TtWMDylXOjXA=",
  },
  {
    name: "Salmon",
    description: "A fatty fish that is rich in omega-3 fatty acids.",
    nutrition: "Rich in omega-3 fatty acids and protein.",
    calories: "200 per 3oz",
    benefits: [
      "Supports brain health",
      "Reduces inflammation",
      "Protects against heart disease",
    ],
    bestTime: "Dinner",
    url: "https://plus.unsplash.com/premium_photo-1701006579137-2d976f001522?q=80&w=2344&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Apples",
    description:
      "A popular fruit that is a good source of fiber and vitamin C.",
    nutrition: "Rich in fiber and vitamin C.",
    calories: "95 per medium apple",
    benefits: [
      "Aids in weight loss",
      "Lowers risk of diabetes",
      "Promotes good gut bacteria",
    ],
    bestTime: "Snack",
    url: "https://plus.unsplash.com/premium_photo-1661322640130-f6a1e2c36653?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export function HealthyFoodPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  const filteredFood = foodData.filter((food) => {
    return (
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (category === "All" || food.bestTime === category)
    );
  });

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 pt-16">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Healthy Food Guide
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Discover nutritious foods to fuel your fitness journey.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for a food..."
              className="w-full p-2 pl-10 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm dark:bg-slate-700"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="p-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm dark:bg-slate-700"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch/Dinner">Lunch/Dinner</option>
            <option value="Snack">Snack</option>
            <option value="Any time">Any time</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFood.map((food) => (
            <FoodCard key={food.name} food={food} />
          ))}
        </div>
      </div>
    </div>
  );
}
