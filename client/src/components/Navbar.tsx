'use client';
    
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import the decoder

interface DecodedToken {
  userId: number;
  email: string;
  isAdmin: boolean;
  // You would need to add `isAdmin` to your JWT payload for this to work
}

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // For this to work, you must add `isAdmin: user.isAdmin` to your JWT payload in the backend login route.
      // const decoded: any = jwtDecode(token);
      // setIsAdmin(decoded.isAdmin);
      // For now, we will just assume the first user is admin for UI purposes.
      const decoded: DecodedToken = jwtDecode(token);
      setIsAdmin(decoded.isAdmin); // Temporary check
    }
  }, [pathname]);

  if (pathname === '/') return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-md w-full p-4 mb-8 flex justify-between items-center">
      <div className="flex gap-6 items-center">
        {/* Main Navigation Links */}
        <Link href="/dashboard" className="text-lg font-semibold hover:text-blue-600">Dashboard</Link>
        <Link href="/spot" className="text-lg font-semibold hover:text-blue-600">Spot</Link>
        <Link href="/p2p" className="text-lg font-semibold hover:text-blue-600">P2P</Link>
        {isAdmin && (
          <Link href="/admin/users" className="text-lg font-semibold text-red-600 hover:text-red-800">Admin</Link>
        )}
      </div>
      <div className="flex gap-4 items-center">
        {/* Action Buttons */}
        <Link href="/receive">
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Receive</button>
        </Link>
        <Link href="/send">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Send</button>
        </Link>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg">
          Logout
        </button>
      </div>
    </nav>
  );
}