'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { roomOperations, tenantOperations, Room, Tenant } from '@/lib/mockDb';
import TenantForm from '@/components/TenantForm';
import ConfirmRemoveTenant from '@/components/ConfirmRemoveTenant';

export default function RoomTenantPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoomAndTenant();
  }, [roomId]);

  const loadRoomAndTenant = () => {
    const roomData = roomOperations.getRoomById(roomId);
    if (!roomData) {
      router.push('/dashboard/rooms');
      return;
    }
    setRoom(roomData);

    const tenants = tenantOperations.getTenantsByRoom(roomId);
    if (tenants.length > 0) {
      setTenant(tenants[0]);
    }
    setLoading(false);
  };

  const handleAddTenant = (tenantData: Omit<Tenant, 'id'>) => {
    const newTenant = tenantOperations.createTenant(tenantData);
    setTenant(newTenant);
    setShowAddForm(false);
  };

  const handleEditTenant = (tenantData: Omit<Tenant, 'id'>) => {
    if (tenant) {
      const updated = tenantOperations.updateTenant(tenant.id, tenantData);
      if (updated) {
        setTenant(updated);
      }
    }
    setShowEditForm(false);
  };

  const handleRemoveTenant = () => {
    if (tenant) {
      tenantOperations.removeTenant(tenant.id);
      setTenant(null);
      setShowConfirmRemove(false);
      loadRoomAndTenant();
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400">Loading...</div>;
  }

  if (!room) {
    return <div className="text-center py-12 text-slate-400">Room not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/rooms"
          className="text-cyan-400 hover:text-cyan-300 font-medium"
        >
          ← Back to Rooms
        </Link>
      </div>

      <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
        <h1 className="text-3xl font-bold text-slate-50">{room.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div>
            <p className="text-slate-400 text-sm">Room Type</p>
            <p className="text-lg font-semibold text-slate-50">{room.type}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Monthly Rent</p>
            <p className="text-lg font-semibold text-slate-50">${room.rentPrice}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Status</p>
            <div className="mt-1">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                room.status === 'occupied'
                  ? 'bg-green-500/20 text-green-300'
                  : 'bg-orange-500/20 text-orange-300'
              }`}>
                {room.status === 'occupied' ? 'Occupied' : 'Vacant'}
              </span>
            </div>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Utilities</p>
            <p className="text-lg font-semibold text-slate-50">{room.utilities || 'None'}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-50">Tenant Information</h2>
          {tenant ? (
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditForm(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Edit Tenant
              </button>
              <button
                onClick={() => setShowConfirmRemove(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Remove Tenant
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              + Add Tenant
            </button>
          )}
        </div>

        {tenant ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Name</p>
                <p className="text-lg font-semibold text-slate-50">{tenant.name}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Email</p>
                <p className="text-lg font-semibold text-slate-50">{tenant.email}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Phone</p>
                <p className="text-lg font-semibold text-slate-50">{tenant.phone}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  tenant.status === 'active'
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-gray-500/20 text-gray-300'
                }`}>
                  {tenant.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-700">
              <p className="text-slate-400 text-sm">Lease Period</p>
              <p className="text-lg font-semibold text-slate-50">
                {new Date(tenant.leaseStartDate).toLocaleDateString()} - {new Date(tenant.leaseEndDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-slate-400 mb-4">No tenant assigned to this room</p>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium"
              >
                Add Tenant
              </button>
            )}
          </div>
        )}

        {showAddForm && (
          <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
            <h3 className="text-lg font-semibold text-slate-50 mb-4">Add New Tenant</h3>
            <TenantForm
              roomId={roomId}
              onSubmit={handleAddTenant}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {showEditForm && tenant && (
          <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
            <h3 className="text-lg font-semibold text-slate-50 mb-4">Edit Tenant Information</h3>
            <TenantForm
              roomId={roomId}
              initialData={tenant}
              isEditing={true}
              onSubmit={handleEditTenant}
              onCancel={() => setShowEditForm(false)}
            />
          </div>
        )}
      </div>

      <ConfirmRemoveTenant
        isOpen={showConfirmRemove}
        tenantName={tenant?.name || ''}
        roomName={room.name}
        onConfirm={handleRemoveTenant}
        onCancel={() => setShowConfirmRemove(false)}
      />
    </div>
  );
}
