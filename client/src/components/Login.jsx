import React, { useState } from "react";
import logo from "../assets/logo.png";
import cats from "../assets/cats.png";

export default function Login({ onLogin, onShowRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:3005/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data); // Pass token/user info up
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="flex flex-row items-center justify-center min-h-screen min-w-screen">
      <div className="mr-8">
        <img src={cats} alt="cats" className="w-100 h-100 object-contain" />
      </div>
      <div>
        <form
          onSubmit={handleSubmit}
          className="w-100 h-120 mx-auto mt-10 p-4 border rounded border-gray-300"
        >
          <img
            src={logo}
            alt="logo"
            className="w-48 h-24 mx-auto mb-4 object-contain"
          />
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <input
            className="block w-full mb-2 p-2 border rounded border-gray-300"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="block w-full mb-2 p-2 border rounded border-gray-300"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="w-full bg-blue-500 text-white p-2 rounded-xl"
            type="submit"
          >
            Login
          </button>
          <div className="flex flex-row items-center justify-center my-5">
            <div className="w-1/2 h-px bg-gray-300" />
            <span className="text-gray-500 mx-2">OR</span>
            <div className="w-1/2 h-px bg-gray-300" />
          </div>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-blue-600 underline hover:text-blue-800"
              onClick={onShowRegister}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
