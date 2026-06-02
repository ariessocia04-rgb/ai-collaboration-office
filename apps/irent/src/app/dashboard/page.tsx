'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    vacantRooms: 0,
    totalTenants: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch rooms count
        const { count: roomsCount } = await supabase
          .from('rooms')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', user.id);

        // Fetch occupied rooms
        const { count: occupiedCount } = await supabase
          .from('rooms')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', user.id)
          .eq('is_occupied', true);

        // Fetch tenants count
        const { count: tenantsCount } = await supabase
          .from('tenants')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', user.id)
          .eq('is_active', true);

        setStats({
          totalRooms: roomsCount || 0,
          occupiedRooms: occupiedCount || 0,
          vacantRooms: (roomsCount || 0) - (occupiedCount || 0),
          totalTenants: tenantsCount || 0,
        });
      } catch (error) {
        console.error('[v0] Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome to IRent</h1>
        <p className="text-gray-600 mt-2">Manage your rental property efficiently</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-500 text-sm font-medium">Total Rooms</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{stats.totalRooms}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-500 text-sm font-medium">Occupied Rooms</div>
          <div className="text-3xl font-bold text-green-600 mt-2">{stats.occupiedRooms}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-500 text-sm font-medium">Vacant Rooms</div>
          <div className="text-3xl font-bold text-orange-600 mt-2">{stats.vacantRooms}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-500 text-sm font-medium">Active Tenants</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">{stats.totalTenants}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/rooms"
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-colors text-center"
          >
            <div className="text-3xl mb-2">🏠</div>
            <div className="font-semibold text-gray-900">Manage Rooms</div>
            <p className="text-sm text-gray-600">Add, edit, or remove rooms</p>
          </Link>
          <Link
            href="/dashboard/rooms"
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-colors text-center"
          >
            <div className="text-3xl mb-2">👥</div>
            <div className="font-semibold text-gray-900">Manage Tenants</div>
            <p className="text-sm text-gray-600">Add or remove tenants</p>
          </Link>
          <Link
            href="/dashboard/rooms"
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-colors text-center"
          >
            <div className="text-3xl mb-2">💳</div>
            <div className="font-semibold text-gray-900">Billing</div>
            <p className="text-sm text-gray-600">View billing and payments</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
