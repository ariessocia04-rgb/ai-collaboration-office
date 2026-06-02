'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { roomOperations, tenantOperations } from '@/lib/mockDb';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    vacantRooms: 0,
    totalTenants: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const rooms = roomOperations.getRooms();
    const tenants = tenantOperations.getAllTenants();
    const occupiedRooms = rooms.filter(r => r.status === 'occupied');
    const totalRevenue = rooms.reduce((sum, r) => sum + (r.status === 'occupied' ? r.rentPrice : 0), 0);

    setStats({
      totalRooms: rooms.length,
      occupiedRooms: occupiedRooms.length,
      vacantRooms: rooms.length - occupiedRooms.length,
      totalTenants: tenants.filter(t => t.status === 'active').length,
      totalRevenue,
    });
  }, []);

  const StatCard = ({ icon, label, value, color }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
        <p className="text-gray-600 mt-2">Here&apos;s an overview of your rental properties</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon="🏠"
          label="Total Rooms"
          value={stats.totalRooms}
          color="text-indigo-600"
        />
        <StatCard
          icon="✅"
          label="Occupied Rooms"
          value={stats.occupiedRooms}
          color="text-green-600"
        />
        <StatCard
          icon="⏳"
          label="Vacant Rooms"
          value={stats.vacantRooms}
          color="text-orange-600"
        />
        <StatCard
          icon="💰"
          label="Monthly Revenue"
          value={`$${stats.totalRevenue}`}
          color="text-blue-600"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/rooms"
            className="p-4 border-2 border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors text-center"
          >
            <p className="text-2xl mb-2">🏠</p>
            <p className="font-semibold text-gray-900">Manage Rooms</p>
            <p className="text-sm text-gray-600">Add, edit, or delete rooms</p>
          </Link>
          <Link
            href="/dashboard/rooms"
            className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors text-center"
          >
            <p className="text-2xl mb-2">👥</p>
            <p className="font-semibold text-gray-900">Manage Tenants</p>
            <p className="text-sm text-gray-600">Assign and remove tenants</p>
          </Link>
          <Link
            href="/dashboard/billing"
            className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-center"
          >
            <p className="text-2xl mb-2">💳</p>
            <p className="font-semibold text-gray-900">Billing</p>
            <p className="text-sm text-gray-600">Track payments and revenue</p>
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Property Overview</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Active Tenants</span>
            <span className="font-bold text-gray-900">{stats.totalTenants}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Occupancy Rate</span>
            <span className="font-bold text-gray-900">
              {stats.totalRooms > 0 ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0}%
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Monthly Revenue</span>
            <span className="font-bold text-green-600">${stats.totalRevenue}</span>
          </div>
        </div>
      </div>

      {stats.totalRooms === 0 && (
        <div className="bg-indigo-50 border-2 border-indigo-200 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-indigo-900 mb-2">Get Started</h3>
          <p className="text-indigo-800 mb-4">Start by adding your first room to the system.</p>
          <Link
            href="/dashboard/rooms"
            className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
          >
            Add Your First Room
          </Link>
        </div>
      )}
    </div>
  );
}
