'use client';

import { useState, useEffect } from 'react';

// Define a type for our offer data
interface Offer {
  id: number;
  offerType: string;
  asset: string;
  amount: string;
  price: string;
  seller: { name: string };
}

export default function P2PTrading() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offerType] = useState('SELL');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  // Fetch offers when the component mounts
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/p2p/offers`);
        const data = await res.json();
        setOffers(data);
      } catch (err) {
        console.error("Failed to fetch offers:", err);
      }
    };
    fetchOffers();
  }, []);

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/p2p/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ offerType, asset: 'ETH', amount, price }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create offer.');
      }
      
      // Refresh the offers list after creating a new one
      const offersRes = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/p2p/offers');
      const updatedOffers = await offersRes.json();
      setOffers(updatedOffers);
      setAmount('');
      setPrice('');

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">P2P Trading</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Offer Form */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Create an Offer</h2>
          <form onSubmit={handleCreateOffer} className="space-y-4">
            
            {/* --- ADD THESE FORM FIELDS --- */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Amount (ETH)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 text-gray-900 bg-gray-100 border rounded-lg"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Price per ETH (USD)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 text-gray-900 bg-gray-100 border rounded-lg"
                placeholder="0.00"
                required
              />
            </div>
            {/* ----------------------------- */}

            <button type="submit" className="w-full py-2 px-4 font-semibold text-white bg-blue-600 rounded-lg">
              Create Offer
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        </div>
        
        {/* List of Open Offers */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Open Offers</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {offers.length > 0 ? offers.map((offer) => (
              <div key={offer.id} className="p-3 border rounded-lg bg-gray-50">
                <p className="font-bold">{offer.offerType === 'SELL' ? 'Selling' : 'Buying'} {offer.amount} ETH</p>
                <p>Price: ${offer.price} per ETH</p>
                <p className="text-sm text-gray-500">Seller: {offer.seller.name}</p>
              </div>
            )) : <p className="text-gray-500">No open offers yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}