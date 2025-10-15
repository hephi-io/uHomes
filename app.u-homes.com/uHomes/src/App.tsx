import { RouterProvider } from "react-router-dom";
import "./assets/base.css";
import router from "./routes/index";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
