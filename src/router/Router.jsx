import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

function Layout() {
  return <Outlet />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <h1>Home page</h1> },
      { path: "login", element: <h1>Login</h1> },
      { path: "register", element: <h1>Register</h1> },


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
