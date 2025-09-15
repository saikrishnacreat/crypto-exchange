'use client';
import withAuth from '@/utils/withAuth';
import WithdrawForm from '@/components/SendForm';

function SendPage() {
  return (
    <div className="flex flex-col items-center p-8">
      <WithdrawForm />
    </div>
  );
}

export default withAuth(SendPage);