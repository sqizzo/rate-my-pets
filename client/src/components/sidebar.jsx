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
} from "lucide-react";

const NavItem = ({ icon, text, active }) => (
  <li className="flex items-center p-3 space-x-4 cursor-pointer hover:bg-gray-200 rounded-lg">
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

const LeftSidebar = () => {
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
    <aside className="w-[72px] xl:w-[244px] h-screen fixed top-0 left-0 bg-white text-black p-3 flex flex-col border-r border-gray-700">
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
      <div>
        <NavItem icon={<MoreHorizontal />} text="More" />
      </div>
    </aside>
  );
};

export default LeftSidebar;
