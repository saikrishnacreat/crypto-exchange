'use client';

import { useState } from 'react';

export default function SendForm() {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('ETH'); // Default to ETH
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:3001/api/transactions/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        // Send the selected currency to the backend
        body: JSON.stringify({ recipientAddress: address, amount, currency }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Send failed.');
      }

      setMessage(`Success! Tx Hash: ${data.txHash}`);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-semibold mb-4">Send Crypto</h2>
      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-4 py-2 text-gray-900 bg-gray-100 border rounded-lg"
          >
            <option value="ETH">ETH</option>
            <option value="USDC">USDC (Test)</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Recipient Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 text-gray-900 bg-gray-100 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 text-gray-900 bg-gray-100 border rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 font-semibold text-white bg-indigo-600 rounded-lg"
        >
          {isLoading ? 'Processing...' : 'Send'}
        </button>
        {message && <p className="mt-4 text-center text-sm break-all">{message}</p>}
      </form>
    </div>
  );
}