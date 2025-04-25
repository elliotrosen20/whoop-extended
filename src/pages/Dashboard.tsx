import { useEffect, useState } from "react";

import { ClipLoader } from 'react-spinners';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
  // need to add types
  const [insights, setInsights] = useState(null);
  const [eqInsights, setEqInsights] = useState(null);
  const [factors, setFactors] = useState(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fileId = localStorage.getItem('fileId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const routes = [
          `/api/analyze/insights/${fileId}`,
          `/api/analyze/eqInsights/${fileId}`,
          `/api/analyze/factors/${fileId}`
        ]
        const responses = await Promise.all(
          routes.map(route => fetch(route, { method: "GET" }))
        );

        const dataArr = await Promise.all(
          responses.map(response => response.json())
        );

        dataArr.forEach(data => {
          if (data.status == 'error') {
            throw new Error(data.error);
          }
        });

        setInsights(dataArr[0]);
        setEqInsights(dataArr[1]);
        setFactors(dataArr[2]);
      } catch (error) {
        toast.error('Error fetching data')
        console.error('Error:', error);
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData();
  }, [fileId])

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
        <span>Populating dashboard...</span>
      </div>
    )
  }

  return (
    <div>

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