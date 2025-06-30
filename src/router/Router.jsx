import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";

function Layout() {
  return <Outlet />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home/> },
      { path: "login", element: <Login/>  },
      { path: "register", element: <Register/> },


      {
        path: "history",
        element: <h1 >History</h1>,
      },
      {
        path: "ٍِsave-papers",
        element: <>Save</>,
      },
      {
        path: "profile",
        element: <>Profile</>,
      },
      {
        path: "poster",
        element: (
          <>Poster Creation</>
        ),
      },
      {
        path: "citation",
        element: (
          <>Citation Evaluation</>
        ),
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
