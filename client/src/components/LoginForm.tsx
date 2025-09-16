'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('process.env.NEXT_PUBLIC_API_URL/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed.');
      } else {
        setSuccess('Login successful!');
        // In a real app, you would save the token:
        localStorage.setItem('token', data.token);
        console.log('Received token:', data.token);
        router.push('/dashboard'); 
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
    
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-900">
        Login to Your Account
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="login-email"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label
            htmlFor="login-password"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-400"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      {success && <p className="mt-4 text-center text-green-500">{success}</p>}
    </div>
    
  );
  
}