import { Link } from 'react-router-dom'
import './App.css'
// import Upload from './pages/Upload'

function App() {
  return (
    <>
      {/* <Upload /> */}
      <h1>Hello app</h1>
      <nav>
        <ul>
          <li>
            <Link to="upload">Upload File</Link>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default App
