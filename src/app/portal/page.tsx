'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Portal() {
  const [email, setEmail] = useState('');

  const sendLink = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (!error) alert('Magic link sent! Check your email.');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6">Customer Portal</h1>
        <form onSubmit={sendLink} className="space-y-4">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 border rounded-lg"
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium">
            Send Magic Login Link
          </button>
        </form>
      </div>
    </div>
  );
}