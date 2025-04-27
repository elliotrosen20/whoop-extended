import App from './App'
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload'

const routes = [
  {
    path: "/",
    element: <App />
  },
  {
    path: "upload",
    element: <Upload />
  },
  {
    path: "dashboard",
    element: <Dashboard />
  }
];

export default routes;
