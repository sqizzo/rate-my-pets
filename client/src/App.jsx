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
  Send,
  Bookmark,
  Smile,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LeftSidebar from "./components/sidebar";
import Feed from "./components/Feed";
import RightSidebar from "./components/RightSidebar";
import Login from "./components/Login";
import Register from "./components/Register";

// Mock Data for the application

const suggestionsData = [
  {
    id: 1,
    user: "indieaprimet",
    followedBy: "anqqiwei + 14 more",
    avatar: "https://placehold.co/48x48/5DADE2/000000?text=I",
  },
  {
    id: 2,
    user: "giggis.du",
    followedBy: "khairun + 18 more",
    avatar: "https://placehold.co/48x48/48C9B0/000000?text=G",
  },
  {
    id: 3,
    user: "ingridhuiberkl",
    followedBy: "kenzie + 9 more",
    avatar: "https://placehold.co/48x48/AF7AC5/FFFFFF?text=IH",
  },
  {
    id: 4,
    user: "cimitao",
    followedBy: "vinacikus + 3 more",
    avatar: "https://placehold.co/48x48/F7DC6F/000000?text=C",
  },
  {
    id: 5,
    user: "muhayu",
    followedBy: "yudhayst + 24 more",
    avatar: "https://placehold.co/48x48/F0B27A/000000?text=M",
  },
];

// Main App Component
export default function App() {
  const [auth, setAuth] = useState(() => {
    // Optionally, load from localStorage for persistence
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : null;
  });
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (data) => {
    setAuth(data);
    localStorage.setItem("auth", JSON.stringify(data));
  };

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
  };

  // After successful registration, switch to login
  const handleRegister = () => {
    setShowRegister(false);
  };

  if (!auth) {
    if (showRegister) {
      return (
        <Register
          onRegister={handleRegister}
          onShowLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <Login
        onLogin={handleLogin}
        onShowRegister={() => setShowRegister(true)}
      />
    );
  }

  return (
    <div className="flex bg-white text-white min-h-screen font-sans">
      <div className="w-[220px]">
        <LeftSidebar user={auth} onLogout={handleLogout} />
      </div>
      <div className="flex justify-center flex-1">
        <div className="w-[600px]">
          <Feed user={auth} />
        </div>
        <div className="w-[320px]">
          <RightSidebar suggestionsData={suggestionsData} user={auth} />
        </div>
      </div>
    </div>
  );
}
