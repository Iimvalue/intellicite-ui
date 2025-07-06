import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import History from "../pages/History";
import Save from "../pages/Save";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Citation from "../pages/Citation";

const navigationList = [
  { label: "Home", path: "/" },
  { label: "History", path: "/history" },
  { label: "Bookmarks", path: "/bookmarks" },
  { label: "Citation Evaluation", path: "/citation" },
];


const footerNavigation = [
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'Terms of Service', path: '/terms' },
  { label: 'Privacy Policy', path: '/privacy' }
];
function Layout() {
  return (
    <>
      <Header logo={"/logo.png"} navigationItems={navigationList} />
      <Outlet />
      {/* Footer */}
      <Footer
        navigationItems={footerNavigation}
        copyrightText="© 2025 IntelliCite. All rights reserved."
      />
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
        element: <History />
      },
      {
        path: "bookmarks",
        element: <Save />,
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
