import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import {
  logout,
  isAuthenticated,
  getProfile,
} from "../../services/authService";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { confirmDialog } from "primereact/confirmdialog";

const Header = ({ logo, navigationItems = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useRef(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitial, setUserInitial] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated();
      console.log("Auth status:", auth);
      if (auth) {
        setIsLoggedIn(true);
        try {
          const profile = await getProfile();
          console.log("Profile:", profile);
          setUserInitial(profile.user.name?.charAt(0).toUpperCase() || "U");
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        }
      } else {
        setIsLoggedIn(false);
        setUserInitial("");
      }
    };
    checkAuth();
    const now = new Date();
    const formattedDate = now.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formattedDate);

    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("authChange", checkAuth);
    };
  }, [location.pathname]);
  const increaseFont = () => {
    const newSize = Math.min(fontSize + 10, 150);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
  };

  const decreaseFont = () => {
    const newSize = Math.max(fontSize - 10, 80);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
  };

  const handleSignIn = () => navigate("/login");

  const handleLogout = () => {
    confirmDialog({
      message: "You will be logged out of your account.",
      header: "Are you sure?",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      acceptLabel: "Yes, log me out",
      rejectLabel: "Cancel",
      accept: () => {
        logout();
        setIsLoggedIn(false);
        toast.current.show({
          severity: "success",
          summary: "Logged out",
          detail: "You have been successfully logged out.",
          life: 3000,
        });
        navigate("/login");
      },
    });
  };

  return (
    <>
      <Toast ref={toast} position="top-right" />
      <ConfirmDialog />

      <header className="w-full bg-white  fixed top-0 left-0 z-50">
        <div className="sm:px-7">
          {/* Font Controls */}
          <div className="flex justify-between items-center py-1 border-b border-gray-200 text-sm px-4">

            <div className="text-gray-600">{currentDate}</div>


            <div className="flex items-center space-x-2">
              <span className="text-gray-700 font-medium">Font Size:</span>
              <button
                onClick={increaseFont}
                className="text-[18px] px-2 text-blue-800 hover:text-blue-900 font-bold hover:cursor-pointer hover:bg-gray-200 rounded-2xl"
              >
                A+
              </button>
              <button
                onClick={decreaseFont}
                className="px-1 text-blue-800 hover:text-blue-900 font-bold hover:cursor-pointer hover:bg-gray-200 rounded-2xl"
              >
                A−
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="">
            <div className="flex items-center justify-between m-1 ">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link to="/landing" className="flex items-center">
                  {logo ? (
                    typeof logo === "string" ? (
                      <img
                        src={logo}
                        alt="Logo"
                        className="h-12 w-12  rounded-2xl"
                      />
                    ) : (
                      logo
                    )
                  ) : (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-900 text-white">
                      <span className="text-xl font-bold">I</span>
                    </div>
                  )}
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                {navigationItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className={`text-sm font-medium py-2 px-3 rounded-lg transition-all ${
                      location.pathname === item.path
                        ? "text-blue-900 bg-blue-100"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Right Section */}
              <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                  <div className="relative hidden lg:block">
                    <div
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="w-10 h-10 rounded-full bg-blue-800 text-white flex items-center justify-center cursor-pointer hover:bg-blue-900"
                    >
                      {userInitial || "U"}
                    </div>
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2 z-50">
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => {
                            setDropdownOpen(false);
                            navigate("/profile");
                          }}
                        >
                          Profile
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          onClick={() => {
                            setDropdownOpen(false);
                            handleLogout();
                          }}
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    onClick={handleSignIn}
                    className="text-sm font-medium py-2 bg-[#1341F8] hover:bg-[#1e3b8a] text-white"
                  >
                    Sign In
                  </Button>
                )}

                {/* Mobile menu toggle */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-3 text-gray-600 hover:text-blue-800"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {isMobileMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <div className="lg:hidden mt-2 border-t border-gray-200 pt-4 pb-4 space-y-3">
                {navigationItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block text-sm font-medium px-4 py-2 rounded ${
                      location.pathname === item.path
                        ? "text-blue-900 bg-blue-100"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="border-t pt-4 mt-2">
                  {isLoggedIn ? (
                    <>
                      <div className="flex items-center gap-3 px-4 mb-2">
                        <div className="w-9 h-9 rounded-full bg-blue-800 text-white flex items-center justify-center text-sm font-semibold">
                          {userInitial}
                        </div>
                        <div className="text-sm font-medium text-gray-800">
                          My Account
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-left text-sm px-4 py-2 hover:bg-gray-100"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-left text-sm px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        handleSignIn();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left text-sm px-4 py-2 hover:bg-gray-100 text-gray-700"
                    >
                      Sign In / Sign Up
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
