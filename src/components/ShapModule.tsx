import { useState } from "react";
import ShapWaterfallChart from "./ShapWaterfallChart";
import ShapBarChart from "./ShapBarChart";

interface ShapDetail {
  feature: string;
  name: string;
  units: string;
  importance: number;
  mean_shap_value: number;
}

interface ShapModuleProps {
  shapData: ShapDetail[];
}

function ShapModule({
  shapData
}: ShapModuleProps) {
  const [activeTab, setActiveTab] = useState<string>('bar');


  return (
    <div className="px-4 sm:px-6 lg:px-8 bg-gray-100 py-8 rounded-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Model Insights</h1>
      
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('bar')}
          className={activeTab === 'bar' ? 'active' : ''}
        >
          Feature Importance
        </button>
        <button
          onClick={() => setActiveTab('waterfall')}
          className={activeTab === 'waterfall' ? 'active' : ''}
        >
          SHAP Waterfall
        </button>
      </div>

      <div>
        {activeTab === 'bar' ? (
          <ShapBarChart shapData={shapData} />
        ) : activeTab === 'waterfall' ? (
          <ShapWaterfallChart shapData={shapData} />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  )
}

export default ShapModule;