'use client';

import withAuth from '@/utils/withAuth';
import Dashboard from '@/components/Dashboard';

function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-100">
      <Dashboard />
    </div>
  );
}

export default withAuth(DashboardPage);