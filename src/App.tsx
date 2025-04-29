import { Link } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to WHOOP Extended</h1>
      <p className="mb-8">Analyze your WHOOP data to gain unique insights about your performance and recovery.</p>
      <Link to="/upload" className="text-white font-bold py-3 px-6 rounded-lg">
        Get Started
      </Link>
    </div>
  )
}

export default App
