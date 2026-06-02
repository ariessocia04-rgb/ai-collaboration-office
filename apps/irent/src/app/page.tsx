'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="border-b border-gray-200 bg-white">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">IRent</div>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900">
              Sign In
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Manage Your Rental Property with Ease
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            IRent is the all-in-one platform for property owners to manage rooms, track tenants, automate billing, and streamline operations.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Manage Rooms</h3>
            <p className="text-gray-600">
              Add and organize rooms in your rental property. Track occupancy status and manage room details effortlessly.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Tenant Management</h3>
            <p className="text-gray-600">
              Add tenant information, manage credentials, and quickly remove tenants when they vacate your property.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Automated Billing</h3>
            <p className="text-gray-600">
              Automate rent collection, track utilities, and manage payments with our integrated billing system.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
