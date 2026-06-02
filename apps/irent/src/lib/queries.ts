import { supabase } from './supabase';

// Room queries
export async function createRoom(
  ownerId: string,
  roomData: {
    name: string;
    room_type: string;
    rent_price: number;
  }
) {
  return supabase.from('rooms').insert([
    {
      owner_id: ownerId,
      ...roomData,
      is_occupied: false,
    },
  ]);
}

export async function getRoomsByOwner(ownerId: string) {
  return supabase
    .from('rooms')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });
}

export async function getRoomById(roomId: string) {
  return supabase.from('rooms').select('*').eq('id', roomId).single();
}

export async function updateRoom(roomId: string, updates: any) {
  return supabase.from('rooms').update(updates).eq('id', roomId);
}

export async function deleteRoom(roomId: string) {
  return supabase.from('rooms').delete().eq('id', roomId);
}

export async function getRoomStats(ownerId: string) {
  const { count: totalRooms } = await supabase
    .from('rooms')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', ownerId);

  const { count: occupiedRooms } = await supabase
    .from('rooms')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', ownerId)
    .eq('is_occupied', true);

  return {
    totalRooms: totalRooms || 0,
    occupiedRooms: occupiedRooms || 0,
    vacantRooms: (totalRooms || 0) - (occupiedRooms || 0),
  };
}

// Tenant queries
export async function createTenant(
  tenantData: {
    owner_id: string;
    room_id: string;
    auth_id: string;
    name: string;
    email: string;
    phone: string;
    lease_start: string;
    lease_end: string;
  }
) {
  return supabase.from('tenants').insert([
    {
      ...tenantData,
      is_active: true,
    },
  ]);
}

export async function getTenantsByOwner(ownerId: string) {
  return supabase
    .from('tenants')
    .select('*')
    .eq('owner_id', ownerId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
}

export async function getTenantByRoomId(roomId: string) {
  return supabase
    .from('tenants')
    .select('*')
    .eq('room_id', roomId)
    .eq('is_active', true)
    .single();
}

export async function updateTenant(tenantId: string, updates: any) {
  return supabase.from('tenants').update(updates).eq('id', tenantId);
}

export async function removeTenant(tenantId: string, roomId: string) {
  // Mark tenant as inactive
  await supabase.from('tenants').update({ is_active: false }).eq('id', tenantId);

  // Mark room as vacant
  await supabase.from('rooms').update({ is_occupied: false }).eq('id', roomId);

  return { success: true };
}

export async function getTenantStats(ownerId: string) {
  const { count: activeTenants } = await supabase
    .from('tenants')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', ownerId)
    .eq('is_active', true);

  return {
    activeTenants: activeTenants || 0,
  };
}
