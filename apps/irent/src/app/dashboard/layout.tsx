'use client';

import DashboardSidebar from '@/components/DashboardSidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Mock user check - in production, this would check Supabase session
    setUser({ email: 'owner@example.com' });
    setLoading(false);
  }, [router]);

  const handleLogout = async () => {
    // Mock logout
    router.push('/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200">
          <div className="px-8 py-4 flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            <div className="flex gap-4 items-center">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

