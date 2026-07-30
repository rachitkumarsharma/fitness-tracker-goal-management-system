import { useState } from "react";
import { Ruler, Weight, Calculator } from "lucide-react";

export function BMIWidget() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [status, setStatus] = useState("");

  const calculateBMI = () => {
    if (!height || !weight) return;
    const heightInM = parseFloat(height) / 100;
    const weightKg = parseFloat(weight);
    if (heightInM <= 0 || weightKg <= 0) return;
    const bmiValue = weightKg / (heightInM * heightInM);
    const roundedBMI = Math.round(bmiValue * 10) / 10;
    setBmi(roundedBMI);

    if (roundedBMI < 18.5) setStatus("Underweight");
    else if (roundedBMI < 25) setStatus("Normal");
    else if (roundedBMI < 30) setStatus("Overweight");
    else setStatus("Obese");
  };

  const reset = () => {
    setHeight("");
    setWeight("");
    setBmi(null);
    setStatus("");
  };

  const statusColors = {
    Underweight: "text-blue-600 dark:text-blue-400",
    Normal: "text-emerald-600 dark:text-emerald-400",
    Overweight: "text-amber-600 dark:text-amber-400",
    Obese: "text-rose-600 dark:text-rose-400",
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            BMI Calculator
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Body Mass Index
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-emerald-500" />
              Height (cm)
            </div>
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="e.g. 175"
            className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            <div className="flex items-center gap-2">
              <Weight className="w-4 h-4 text-emerald-500" />
              Weight (kg)
            </div>
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g. 70"
            className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={calculateBMI}
            className="flex-1 px-4 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Calculate BMI
          </button>
          <button
            onClick={reset}
            className="px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Reset
          </button>
        </div>

        {bmi !== null && (
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
            <div className="text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Your BMI
              </p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {bmi}
              </p>
              <p
                className={`mt-1 text-lg font-semibold ${statusColors[status]}`}
              >
                {status}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-1 text-center text-xs">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                Underweight{`<18.5`}
              </div>
              <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                Normal
                <br />
                18.5–25
              </div>
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                Overweight
                <br />
                25–30
              </div>
              <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300">
                Obese{`>30`}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
