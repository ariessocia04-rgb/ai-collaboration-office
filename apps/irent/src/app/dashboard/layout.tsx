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
    return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-50">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-900">
      <DashboardSidebar />
      <div className="flex-1">
        <header className="bg-slate-800 border-b border-slate-700/50 backdrop-blur-sm">
          <div className="px-8 py-5 flex justify-between items-center">
            <h1 className="text-lg font-semibold text-slate-50">Dashboard</h1>
            <div className="flex gap-6 items-center">
              <span className="text-sm text-slate-400">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-slate-300 hover:text-slate-50 hover:bg-slate-700/50 rounded-lg transition-colors"
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

