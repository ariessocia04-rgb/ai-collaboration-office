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
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!room) {
    return <div className="text-center py-12">Room not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/rooms"
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          ← Back to Rooms
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">{room.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div>
            <p className="text-gray-600 text-sm">Room Type</p>
            <p className="text-lg font-semibold text-gray-900">{room.type}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Monthly Rent</p>
            <p className="text-lg font-semibold text-gray-900">${room.rentPrice}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Status</p>
            <div className="mt-1">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                room.status === 'occupied'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {room.status === 'occupied' ? 'Occupied' : 'Vacant'}
              </span>
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Utilities</p>
            <p className="text-lg font-semibold text-gray-900">{room.utilities || 'None'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Tenant Information</h2>
          {tenant ? (
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Edit Tenant
              </button>
              <button
                onClick={() => setShowConfirmRemove(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Remove Tenant
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              + Add Tenant
            </button>
          )}
        </div>

        {tenant ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="text-lg font-semibold text-gray-900">{tenant.name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-lg font-semibold text-gray-900">{tenant.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone</p>
                <p className="text-lg font-semibold text-gray-900">{tenant.phone}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  tenant.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {tenant.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm">Lease Period</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(tenant.leaseStartDate).toLocaleDateString()} - {new Date(tenant.leaseEndDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-600 mb-4">No tenant assigned to this room</p>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
              >
                Add Tenant
              </button>
            )}
          </div>
        )}

        {showAddForm && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Tenant</h3>
            <TenantForm
              roomId={roomId}
              onSubmit={handleAddTenant}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {showEditForm && tenant && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Tenant Information</h3>
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


      if (roomError) throw roomError;
      setRoom(roomData);

      // Fetch tenant if room is occupied
      if (roomData?.is_occupied) {
        const { data: tenantData, error: tenantError } = await supabase
          .from('tenants')
          .select('*')
          .eq('room_id', roomId)
          .eq('is_active', true)
          .single();

        if (tenantError && tenantError.code !== 'PGRST116') throw tenantError;
        if (tenantData) setTenant(tenantData);
      }
    } catch (error) {
      console.error('[v0] Error fetching room:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingTenant(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Create tenant user account in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin
        .createUser({
          email: formData.email,
          password: formData.password,
          email_confirm: true,
        });

      if (authError) throw authError;

      // Add tenant to database
      const { error: dbError } = await supabase.from('tenants').insert([
        {
          owner_id: user.id,
          room_id: roomId,
          auth_id: authData.user.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          lease_start: formData.lease_start,
          lease_end: formData.lease_end,
          is_active: true,
        },
      ]);

      if (dbError) throw dbError;

      // Mark room as occupied
      await supabase
        .from('rooms')
        .update({ is_occupied: true })
        .eq('id', roomId);

      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        lease_start: '',
        lease_end: '',
      });
      setShowAddForm(false);
      fetchRoomAndTenant();
    } catch (error) {
      console.error('[v0] Error adding tenant:', error);
      alert('Error adding tenant. Please try again.');
    } finally {
      setCreatingTenant(false);
    }
  };

  const handleRemoveTenant = async () => {
    if (!tenant) return;
    if (!confirm('Are you sure you want to remove this tenant? This will mark the room as vacant.')) return;

    try {
      // Mark tenant as inactive
      await supabase
        .from('tenants')
        .update({ is_active: false })
        .eq('id', tenant.id);

      // Mark room as vacant
      await supabase
        .from('rooms')
        .update({ is_occupied: false })
        .eq('id', roomId);

      // Optional: Delete tenant auth account
      // await supabase.auth.admin.deleteUser(tenant.auth_id);

      fetchRoomAndTenant();
      alert('Tenant removed successfully. Room is now vacant.');
    } catch (error) {
      console.error('[v0] Error removing tenant:', error);
      alert('Error removing tenant. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!room) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Room not found</p>
        <Link href="/dashboard/rooms" className="text-indigo-600 hover:text-indigo-700 font-medium">
          Back to Rooms
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <Link href="/dashboard/rooms" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            ← Back to Rooms
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">{room.name}</h1>
          <p className="text-gray-600 capitalize">{room.room_type} • ${room.rent_price.toFixed(2)}/month</p>
        </div>
      </div>

      {/* Current Tenant */}
      {tenant ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Current Tenant</h2>
            <button
              onClick={handleRemoveTenant}
              className="px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100"
            >
              Remove Tenant
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-lg font-semibold text-gray-900">{tenant.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-semibold text-gray-900">{tenant.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="text-lg font-semibold text-gray-900">{tenant.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-semibold text-green-600">Active</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Lease Start</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(tenant.lease_start).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Lease End</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(tenant.lease_end).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add Tenant</h2>
          </div>

          {showAddForm ? (
            <form onSubmit={handleAddTenant} className="space-y-4">
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
                    Email
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
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Set password for tenant"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lease Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.lease_start}
                    onChange={(e) => setFormData({ ...formData, lease_start: e.target.value })}
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
                    value={formData.lease_end}
                    onChange={(e) => setFormData({ ...formData, lease_end: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={creatingTenant}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:bg-gray-400"
                >
                  {creatingTenant ? 'Adding...' : 'Add Tenant'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              Add Tenant to {room.name}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
