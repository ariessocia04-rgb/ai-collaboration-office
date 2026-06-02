'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: '📊' },
    { label: 'Rooms', href: '/dashboard/rooms', icon: '🏠' },
    { label: 'Tenants', href: '/dashboard/tenants', icon: '👥' },
    { label: 'Billing', href: '/dashboard/billing', icon: '💳' },
    { label: 'Reports', href: '/dashboard/reports', icon: '📋' },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white p-6 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-indigo-400">IRent</h1>
        <p className="text-sm text-gray-400 mt-1">Property Management</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.href)
                ? 'bg-indigo-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <span>{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-8 pt-8 border-t border-gray-700">
        <button className="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-left font-medium">
          Logout
        </button>
      </div>
    </aside>
  );
}
