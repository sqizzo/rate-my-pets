"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { HiHome, HiSearch, HiPlusCircle, HiLogout } from "react-icons/hi";

function NavBar({ user, onLogout, onOpenPostForm }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleCreatePost = () => {
    navigate('/');
    if (onOpenPostForm) onOpenPostForm();
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { icon: HiHome, label: "Home", href: "/" },
    { icon: HiPlusCircle, label: "Create", href: "#", onClick: handleCreatePost }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <div className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <img
          src={logo}
          alt="Logo"
          className="w-40"
        />
          </div>

          <div className="flex-1 py-4">
            {navItems.map((item, index) => (
              <div key={index}>
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className="flex items-center px-4 py-3 mx-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 w-full text-left"
                  >
                    <item.icon className="h-6 w-6 mr-3" />
                    <span className="text-base">{item.label}</span>
                  </button>
                ) : (
                  <Link
                    to={item.href}
                className="flex items-center px-4 py-3 mx-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <item.icon className="h-6 w-6 mr-3" />
                <span className="text-base">{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200">
            {user ? (
              <>
                <div className="flex items-center mb-3">
              <img 
                className="h-10 w-10 rounded-full object-cover" 
                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" 
                alt="User" 
              />
                  <span className="ml-3 text-gray-700 font-medium">{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <HiLogout className="h-5 w-5 mr-2" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center">
                <span className="text-gray-500">Not logged in</span>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Top Navbar */}
      <div className="lg:hidden">
        {/* Top Navigation Bar */}
        <div className="relative left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 ">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-800">RateMyPets</span>
            {user && (
            <div className="flex items-center">
              <img 
                  className="h-8 w-8 rounded-full object-cover mr-2" 
                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" 
                alt="User" 
              />
                <span className="text-sm text-gray-700 font-medium">{user.username}</span>
            </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation for Mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden z-50 shadow-lg">
          <div className="flex justify-around">
            {navItems.map((item, index) => (
              <div key={index}>
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className="flex flex-col items-center py-2 px-3 rounded-lg text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    <item.icon className="h-6 w-6 mb-1" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                ) : (
                  <Link
                    to={item.href}
                className="flex flex-col items-center py-2 px-3 rounded-lg text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <item.icon className="h-6 w-6 mb-1" />
                <span className="text-xs">{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
            {user && (
              <button
                onClick={handleLogout}
                className="flex flex-col items-center py-2 px-3 rounded-lg text-red-600 hover:text-red-700 transition-colors duration-200"
              >
                <HiLogout className="h-6 w-6 mb-1" />
                <span className="text-xs">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;