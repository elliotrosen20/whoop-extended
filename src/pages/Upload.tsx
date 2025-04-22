import { useState } from 'react'

function Upload() {
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = () => {
    if (!file) {
      alert('Please select a file')
      return
    }
    const fd = new FormData()

    fd.append('file', file)
    fetch('/api/upload', {
      method: "POST",
      body: fd
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err))
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
    </div>
  )
}

export default Upload;