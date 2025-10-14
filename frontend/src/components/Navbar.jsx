import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  UserCircle,
  Briefcase,
  LogOut,
  LogIn,
  UserPlus,
  ShoppingBag,
  Mail,
  Home,
  List,
  Search,
  Shield,
} from "lucide-react";
import useAuthStore from "../store/authStore";

const Navbar = ({ navigate, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { isAuthenticated, userInfo, logout } = useAuthStore();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileDropdown = () =>
    setIsProfileDropdownOpen(!isProfileDropdownOpen);

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    navigate("home");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", path: "home", icon: <Home className="h-5 w-5" /> },
    { name: "Browse Gigs", path: "gigs", icon: <Search className="h-5 w-5" /> },
  ];

  const commonMobileLinks = [
    { name: "Home", path: "home", icon: <Home className="mr-3 h-5 w-5" /> },
    {
      name: "Browse Gigs",
      path: "gigs",
      icon: <Search className="mr-3 h-5 w-5" />,
    },
  ];

  const authenticatedMobileLinks = [
    {
      name: "My Profile",
      path: "profile",
      icon: <UserCircle className="mr-3 h-5 w-5" />,
    },
    {
      name: "My Orders",
      path: "myOrders",
      icon: <ShoppingBag className="mr-3 h-5 w-5" />,
    },
  ];

  const sellerMobileLinks = [
    {
      name: "Manage Gigs",
      path: "manageGigs",
      icon: <Briefcase className="mr-3 h-5 w-5" />,
    },
    {
      name: "Selling Orders",
      path: "sellerOrders",
      icon: <List className="mr-3 h-5 w-5" />,
    },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => navigate("home")}
              className="flex-shrink-0 cursor-pointer flex items-center group"
              aria-label="Go to Homepage"
            >
              <ShoppingBag className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-400 group-hover:animate-pulse" />
              <span className="ml-2 sm:ml-3 text-xl sm:text-2xl font-bold tracking-wider text-purple-600 group-hover:text-yellow-300 transition-colors">
                GigConnect
              </span>
            </button>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
              >
                {link.icon} <span className="ml-2">{link.name}</span>
              </button>
            ))}
            {isAuthenticated && userInfo?.role === "seller" && (
              <button
                onClick={() => navigate("manageGigs")}
                className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
              >
                <Briefcase className="h-5 w-5" />{" "}
                <span className="ml-2">Manage Gigs</span>
              </button>
            )}

            {isAuthenticated && userInfo?.role === "admin" && (
              <button
                onClick={() => navigate("admin")}
                className="text-gray-700 bg-yellow-100 hover:bg-yellow-200 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
              >
                <Shield className="h-5 w-5 mr-2 text-yellow-600" /> Admin Panel
              </button>
            )}
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  aria-expanded={isProfileDropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  {userInfo?.profilePicture ? (
                    <img
                      className="h-9 w-9 rounded-full object-cover border-2 border-purple-200 hover:border-purple-400 transition"
                      src={userInfo.profilePicture}
                      alt="User profile"
                    />
                  ) : (
                    <UserCircle className="h-9 w-9 text-gray-500 hover:text-purple-600 transition" />
                  )}
                  <span className="ml-2 text-gray-700 font-medium hidden sm:block">
                    {userInfo?.username || "User"}
                  </span>
                </button>
                {isProfileDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none py-1">
                    <div className="px-4 py-3">
                      <p className="text-sm text-gray-600">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {userInfo?.username}
                      </p>
                    </div>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={() => {
                        navigate("profile");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-purple-600 transition-colors"
                    >
                      <UserCircle className="mr-3 h-5 w-5 text-gray-500" /> My
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate("myOrders");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-purple-600 transition-colors"
                    >
                      <ShoppingBag className="mr-3 h-5 w-5 text-gray-500" /> My
                      Orders
                    </button>
                    {userInfo?.role === "seller" && (
                      <>
                        <button
                          onClick={() => {
                            navigate("manageGigs");
                            setIsProfileDropdownOpen(false);
                          }}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-purple-600 transition-colors"
                        >
                          <Briefcase className="mr-3 h-5 w-5 text-gray-500" />{" "}
                          Manage Gigs
                        </button>
                        <button
                          onClick={() => {
                            navigate("sellerOrders");
                            setIsProfileDropdownOpen(false);
                          }}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-purple-600 transition-colors"
                        >
                          <List className="mr-3 h-5 w-5 text-gray-500" />{" "}
                          Selling Orders
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        navigate("messages");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-purple-600 transition-colors"
                    >
                      <Mail className="mr-3 h-5 w-5 text-gray-500" /> Messages
                    </button>

                    {userInfo?.role === "admin" && (
                      <button
                        onClick={() => {
                          navigate("admin");
                          setIsProfileDropdownOpen(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-yellow-700 bg-yellow-50 hover:bg-yellow-100 transition-colors"
                      >
                        <Shield className="mr-3 h-5 w-5" /> Admin Panel
                      </button>
                    )}

                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      <LogOut className="mr-3 h-5 w-5" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate("login")}
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                >
                  <LogIn className="h-5 w-5" />{" "}
                  <span className="ml-2">Login</span>
                </button>
                <button
                  onClick={() => navigate("register")}
                  className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow hover:shadow-md flex items-center"
                >
                  <UserPlus className="h-5 w-5" />{" "}
                  <span className="ml-2">Sign Up</span>
                </button>
              </>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-purple-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white shadow-lg z-40 pb-3 space-y-1 sm:px-3">
          {commonMobileLinks.map((link) => (
            <button
              key={`mobile-${link.name}`}
              onClick={() => navigate(link.path)}
              className="w-full text-left flex items-center px-3 py-3 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors"
            >
              {link.icon} {link.name}
            </button>
          ))}
          {isAuthenticated ? (
            <>
              {authenticatedMobileLinks.map((link) => (
                <button
                  key={`mobile-auth-${link.name}`}
                  onClick={() => navigate(link.path)}
                  className="w-full text-left flex items-center px-3 py-3 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  {link.icon} {link.name}
                </button>
              ))}
              {userInfo?.role === "seller" &&
                sellerMobileLinks.map((link) => (
                  <button
                    key={`mobile-seller-${link.name}`}
                    onClick={() => navigate(link.path)}
                    className="w-full text-left flex items-center px-3 py-3 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    {link.icon} {link.name}
                  </button>
                ))}
              <button
                onClick={() => navigate("messages")}
                className="w-full text-left flex items-center px-3 py-3 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors"
              >
                <Mail className="mr-3 h-5 w-5" /> Messages
              </button>

              {userInfo?.role === "admin" && (
                <button
                  onClick={() => navigate("admin")}
                  className="w-full text-left flex items-center px-3 py-3 text-base font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 rounded-md transition-colors"
                >
                  <Shield className="mr-3 h-5 w-5" /> Admin Panel
                </button>
              )}

              <div className="border-t border-gray-200 pt-2 mt-2 mx-3">
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-3 py-3 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="mr-3 h-5 w-5" /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 space-y-1 border-t border-gray-200 mx-3">
              <button
                onClick={() => navigate("login")}
                className="w-full text-left flex items-center px-3 py-3 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors"
              >
                <LogIn className="mr-3 h-5 w-5" /> Login
              </button>
              <button
                onClick={() => navigate("register")}
                className="w-full text-left flex items-center px-3 py-3 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors"
              >
                <UserPlus className="mr-3 h-5 w-5" /> Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
