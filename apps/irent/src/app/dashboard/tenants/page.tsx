'use client';

export default function TenantsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tenants</h1>
        <p className="text-gray-600 mt-1">Manage all your tenants across all rooms</p>
      </div>

      <div className="bg-white p-12 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-600 mb-4">View and manage all your active tenants here. Go to individual rooms to add or remove tenants.</p>
      </div>
    </div>
  );
}
