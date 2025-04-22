import { useState } from 'react'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Upload() {
  const [file, setFile] = useState<File | null>(null)

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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }
      
      const data = await response.json() as {
        file_id: string;
        message: string;
      };

      if (!data.file_id) {
        throw new Error('Server response missing file ID')
      }

      localStorage.setItem('fileId', data.file_id);
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

  return (
    <div>
      <h1>CSV Upload</h1>

      <input type="file" onChange={handleFileChange}/>
      <button onClick={handleSubmit}>Upload</button>

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