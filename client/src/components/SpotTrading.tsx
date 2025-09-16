'use client';

import { useState, useEffect } from 'react';

export default function SpotTrading() {
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [ethAmount, setEthAmount] = useState('');
  const [usdAmount, setUsdAmount] = useState('');

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/prices/eth-usd`);
        const data = await res.json();
        setEthPrice(parseFloat(data.price));
      } catch (error) {
        console.error('Failed to fetch ETH price:', error);
      }
    };
    fetchPrice();
  }, []);

  const handleEthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;
    setEthAmount(amount);
    if (ethPrice && amount) {
      setUsdAmount((parseFloat(amount) * ethPrice).toFixed(2));
    } else {
      setUsdAmount('');
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-900">Spot Trade: ETH/USD</h2>
      <div className="text-center font-semibold text-lg">
        Current Price: {ethPrice ? `$${ethPrice.toFixed(2)}` : 'Loading...'}
      </div>
      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">You sell (ETH)</label>
          <input
            type="number"
            value={ethAmount}
            onChange={handleEthChange}
            className="w-full px-4 py-2 text-gray-900 bg-gray-100 border rounded-lg"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">You receive (USD)</label>
          <input
            type="number"
            value={usdAmount}
            readOnly
            className="w-full px-4 py-2 text-gray-900 bg-gray-200 border rounded-lg"
            placeholder="0.00"
          />
        </div>
        <button className="w-full py-2 px-4 font-semibold text-white bg-red-600 rounded-lg">
          Sell ETH
        </button>
      </div>
    </div>
  );
}