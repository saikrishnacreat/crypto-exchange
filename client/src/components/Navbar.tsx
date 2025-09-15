'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  // Don't show the navbar on the login/register page
  if (pathname === '/') return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-md w-full p-4 mb-8 flex justify-between items-center">
      <div className="flex gap-6">
        <Link href="/dashboard" className="text-lg font-semibold hover:text-blue-600">Dashboard</Link>
        <Link href="/spot" className="text-lg font-semibold hover:text-blue-600">Spot</Link>
        <Link href="/p2p" className="text-lg font-semibold hover:text-blue-600">P2P</Link>
      </div>
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg">
        Logout
      </button>
    </nav>
  );
}