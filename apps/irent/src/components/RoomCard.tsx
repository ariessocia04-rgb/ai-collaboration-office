import Link from 'next/link';

interface RoomCardProps {
  id: string;
  name: string;
  roomType: string;
  rentPrice: number;
  isOccupied: boolean;
  tenantName?: string;
  onDelete: (id: string) => void;
}

export default function RoomCard({
  id,
  name,
  roomType,
  rentPrice,
  isOccupied,
  tenantName,
  onDelete,
}: RoomCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500 capitalize">{roomType}</p>
        </div>
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            isOccupied
              ? 'bg-green-100 text-green-800'
              : 'bg-orange-100 text-orange-800'
          }`}
        >
          {isOccupied ? 'Occupied' : 'Vacant'}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Monthly Rent:</span>
          <span className="font-semibold text-gray-900">
            ${rentPrice.toFixed(2)}
          </span>
        </div>
        {isOccupied && tenantName && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Tenant:</span>
            <span className="font-semibold text-gray-900">{tenantName}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Link
          href={`/dashboard/rooms/${id}`}
          className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-100 text-center"
        >
          Manage Tenant
        </Link>
        <button
          onClick={() => onDelete(id)}
          className="flex-1 px-3 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
