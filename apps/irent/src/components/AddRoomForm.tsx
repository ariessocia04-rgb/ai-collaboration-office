'use client';

import { useState } from 'react';
import { Room } from '@/lib/mockDb';

interface AddRoomFormProps {
  onSubmit: (data: Omit<Room, 'id'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function AddRoomForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: AddRoomFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    rentPrice: 0,
    status: 'vacant' as const,
    utilities: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      type: formData.type,
      rentPrice: formData.rentPrice,
      status: formData.status,
      utilities: formData.utilities,
    });
    setFormData({ name: '', type: '', rentPrice: 0, status: 'vacant', utilities: '' });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Room</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room Name
          </label>
          <input
            type="text"
            placeholder="e.g., Room 1, Studio A"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            required
          >
            <option value="">Select a type</option>
            <option value="studio">Studio</option>
            <option value="1-bedroom">1 Bedroom</option>
            <option value="2-bedroom">2 Bedroom</option>
            <option value="3-bedroom">3 Bedroom</option>
            <option value="shared">Shared</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Rent Price
          </label>
          <input
            type="number"
            placeholder="0.00"
            value={formData.rentPrice}
            onChange={(e) => setFormData({ ...formData, rentPrice: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            step="0.01"
            min="0"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Utilities Included (optional)
          </label>
          <input
            type="text"
            placeholder="e.g., Electricity, Water"
            value={formData.utilities}
            onChange={(e) => setFormData({ ...formData, utilities: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:bg-gray-400"
          >
            {isLoading ? 'Adding...' : 'Add Room'}
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
    </div>
  );
}

