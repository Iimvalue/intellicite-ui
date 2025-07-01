import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Citation from "../pages/Citation";

function Layout() {
  return (
    <>
      <Outlet />
    </>
  );
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
        element: <h1>Save</h1>,
      },
      {
        path: "profile",
        element: <Profile /> ,
      },
      {
        path: "poster",
        element: (
          <h1>Poster Creation</h1>
        ),
      },
      {
        path: "citation",
        element: (
        <Citation/>
        ),
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
