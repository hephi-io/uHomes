import { createBrowserRouter } from "react-router-dom";
import Hell02 from "../layouts/Hell02";
import Index from "../layouts/auth/Index";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Hell02 />,
  },
  {
    path: "/auth",
    element: <Index />,
  },
]);

export default router;
