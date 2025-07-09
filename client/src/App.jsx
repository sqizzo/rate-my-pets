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
import PostForm from "./components/PostForm";
import { Routes, Route, useNavigate } from "react-router-dom";

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
  const [postFormMode, setPostFormMode] = useState("add");
  const [postFormInitial, setPostFormInitial] = useState({});
  const [submittingPost, setSubmittingPost] = useState(false);
  const [refreshFeedFlag, setRefreshFeedFlag] = useState(0);
  const navigate = useNavigate();

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

  // Show add post modal
  const handleAddPost = () => {
    setPostFormMode("add");
    setPostFormInitial({});
    navigate("/add-post");
  };

  // Show edit post modal
  const handleEditPost = (post) => {
    setPostFormMode("edit");
    setPostFormInitial(post);
    navigate("/edit-post"); // You can add edit route if needed
  };

  // Handle add/edit post submit
  const handlePostFormSubmit = async (formData) => {
    setSubmittingPost(true);
    try {
      const url =
        postFormMode === "edit"
          ? `http://localhost:5000/api/posts/${postFormInitial._id}`
          : "http://localhost:5000/api/posts";
      const method = postFormMode === "edit" ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(auth?.token ? { Authorization: `Bearer ${auth.token}` } : {}),
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to save post");
        return;
      }
      navigate("/");
      setRefreshFeedFlag((f) => f + 1);
    } finally {
      setSubmittingPost(false);
    }
  };

  // Refresh feed after add/edit/delete
  const handleRefreshFeed = () => {
    setRefreshFeedFlag((f) => f + 1);
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
        <LeftSidebar
          user={auth}
          onLogout={handleLogout}
          onAddPost={handleAddPost}
        />
      </div>
      <div className="flex justify-center flex-1">
        <div className="w-[600px]">
          {/* Main content area with routes */}
          <Routes>
            <Route
              path="/"
              element={
                <Feed
                  user={auth}
                  refreshFlag={refreshFeedFlag}
                  onEditPost={handleEditPost}
                  onRefresh={handleRefreshFeed}
                />
              }
            />
            <Route
              path="/add-post"
              element={
                <PostForm
                  mode={postFormMode}
                  initialValues={postFormInitial}
                  onSubmit={handlePostFormSubmit}
                  onCancel={() => navigate("/")}
                  submitting={submittingPost}
                />
              }
            />
            {/* You can add an edit route here if you want */}
          </Routes>
        </div>
        <div className="w-[320px]">
          <RightSidebar suggestionsData={suggestionsData} user={auth} />
        </div>
      </div>
    </div>
  );
}
