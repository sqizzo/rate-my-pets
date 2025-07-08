import React, { useState } from "react";

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
    <form
      onSubmit={handleSubmit}
      className="max-w-xs mx-auto mt-10 p-4 border rounded"
    >
      <h2 className="text-lg text-center font-bold mb-4">RateMyPets</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <input
        className="block w-full mb-2 p-2 border rounded"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="block w-full mb-2 p-2 border rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        className="w-full bg-blue-500 text-white p-2 rounded-2xl"
        type="submit"
      >
        Login
      </button>
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
  );
}
