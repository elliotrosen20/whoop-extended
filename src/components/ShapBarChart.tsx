import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ShapDetail {
  feature: string;
  name: string;
  units: string;
  importance: number;
  mean_shap_value: number;
}

interface ShapBarChartProps {
  // add props and types
  shapData: ShapDetail[];
}

function ShapBarChart ({
  shapData
}: ShapBarChartProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Model Feature Importance</h3>
      <ResponsiveContainer width="100%" height={shapData.length * 50}>
        <BarChart data={shapData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={150} />
          <Tooltip />
          <Legend />
          <Bar dataKey="importance" fill="#8884d8" name="Feature Importance" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ShapBarChart;