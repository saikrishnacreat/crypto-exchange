'use client';

import SpotTrading from '@/components/SpotTrading';
import withAuth from '@/utils/withAuth';

function SpotPage() {
  return (
    <div className="flex min-h-screen flex-col items-center p-8 bg-gray-100">
      <SpotTrading />
    </div>
  );
}

export default withAuth(SpotPage);