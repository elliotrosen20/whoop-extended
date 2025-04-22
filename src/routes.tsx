import App from './App'
import Upload from './pages/Upload'

const routes = [
  {
    path: "/",
    element: <App />
  },
  {
    path: "upload",
    element: <Upload />
  }
];

export default routes;
