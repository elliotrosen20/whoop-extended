import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [fileId, setFileId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedFileId = localStorage.getItem('fileId');
    if (storedFileId) {
      setFileId(storedFileId);
    }
  }, []);

  const handleSubmit = async () => {
    try {
      if (!file) {
        toast.error('Please select a file');
        return;
      }
      const fd = new FormData();

      fd.append('file', file);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
        method: "POST",
        body: fd
      })

      const text = await response.text();

      if (!text) {
        throw new Error('Server returned an empty response');
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid response format from server');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      if (!data.file_id) {
        throw new Error('Server response missing file ID')
      }

      localStorage.setItem('fileId', data.file_id);
      setFileId(data.file_id);
      toast.success('File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error)

      let errorMessage: string;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = 'Failed to upload file';
      }
      toast.error(errorMessage);
    }
  }

  const handleUseDemo = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/demo`, {
        method: "GET"
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load demo');
      }
  
      if (!data.file_id) {
        throw new Error('Server response missing file ID');
      }
  
      localStorage.setItem('fileId', data.file_id);
      setFileId(data.file_id);
      toast.success('Demo file loaded successfully!');
    } catch (error) {
      console.error('Demo loading error:', error);
      
      let errorMessage: string;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = 'Failed to load demo file';
      }
      toast.error(errorMessage);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile);
  }

  const handleGenerate = async () => {
    const fileId = localStorage.getItem('fileId');

    if (!fileId) {
      toast.error('No file has been uploaded. Please upload a file first.');
      return;
    }

    setIsGenerating(true);

    await new Promise(resolve => setTimeout(resolve, 5000));
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze/model/${fileId}`, {
        method: "POST"
      });

      const res = await response.json();

      if (res.status == 'error') {
        throw new Error(res.error)
      }

      // process response

      localStorage.setItem('insightsReady', 'true');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Error generating insights');
      handleNewUpload();
      console.error('Error:',error);
    } finally {
      setIsGenerating(false);
    }
  }

  const handleNewUpload = () => {
    localStorage.removeItem('fileId');
    localStorage.removeItem('insightsReady');
    setFileId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFile(null);
  }

  if (isGenerating){
    return (
      <div
        className="flex flex-col justify-center items-center mt-10"
      >
        <ClipLoader
          color={"#3B82F6"}
          loading={isGenerating}
          size={35}
        />
        <span>Generating insights...</span>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Upload your data</h1>
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">How to Export Your WHOOP Data:</h2>
        <ol className="list-decimal pl-6 space-y-2 text-left">
          <li>Instructions on exporting your data from your Whoop app can be found <a href="https://support.whoop.com/s/article/How-to-Export-Your-Data?language=en_US" className="text-blue-600 hover:underline">here</a></li>
          <li>Once downloaded, unzip the folder</li>
          <li>Locate the <strong>physiological_cycles.csv</strong> file in the unzipped folder</li>
          <li>Upload this raw CSV file below without modifying it</li>
        </ol>
        <hr />
        <h3>Note: Several hundred days/nights worth of data is required for accuracy of insights and predictions</h3>
      </div>

      {fileId && localStorage.getItem('insightsReady') === 'true' ? (
        // User has already generated insights
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-3">You've already analyzed a file.</h2>
          <p className="mb-6">Your insights are ready to view in the dashboard.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
            >
              View Dashboard
            </button>
            <button 
              onClick={handleNewUpload}
            >
              Upload a New File
            </button>
          </div>
        </div>
      ) : fileId ? (
        <div className="flex flex-col gap-4">
          <button
            onClick={handleGenerate}
            className='mt-10'
          >
            Generate insights
          </button>
          <h3>or</h3>
          <button 
            onClick={handleNewUpload}
          >
            Upload a new file
          </button>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-10">
          <input
            id="file_input"
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            // className='block'
            className='block text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100 mt-4
                      border-blue-500 border-2'
          />
          <div className="flex flex-row justify-center items-center gap-4">
            <button onClick={handleSubmit}>
              Upload
            </button>
            <h3>or</h3>
            <button onClick={handleUseDemo}>
              Try Demo
            </button>
          </div>
        </div>
      )}

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

export default Upload;