// Router.jsx
import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useLocation,
  Link,
} from "react-router-dom";

import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import History from "../pages/History";
import Save from "../pages/Save";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Citation from "../pages/Citation";
import LandingPage from "../pages/LandingPage";
import { getValidToken } from "../services/tokenService";

import {
  Dashboard,
  UserManagement,
  Settings,
  AdminProtectedRoute,
} from "../admin";

import {
  Home as HomeIcon,
  Search as SearchIcon,
  Clock as ClockIcon,
  Bookmark as BookmarkIcon,
  FileText as FileTextIcon,
  Info as InfoIcon,
  Mail as MailIcon,
  File as FileIcon,
  Shield as ShieldIcon,
} from "lucide-react";

const ProtectedRoute = () => {
  const location = useLocation();
  const token = getValidToken();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

function Layout() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!getValidToken());

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const navigationList = [
    {
      label: "Home",
      path: "/",
      icon: <HomeIcon className="inline-block w-5 h-5 mr-1" />,
    },
    {
      label: "Search",
      path: "/search",
      icon: <SearchIcon className="inline-block w-5 h-5 mr-1" />,
    },
    ...(isLoggedIn
      ? [
          {
            label: "History",
            path: "/history",
            icon: <ClockIcon className="inline-block w-5 h-5 mr-1" />,
          },
        ]
      : []),
    ...(isLoggedIn
      ? [
          {
            label: "Bookmarks",
            path: "/bookmarks",
            icon: <BookmarkIcon className="inline-block w-5 h-5 mr-1" />,
          },
        ]
      : []),
    {
      label: "Citation Evaluation",
      path: "/citation",
      icon: <FileTextIcon className="inline-block w-5 h-5 mr-1" />,
    },
  ];

  const footerNavigation = [
    {
      label: "About",
      path: "/",
      icon: <InfoIcon className="inline-block w-5 h-5 mr-1" />,
    },
    {
      label: "Contact",
      path: "/",
      icon: <MailIcon className="inline-block w-5 h-5 mr-1" />,
    },
    {
      label: "Terms of Service",
      path: "/",
      icon: <FileIcon className="inline-block w-5 h-5 mr-1" />,
    },
    {
      label: "Privacy Policy",
      path: "/",
      icon: <ShieldIcon className="inline-block w-5 h-5 mr-1" />,
    },
  ];

  return (
    <>
      <Header logo={"/logo.png"} navigationItems={navigationList} />
      <Outlet />
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
      { path: "search", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "citation", element: <Citation /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "history", element: <History /> },
          { path: "bookmarks", element: <Save /> },
          { path: "profile", element: <Profile /> },
          { path: "poster", element: <h1>Poster Creation</h1> },
        ],
      },
      { path: "/", element: <LandingPage /> },
    ],
  },
  {
    path: "/admin",
    children: [
      {
        path: "dashboard",
        element: (
          <AdminProtectedRoute>
            <Dashboard />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <AdminProtectedRoute>
            <UserManagement />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <AdminProtectedRoute>
            <Settings />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "",
        element: (
          <AdminProtectedRoute>
            <Dashboard />
          </AdminProtectedRoute>
        ),
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}