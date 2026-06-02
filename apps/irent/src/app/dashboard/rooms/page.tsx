'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { roomOperations, Room } from '@/lib/mockDb';
import RoomCard from '@/components/RoomCard';
import AddRoomForm from '@/components/AddRoomForm';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = () => {
    const allRooms = roomOperations.getRooms();
    setRooms(allRooms);
  };

  const handleAddRoom = (newRoom: Omit<Room, 'id'>) => {
    const createdRoom = roomOperations.createRoom(newRoom);
    setRooms([createdRoom, ...rooms]);
    setShowAddForm(false);
  };

  const handleDeleteRoom = (roomId: string) => {
    if (confirm('Are you sure you want to delete this room?')) {
      roomOperations.deleteRoom(roomId);
      setRooms(rooms.filter(r => r.id !== roomId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rooms</h1>
          <p className="text-gray-600 mt-1">Manage your rental rooms and tenant assignments</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          + Add Room
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Room</h2>
          <AddRoomForm
            onSubmit={handleAddRoom}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      <div className="stats-grid grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Total Rooms</p>
          <p className="text-3xl font-bold text-gray-900">{rooms.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Occupied</p>
          <p className="text-3xl font-bold text-green-600">{rooms.filter(r => r.status === 'occupied').length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Vacant</p>
          <p className="text-3xl font-bold text-orange-600">{rooms.filter(r => r.status === 'vacant').length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold text-blue-600">
            ${rooms.reduce((sum, r) => sum + (r.status === 'occupied' ? r.rentPrice : 0), 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rooms.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-lg border border-gray-200 text-center">
            <p className="text-gray-600 mb-4">No rooms yet. Start by adding your first room.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
            >
              Add First Room
            </button>
          </div>
        ) : (
          rooms.map(room => (
            <div key={room.id}>
              <RoomCard
                room={room}
                onDelete={handleDeleteRoom}
              />
              <div className="mt-2">
                <Link
                  href={`/dashboard/rooms/${room.id}`}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  Manage Tenants →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
