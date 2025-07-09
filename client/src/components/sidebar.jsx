import React, { useState } from "react";
import {
  Home,
  Search,
  Compass,
  Clapperboard,
  MessageCircle,
  Heart,
  PlusSquare,
  UserCircle,
  MoreHorizontal,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const NavItem = ({ icon, text, to, active, onClick }) => {
  const content = (
    <div className="flex items-center p-3 space-x-4 hover:bg-gray-200 rounded-lg">
      {React.cloneElement(icon, { size: 28, strokeWidth: active ? 2.5 : 2 })}
      <span
        className={`text-base hidden xl:inline ${
          active ? "font-bold" : "font-normal"
        }`}
      >
        {text}
      </span>
    </div>
  );

  return (
    <li className="cursor-pointer" onClick={onClick}>
      {to ? <Link to={to}>{content}</Link> : content}
    </li>
  );
};

const LeftSidebar = ({ user, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { icon: <Home />, text: "Home", to: "/", active: true },
    { icon: <PlusSquare />, text: "Create", to: "/add-post" },
    // You can add more items here
  ];

  const sidebarContent = (
    <>
      <div className="p-3 mb-4">
        <h1 className="text-2xl font-serif hidden xl:block">RateMyPets</h1>
        <h1 className="text-2xl font-serif xl:hidden">I</h1>
      </div>

      <nav className="flex-grow">
        <ul>
          {navItems.map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              text={item.text}
              to={item.to}
              active={item.active}
            />
          ))}
        </ul>
      </nav>

      <div className="mb-2">
        {user && (
          <div className="text-xs text-gray-500 mb-2 px-3 hidden xl:block">
            Logged in as <span className="font-bold">{user.username}</span>
          </div>
        )}
        <ul>
          <NavItem icon={<LogOut />} text="Logout" onClick={onLogout} />
        </ul>
      </div>
    </>
  );

  return (
    <>
      {/* Hamburger menu for mobile */}
      <button
        className="xl:hidden fixed top-4 left-4 z-50 bg-white rounded-full p-2 shadow-md border border-gray-200"
        onClick={() => setMobileOpen((open) => !open)}
        aria-label="Open sidebar menu"
      >
        {mobileOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Desktop Sidebar */}
      <aside className="w-[72px] xl:w-[334px] h-screen fixed top-0 left-0 bg-white text-black p-3 flex flex-col border-r border-gray-300 z-40 hidden sm:flex">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex sm:hidden">
          <div className="w-64 bg-white text-black p-3 flex flex-col border-r border-gray-300 h-full shadow-lg animate-slide-in-left">
            {sidebarContent}
          </div>
          <div
            className="flex-1 bg-black bg-opacity-30"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default LeftSidebar;
