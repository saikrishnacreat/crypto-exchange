'use client';

import { useEffect, useState } from 'react';

// Define a type for our user data for better type safety
interface UserData {
  user: { name: string; email: string };
  wallets: { currency: string; balance: string; depositAddress: string }[];
}

export default function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in again.');
        return;
      }

      try {
        const res = await fetch('http://localhost:3001/api/user/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // <-- Send the token
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch user data.');
        }

        const data: UserData = await res.json();
        setUserData(data);

      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchData();
  }, []); // The empty array ensures this runs only once when the component mounts

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  if (!userData) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Welcome, {userData.user.name}!</h1>
      <p className="text-gray-600 mb-6">{userData.user.email}</p>
      
      <div className="border-t pt-6">
        <h2 className="text-2xl font-semibold mb-4">Your Wallets</h2>
        {userData.wallets.map((wallet) => (
          <div key={wallet.depositAddress} className="mb-4 p-4 border rounded-lg bg-gray-50">
            <p><strong>Currency:</strong> {wallet.currency}</p>
            <p><strong>Balance:</strong> {wallet.balance}</p>
            <p className="text-sm text-gray-500 break-all">
              <strong>Deposit Address:</strong> {wallet.depositAddress}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}