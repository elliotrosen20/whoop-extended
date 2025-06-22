import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState } from "react";

interface ShapDetail {
  feature: string;
  name: string;
  units: string;
  importance: number;
  mean_shap_value: number;
}

interface ShapWaterfallChartProps {
  // add props and types
  shapData: ShapDetail[];
}

function ShapWaterfallChart ({
  shapData
}: ShapWaterfallChartProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg shadow text-center">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">SHAP Feature Impact</h3>
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
              <div>Green bars push the prediction higher, red bars push it lower. Bar length shows the magnitude of each feature's impact on the specific prediction.</div>
              <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-800 rotate-45"></div>
            </div>
          )}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={shapData.length * 50}>
        <BarChart 
          data={shapData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis 
            type="category"
            dataKey="name"
            width={140}
            interval={0}
          />
          <Tooltip formatter={(value: number) => [value.toFixed(3), 'SHAP Impact']} />
          <ReferenceLine x={0} stroke="#000" />
          <Bar 
            dataKey="mean_shap_value" 
            name="SHAP Impact"
            barSize={20}
          >
            {
              shapData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.mean_shap_value > 0 ? '#82ca9d' : '#ff7f7f'} />
              ))
            }
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ShapWaterfallChart;