import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import History from "../pages/History";
import Save from "../pages/Save";
import Home from "../pages/Home";

const navigationList = [
  { label: "Home", path: "/" },
  { label: "History", path: "/history" },
  { label: "Save Papers", path: "/save-papers" },
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
      { path: "/", element: <Home /> },
      { path: "login", element: <h1>Login</h1> },
      { path: "register", element: <h1>Register</h1> },

      {
        path: "history",
        element: <History />
      },
      {
        path: "save-papers",
        element: <Save />,
      },
      {
        path: "profile",
        element: <>Profile</>,
      },
      {
        path: "poster",
        element: <>Poster Creation</>,
      },
      {
        path: "citation",
        element: <>Citation Evaluation</>,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
