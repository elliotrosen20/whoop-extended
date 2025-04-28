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
  // add props and types
  shapData: ShapDetail[];
}

function ShapModule({
  shapData
}: ShapModuleProps) {
  const [activeTab, setActiveTab] = useState('bar');


  return (
    // <div>
    //   <h1>Shap Module</h1>
    //   <div
    //     className='flex flex-row justify-'
    //   >
        // <button
        //   onClick={() => setActiveTab('bar')}
        //   className={activeTab === 'bar' ? 'active' : ''}
        // >
        //   Bar Chart
        // </button>
        // <button
        //   onClick={() => setActiveTab('waterfall')}
        //   className={activeTab === 'waterfall' ? 'active' : ''}
        // >
        //   Waterfall
        // </button>
    //   </div>
    //   <div>
    //     {activeTab === 'bar' ? (
    //       <ShapBarChart shapData={shapData} />
    //     ) : (
    //       activeTab === 'waterfall' ? (
    //       <ShapWaterfallChart shapData={shapData} />
    //     ) : (
    //       <div></div>
    //     ))}
    //   </div>
    // </div>
    <div className="w-full px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="max-w-4xl mx-auto py-8">
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
    </div>
  )
}

export default ShapModule;