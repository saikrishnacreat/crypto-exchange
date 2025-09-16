'use client';

import AdminUsers from '@/components/AdminUsers';
import withAuth from '@/utils/withAuth';

function AdminUsersPage() {
  return (
    <div className="flex flex-col items-center p-8 bg-gray-100">
      <AdminUsers />
    </div>
  );
}

export default withAuth(AdminUsersPage);