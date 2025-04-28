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
    <div>
      <h1>Shap Module</h1>
      <div
        className='flex flex-row justify-'
      >
        <button
          onClick={() => setActiveTab('bar')}
          className={activeTab === 'bar' ? 'active' : ''}
        >
          Bar Chart
        </button>
        <button
          onClick={() => setActiveTab('waterfall')}
          className={activeTab === 'waterfall' ? 'active' : ''}
        >
          Waterfall
        </button>
        {/* <button
          onClick={() => setActiveTab('force')}
          className={activeTab === 'force' ? 'active' : ''}
        >
          Force
        </button> */}
      </div>
      {/* <ShapWaterfallChart shapData={shapData} />
      <ShapBarChart shapData={shapData} /> */}
      <div>
        {activeTab === 'bar' ? (
          <ShapBarChart shapData={shapData} />
        ) : (
          activeTab === 'waterfall' ? (
          <ShapWaterfallChart shapData={shapData} />
        ) : (
          <div></div>
        ))}
      </div>
    </div>
  )
}

export default ShapModule;