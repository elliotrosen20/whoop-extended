import { useEffect, useState } from "react";

import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShapModule from "../components/ShapModule";
import InsightsModule from "../components/InsightsModule";
import EqInsightsModule from "../components/EqInsightsModule";
import PredictionModule from "../components/PredictionModule";

function Dashboard() {
  const navigate = useNavigate();

  const [insights, setInsights] = useState([]);
  const [eqInsights, setEqInsights] = useState([]);
  const [shapData, setShapData] = useState([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('insights');
  const [showInsightsTooltip, setShowInsightsTooltip] = useState<boolean>(false);
  const [showEqTooltip, setShowEqTooltip] = useState<boolean>(false);

  const fileId = localStorage.getItem('fileId');
  const insightsReady = localStorage.getItem('insightsReady') === 'true';

  let hasAnyError = false;

  useEffect(() => {
    if (!fileId || !insightsReady) {
      console.log('Missing fileId or insights not ready, redirecting to upload page');
      navigate('/upload');
    }
  }, [fileId, insightsReady, navigate])


  useEffect(() => {
    const fetchData = async () => {
      try {
        const routes = [
          `${import.meta.env.VITE_API_URL}/api/analyze/insights/${fileId}`,
          `${import.meta.env.VITE_API_URL}/api/analyze/eqInsights/${fileId}`,
          `${import.meta.env.VITE_API_URL}/api/analyze/shap/${fileId}`
        ]

        setHasError(false);

        const responses = await Promise.all(
          routes.map(route => fetch(route, { method: "GET" }))
        );
        
        try {
          const insightsData = await responses[0].json();
          setInsights(insightsData || []);
        } catch (err) {
          console.error("Error parsing insights", err);
          setInsights([]);
          hasAnyError = true;
        }

        try {
          const eqInsightsData = await responses[1].json();
          setEqInsights(eqInsightsData || []);
        } catch (err) {
          console.error("Error parsing eqInsights:", err)
          setEqInsights([]);
          hasAnyError = true;
        }

        try {
          const shapData = await responses[2].json();
          setShapData(shapData || []);
        } catch (err) {
          console.error("Error parsing shapData:", err);
          setShapData([]);
          hasAnyError = true;
        }


        if (hasAnyError) {
          setHasError(true);
        }
      } catch (error) {
        setHasError(true)
        toast.error('Error fetching data')
        console.error('Error:', error);
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData();
  }, [])

  const handleReset = async () => {
    const isConfirmed = window.confirm("Are you sure you want to reset? All current data will be lost.");
    
    if (!isConfirmed) {
      return;
    }
  
    setIsLoading(true);

    localStorage.removeItem('fileId');
    localStorage.removeItem('insightsReady');

    await new Promise(resolve => setTimeout(resolve, 2000));
    navigate('/upload');
  }

  if (isLoading){
    return (
      <div
        className="flex flex-col justify-center items-center mt-10"
      >
        <ClipLoader
          color={"#3B82F6"}
          loading={isLoading}
          size={35}
        />
      </div>
    )
  }

  if (hasError){
    return (
      <div>Error fetching insights</div>
    )
  }

  return (
    <div className="">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800 text-center">Whoop Extended</h1>
        <button
          onClick={handleReset}
          className="mt-4"
        >
          Analyze New File
        </button>
      </div>


      <div className="flex justify-between mb-6 p-4 bg-gray-50 rounded-lg shadow-md">
        <button
          onClick={() => setActiveTab('insights')}
          className={activeTab === 'insights' ? 'active' : ''}
        >
          Insights
        </button>
        <button
          onClick={() => setActiveTab('feature_analysis')}
          className={activeTab === 'feature_analysis' ? 'active' : ''}
        >
          Feature Analysis
        </button>
        <button
          onClick={() => setActiveTab('simulate')}
          className={activeTab === 'simulate' ? 'active' : ''}
        >
          Simulate
        </button>
      </div>

      <p className="text-center text-gray-500 text-sm mb-8">Hover over <span className="font-bold">?</span> for explanations</p>
      
      <div className="w-[80vw]">
        {activeTab === 'insights' ? (
          <div>
            
            <div className="flex items-center justify-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 text-center">Recovery Insights</h2>
              <div className="relative ml-2">
                <button
                  className="w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 transition-colors"
                  onMouseEnter={() => setShowInsightsTooltip(true)}
                  onMouseLeave={() => setShowInsightsTooltip(false)}
                >
                  ?
                </button>
                {showInsightsTooltip && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-6 w-80 bg-gray-800 text-white text-sm p-3 rounded-lg shadow-lg z-10">
                    <div className="font-medium mb-1">Recovery Insights:</div>
                    <div>Actionable recommendations showing how changing specific behaviors (sleep, strain, etc.) would impact your recovery score. Each card shows the potential improvement from optimizing that factor.</div>
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                  </div>
                )}
              </div>
            </div>
            <div className="mb-4 bg-gray-500 rounded-xl">
              <InsightsModule insights={insights}/>
            </div>

            <div className="flex items-center justify-center mb-6 mt-20">
              <h2 className="text-2xl font-semibold text-gray-800 text-center">Equivalence Factors</h2>
              <div className="relative ml-2">
                <button
                  className="w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 transition-colors"
                  onMouseEnter={() => setShowEqTooltip(true)}
                  onMouseLeave={() => setShowEqTooltip(false)}
                >
                  ?
                </button>
                {showEqTooltip && (
                                     <div className="absolute left-1/2 transform -translate-x-1/2 top-6 w-80 bg-gray-800 text-white text-sm p-3 rounded-lg shadow-lg z-10">
                     <div className="font-medium mb-1">Equivalence Factors:</div>
                     <div>Shows the ratio between different recovery factors. For example, "3.2× ratio" means changing one factor by a certain amount has the same recovery impact as changing another factor by 3.2× that amount.</div>
                     <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                   </div>
                )}
              </div>
            </div>
            <div className="mb-4 bg-gray-500 rounded-xl">
              <EqInsightsModule eqInsights={eqInsights}/>
            </div>
          </div>
        ) : activeTab === 'feature_analysis' ? (
          <div className="mb-4">
            <ShapModule shapData={shapData}/>
          </div>
        ) : (
          <PredictionModule />
        )}
      </div>

      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default Dashboard;