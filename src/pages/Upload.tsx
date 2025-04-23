import { useState } from 'react'
// import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Upload() {
  const [file, setFile] = useState<File | null>(null)
  // const navigate = useNavigate();
  // const [isUploaded, setIsUploaded] = useState<boolean>(false)

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
      toast.success('File uploaded successfully!');

      // navigate('/dashboard');

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

  // const handleGenerate = () => {

  // }

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