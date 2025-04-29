import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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
  return (
    <div className="bg-white p-4 rounded-lg shadow text-center">
      <h3 className="text-lg font-medium mb-4">SHAP Feature Impact</h3>
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
          <Tooltip />
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