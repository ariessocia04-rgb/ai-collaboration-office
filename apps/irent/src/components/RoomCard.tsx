'use client';

import Link from 'next/link';
import { Room, tenantOperations } from '@/lib/mockDb';

interface RoomCardProps {
  room: Room;
  onDelete: (id: string) => void;
}

export default function RoomCard({ room, onDelete }: RoomCardProps) {
  const tenants = tenantOperations.getTenantsByRoom(room.id);
  const tenant = tenants.length > 0 ? tenants[0] : null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
          <p className="text-sm text-gray-500 capitalize">{room.type}</p>
        </div>
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            room.status === 'occupied'
              ? 'bg-green-100 text-green-800'
              : 'bg-orange-100 text-orange-800'
          }`}
        >
          {room.status === 'occupied' ? 'Occupied' : 'Vacant'}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Monthly Rent:</span>
          <span className="font-semibold text-gray-900">
            ${room.rentPrice.toFixed(2)}
          </span>
        </div>
        {room.status === 'occupied' && tenant && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Tenant:</span>
            <span className="font-semibold text-gray-900">{tenant.name}</span>
          </div>
        )}
        {room.utilities && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Utilities:</span>
            <span className="font-semibold text-gray-900">{room.utilities}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Link
          href={`/dashboard/rooms/${room.id}`}
          className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-100 text-center"
        >
          Manage Tenant
        </Link>
        <button
          onClick={() => onDelete(room.id)}
          className="flex-1 px-3 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
