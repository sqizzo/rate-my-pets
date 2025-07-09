import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import NavBar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Feed from "./components/Feed";
import PostForm from "./components/PostForm";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import NotFound from "./components/NotFound";

function App() {
  // State untuk menyimpan informasi user dan loading
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false); // State modal PostForm

  // Cek apakah ada token di localStorage saat aplikasi dimuat
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Redirect ke '/' jika user sudah login dan akses /login
  function LoginRedirector() {
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
      if (user && location.pathname === '/login') {
        navigate('/');
      }
    }, [user, location, navigate]);
    return null;
  }

  // Fungsi onLogin yang menangani login dan menyimpan data user
  const handleLogin = (userData) => {
    // Simpan token dan data user ke localStorage
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // Fungsi untuk logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Fungsi untuk refresh feed setelah post baru
  const handlePostCreated = () => {
    setShowPostForm(false);
    // Bisa tambahkan trigger refresh feed jika perlu
  };

  // Fungsi untuk menampilkan forgot password
  const handleShowForgotPassword = () => {
    // Navigate to forgot password page instead of showing modal
    window.location.href = '/forgot-password';
  };

  // Fungsi untuk kembali ke login dari forgot password
  const handleBackToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <Router>
      <LoginRedirector />
      {user && <NavBar user={user} onLogout={handleLogout} onOpenPostForm={() => setShowPostForm(true)} />}
      <Routes>
        <Route path="/" element={user ? <Feed /> : <Login onLogin={handleLogin} loading={loading} onShowForgotPassword={handleShowForgotPassword} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} loading={loading} onShowForgotPassword={handleShowForgotPassword} />} />
        <Route path="/register" element={<Register onRegister={handleLogin} loading={loading} />} />
        <Route path="/forgot-password" element={<ForgotPassword onBackToLogin={handleBackToLogin} />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showPostForm && (
        <PostForm
          onPostCreated={handlePostCreated}
          onClose={() => setShowPostForm(false)}
        />
      )}
    </Router>
  );
}

export default App;
