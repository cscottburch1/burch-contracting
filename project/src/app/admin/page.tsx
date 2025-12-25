'use client';

import { useState } from 'react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Temporary simple check (replace with real auth later)
    if (password === 'tempadmin123') {  // Change this!
      alert('Login successful! (Next: Add real session/auth)');
      // Later: Set cookie or redirect to dashboard
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            required
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          This is a starter — we'll secure it properly next.
        </p>
      </div>
    </div>
  );
}

