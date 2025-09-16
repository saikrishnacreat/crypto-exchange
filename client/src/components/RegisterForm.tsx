'use client';

import React, { useState } from 'react';

export default function RegisterForm() {
  const [name, setName] = useState('');
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

    // Basic frontend validation
    if (!name || !email || !password) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      // const data = await res.json();

      const responseText = await res.text();
      console.log("Raw Server Response:", responseText);

      // Now parse the text
      const data = JSON.parse(responseText);

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
      } else {
        setSuccess('Registration successful! You can now log in.');
        // Clear the form on success
        setName('');
        setEmail('');
        setPassword('');
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
        Create Your Account
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      {error && (
        <p className="mt-4 text-center text-red-500">{error}</p>
      )}
      {success && (
        <p className="mt-4 text-center text-green-500">{success}</p>
      )}
    </div>
  );
}