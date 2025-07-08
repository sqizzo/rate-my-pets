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
  Send,
  Bookmark,
  Smile,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LeftSidebar from "./components/sidebar";
import Feed from "./components/Feed";
import RightSidebar from "./components/RightSidebar";

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
  return (
    <div className="flex bg-white text-white min-h-screen font-sans">
      <div className="w-[220px]">
        <LeftSidebar />
      </div>
      <div className="flex justify-center flex-1">
        <div className="w-[600px]">
          <Feed />
        </div>
        <div className="w-[320px]">
          <RightSidebar suggestionsData={suggestionsData} />
        </div>
      </div>
    </div>
  );
}
