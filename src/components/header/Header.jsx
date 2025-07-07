import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Button } from "../ui/button";
import { logout, isAuthenticated, getProfile } from "../../services/authService";
import Swal from "sweetalert2";

const Header = ({ logo, navigationItems = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitial, setUserInitial] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        setIsLoggedIn(true);
        try {
          const profile = await getProfile();
          setUserInitial(profile.user.name.charAt(0).toUpperCase());
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        }
      } else {
        setIsLoggedIn(false);
        setUserInitial("");
      }
    };
    checkAuth();
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
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, log me out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        setIsLoggedIn(false);
        Swal.fire({
          title: "Logged out",
          text: "You have been successfully logged out.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/login");
        });
      }
    });
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <header className="w-full bg-white border-b fixed top-0 left-0 z-50" style={{ borderColor: "#E5E8EB" }}>
      <div className="sm:px-7">
        {/* Font Controls */}
        <div className="flex justify-end items-center py-1 border-b border-gray-200">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-700 font-medium">Font Size:</span>
            <button onClick={increaseFont} className="text-[18px] px-2 text-blue-700 hover:text-blue-900 font-bold">A+</button>
            <button onClick={decreaseFont} className="px-1 text-blue-700 hover:text-blue-900 font-bold">A−</button>
          </div>
        </div>

        {/* Navigation */}
        <div className="lg:py-1">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                {logo ? (
                  typeof logo === "string" ? (
                    <img src={logo} alt="Logo" className="h-12 w-12 rounded-full" />
                  ) : logo
                ) : (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-900 text-white">
                    <span className="text-xl font-bold">I</span>
                  </div>
                )}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 relative">
              <div ref={navRef} className="flex items-center space-x-6 xl:space-x-8">
                {navigationItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className="text-sm font-medium py-2 px-3 rounded-lg transition-all"
                    style={{
                      color: location.pathname === item.path ? "#1e3b8a" : "#6b7280",
                      backgroundColor: location.pathname === item.path ? "#c2dcff" : "transparent",
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Account Section */}
            {isLoggedIn ? (
              <div className="relative">
                <div
                  onClick={toggleDropdown}
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
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button
                onClick={handleSignIn}
                className="text-sm font-medium py-2 bg-[#1341F8] hover:bg-[#1e3b8a]"
                style={{ color: "white" }}
              >
                Sign In
              </Button>
            )}

            {/* Mobile menu button */}
            <button onClick={toggleMobileMenu} className="lg:hidden p-2 text-gray-600 hover:text-blue-800">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4 pt-4">
                {navigationItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-medium px-3 py-2 rounded-lg"
                    style={{
                      color: location.pathname === item.path ? "#1e3b8a" : "#6b7280",
                      backgroundColor:
                        location.pathname === item.path ? "rgba(60, 131, 246, 0.15)" : "transparent",
                    }}
                  >
                    {item.label}
                  </Link>
                ))}

                {!isLoggedIn ? (
                  <button
                    onClick={() => {
                      handleSignIn();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium px-3 py-2 text-left"
                    style={{ color: "#6b7280" }}
                  >
                    Sign In / Sign Up
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-sm font-medium px-3 py-2 text-left"
                      style={{ color: "#6b7280" }}
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-sm font-medium px-3 py-2 text-left text-red-600"
                    >
                      Logout
                    </button>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;