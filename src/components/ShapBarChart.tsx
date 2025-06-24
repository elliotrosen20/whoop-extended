import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState } from "react";

interface ShapDetail {
  feature: string;
  name: string;
  units: string;
  importance: number;
  mean_shap_value: number;
}

interface ShapBarChartProps {
  shapData: ShapDetail[];
}

function ShapBarChart ({
  shapData
}: ShapBarChartProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Model Feature Importance</h3>
        <div className="relative">
          <button
            className="w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 transition-colors"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            ?
          </button>
          {showTooltip && (
            <div className="absolute right-0 top-6 w-64 bg-gray-800 text-white text-sm p-3 rounded-lg shadow-lg z-10">
              <div className="font-medium mb-1">How to interpret:</div>
              <div>Higher values indicate features that have more influence on the model's predictions. Features are ranked by their average importance across all predictions.</div>
              <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-800 rotate-45"></div>
            </div>
          )}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={shapData.length * 50}>
        <BarChart data={shapData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={150} />
          <Tooltip formatter={(value: number) => [value.toFixed(3), 'Feature Importance']} />
          <Bar dataKey="importance" fill="#8884d8" name="Feature Importance" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ShapBarChart;