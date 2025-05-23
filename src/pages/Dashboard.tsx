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
  // need to add types
  const navigate = useNavigate();

  const [insights, setInsights] = useState([]);
  const [eqInsights, setEqInsights] = useState([]);
  const [shapData, setShapData] = useState([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('insights');

  const fileId = localStorage.getItem('fileId');
  const insightsReady = localStorage.getItem('insightsReady') === 'true';

  let hasAnyError = false;

  useEffect(() => {
    if (!fileId || !insightsReady) {
      console.log('Missing fileId or insights not ready, redirecting to upload page');
      navigate('/upload');
    }
  }, [fileId, insightsReady, navigate])

  // if (!fileId || !insightsReady) {
  //   console.log('Missing fileId or insights not ready, redirecting to upload page');
  //   return <Navigate to="/upload" replace />;
  // }

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
          // setHasError(true);
          hasAnyError = true;
        }

        try {
          const eqInsightsData = await responses[1].json();
          setEqInsights(eqInsightsData || []);
        } catch (err) {
          console.error("Error parsing eqInsights:", err)
          setEqInsights([]);
          // setHasError(true);
          hasAnyError = true;
        }

        try {
          const shapData = await responses[2].json();
          setShapData(shapData || []);
        } catch (err) {
          console.error("Error parsing shapData:", err);
          setShapData([]);
          // setHasError(true);
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
        {/* <span>Populating dashboard...</span> */}
      </div>
    )
  }

  if (hasError){
    return (
      <div>Error fetching insights</div>
    )
  }

  return (
    // <div className="w-full px-4 sm:px-6 lg:px-8 max-w-full mx-auto">
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

      <div className="w-[80vw]">
        {activeTab === 'insights' ? (
          <div>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Recovery Insights</h2>
            <div className="mb-4 bg-gray-500 rounded-xl">
              <InsightsModule insights={insights}/>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center mt-20">Equivalence Factors</h2>
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