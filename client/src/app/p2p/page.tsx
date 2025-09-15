'use client';

import P2PTrading from '@/components/P2PTrading';
import withAuth from '@/utils/withAuth';

function P2PPage() {
  return (
    <div className="flex min-h-screen flex-col items-center p-8 bg-gray-100">
      <P2PTrading />
    </div>
  );
}

export default withAuth(P2PPage);