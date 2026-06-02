'use client';

import { useState, useEffect } from 'react';
import { Tenant } from '@/lib/mockDb';

interface TenantFormProps {
  roomId: string;
  onSubmit: (data: Omit<Tenant, 'id'>) => void;
  onCancel: () => void;
  initialData?: Tenant;
  isEditing?: boolean;
  isLoading?: boolean;
}

export default function TenantForm({
  roomId,
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
  isLoading = false,
}: TenantFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    leaseStartDate: initialData?.leaseStartDate || new Date().toISOString().split('T')[0],
    leaseEndDate: initialData?.leaseEndDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: initialData?.status || 'active' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      roomId,
      leaseStartDate: formData.leaseStartDate,
      leaseEndDate: formData.leaseEndDate,
      status: formData.status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tenant Name
          </label>
          <input
            type="text"
            placeholder="Full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="tenant@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lease Start Date
          </label>
          <input
            type="date"
            value={formData.leaseStartDate}
            onChange={(e) => setFormData({ ...formData, leaseStartDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lease End Date
          </label>
          <input
            type="date"
            value={formData.leaseEndDate}
            onChange={(e) => setFormData({ ...formData, leaseEndDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            required
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:bg-gray-400"
        >
          {isLoading ? 'Saving...' : isEditing ? 'Update Tenant' : 'Add Tenant'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
