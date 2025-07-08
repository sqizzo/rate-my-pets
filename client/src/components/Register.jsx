import React, { useState } from "react";

export default function Register({ onRegister, onShowLogin }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3005/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Registration successful! You can now log in.");
        setEmail("");
        setUsername("");
        setPassword("");
        if (onRegister) onRegister(data);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xs mx-auto mt-10 p-4 border rounded"
    >
      <h2 className="text-lg font-bold mb-4">Register</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
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
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        className="block w-full mb-2 p-2 border rounded"
        type="password"
        placeholder="Password (min 8 chars)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={8}
        required
      />
      <button
        className="w-full bg-blue-500 text-white p-2 rounded"
        type="submit"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <button
          type="button"
          className="text-blue-600 underline hover:text-blue-800"
          onClick={onShowLogin}
        >
          Login
        </button>
      </div>
    </form>
  );
}
