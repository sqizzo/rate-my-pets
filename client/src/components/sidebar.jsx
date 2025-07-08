import React from "react";
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
} from "lucide-react";

const NavItem = ({ icon, text, active, onClick }) => (
  <li
    className="flex items-center p-3 space-x-4 cursor-pointer hover:bg-gray-200 rounded-lg"
    onClick={onClick}
  >
    {React.cloneElement(icon, { size: 28, strokeWidth: active ? 2.5 : 2 })}
    <span
      className={`text-base hidden xl:inline ${
        active ? "font-bold" : "font-normal"
      }`}
    >
      {text}
    </span>
  </li>
);

const LeftSidebar = ({ user, onLogout }) => {
  const navItems = [
    { icon: <Home />, text: "Home", active: true },
    { icon: <Search />, text: "Search" },
    { icon: <Compass />, text: "Explore" },
    { icon: <Clapperboard />, text: "Reels" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    { icon: <UserCircle />, text: "Profile" },
  ];

  return (
    <aside className="w-[72px] xl:w-[334px] h-screen fixed top-0 left-0 bg-white text-black p-3 flex flex-col border-r border-gray-300">
      <div className="p-3 mb-4">
        <h1 className="text-2xl font-serif hidden xl:block">RateMyPets</h1>
        <h1 className="text-2xl font-serif xl:hidden">I</h1>
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item, index) => (
            <NavItem key={index} {...item} />
          ))}
        </ul>
      </nav>
      <div className="mb-2">
        {user && (
          <div className="text-xs text-gray-500 mb-2 px-3 hidden xl:block">
            Logged in as <span className="font-bold">{user.username}</span>
          </div>
        )}
        <NavItem icon={<LogOut />} text="Logout" onClick={onLogout} />
      </div>
    </aside>
  );
};

export default LeftSidebar;
