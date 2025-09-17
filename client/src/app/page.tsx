'use client';

import React, { useState } from 'react'; // Corrected import
import RegisterForm from '@/components/RegisterForm';
import LoginForm from '@/components/LoginForm';

export default function Home() {
  // State to track which form to show. True for login, false for register.
  const [showLogin, setShowLogin] = useState(true);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-md">

           
        {/* --- Add this branding section --- */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Crypto-Exchange</h1>
          <p className="text-gray-600">Your Fast & Secure Crypto Exchange</p>
        </div>
        {/* --------------------------------- */}

        {/* Conditionally render the selected form */}
        {showLogin ? <LoginForm /> : <RegisterForm />}

        {/* Toggle button/link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          {showLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => setShowLogin(!showLogin)}
            className="ml-2 font-semibold text-blue-600 hover:text-blue-500"
          >
            {showLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </main>
  );
}