import { useRef, useState } from 'react'
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

  const handleSubmit = async () => {
    try {
      if (!file) {
        toast.error('Please select a file');
        return;
      }
      const fd = new FormData();

      fd.append('file', file);

      const response = await fetch('/api/upload', {
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
      // const response = await fetch(`/api/generate/${fileId}`, {
      //   method: "POST"
      // });

      // process response

      // localStorage.setItem('insightsReady', 'true');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:',error);
    } finally {
      setIsGenerating(false);
    }
  }

  const handleNewUpload = () => {
    localStorage.removeItem('fileId');
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
    <div>
      <h1>CSV Upload</h1>

      {fileId ? (
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
          <button 
            onClick={handleSubmit}
          >
            Upload
          </button>
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