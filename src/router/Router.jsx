import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useLocation,
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

import {
  Dashboard,
  UserManagement,
  Settings,
  AdminProtectedRoute,
} from "../admin";

const ProtectedRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

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
    { label: "Home", path: "/" },
    ...(isLoggedIn ? [{ label: "Search", path: "/search" }] : []),
    ...(isLoggedIn ? [{ label: "History", path: "/history" }] : []),
    ...(isLoggedIn ? [{ label: "Bookmarks", path: "/bookmarks" }] : []),
    { label: "Citation Evaluation", path: "/citation" },
  ];

  const footerNavigation = [
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Terms of Service", path: "/terms" },
    { label: "Privacy Policy", path: "/privacy" },
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

// مكون رئيسي يحتوي على الرواتر
export default function Router() {
  return <RouterProvider router={router} />;
}
