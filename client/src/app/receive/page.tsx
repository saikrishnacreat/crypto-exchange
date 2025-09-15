'use client';
import { useEffect, useState } from 'react';
import withAuth from '@/utils/withAuth';
import { QRCodeSVG } from 'qrcode.react';

function ReceivePage() {
  const [address, setAddress] = useState('');

  useEffect(() => {
    // This is a simplified way to get the address.
    // In a real app with multiple wallets, this logic would be more complex.
    const token = localStorage.getItem('token');
    fetch('http://localhost:3001/api/user/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.wallets && data.wallets.length > 0) {
        setAddress(data.wallets[0].depositAddress);
      }
    });
  }, []);

  return (
    <div className="flex flex-col items-center p-8">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Receive ETH</h1>
        {address ? (
          <>
            <QRCodeSVG value={address} size={256} className="mx-auto mb-4" />
            <p className="text-sm text-gray-600 break-all">{address}</p>
          </>
        ) : <p>Loading address...</p>}
      </div>
    </div>
  );
}

export default withAuth(ReceivePage);