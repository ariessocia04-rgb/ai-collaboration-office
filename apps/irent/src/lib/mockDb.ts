'use client';

// Mock data storage for rooms and tenants
// In a real app, this would connect to a database

export interface Room {
  id: string;
  name: string;
  type: string;
  rentPrice: number;
  status: 'occupied' | 'vacant';
  utilities?: string;
  tenantId?: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  roomId: string;
  leaseStartDate: string;
  leaseEndDate: string;
  status: 'active' | 'inactive';
}

// In-memory storage (this would be in a database in production)
let roomsData: Room[] = [];
let tenantsData: Tenant[] = [];

export const roomOperations = {
  // Create room
  createRoom: (room: Omit<Room, 'id'>): Room => {
    const newRoom: Room = {
      ...room,
      id: `room_${Date.now()}`,
    };
    roomsData.push(newRoom);
    return newRoom;
  },

  // Get all rooms
  getRooms: (): Room[] => {
    return [...roomsData];
  },

  // Get room by ID
  getRoomById: (id: string): Room | undefined => {
    return roomsData.find(room => room.id === id);
  },

  // Update room
  updateRoom: (id: string, updates: Partial<Room>): Room | null => {
    const index = roomsData.findIndex(room => room.id === id);
    if (index !== -1) {
      roomsData[index] = { ...roomsData[index], ...updates };
      return roomsData[index];
    }
    return null;
  },

  // Delete room
  deleteRoom: (id: string): boolean => {
    const index = roomsData.findIndex(room => room.id === id);
    if (index !== -1) {
      // Also delete associated tenants
      tenantsData = tenantsData.filter(tenant => tenant.roomId !== id);
      roomsData.splice(index, 1);
      return true;
    }
    return false;
  },
};

export const tenantOperations = {
  // Create tenant
  createTenant: (tenant: Omit<Tenant, 'id'>): Tenant => {
    const newTenant: Tenant = {
      ...tenant,
      id: `tenant_${Date.now()}`,
      status: 'active',
    };
    tenantsData.push(newTenant);
    // Update room status
    const room = roomsData.find(r => r.id === tenant.roomId);
    if (room) {
      room.status = 'occupied';
      room.tenantId = newTenant.id;
    }
    return newTenant;
  },

  // Get tenants by room
  getTenantsByRoom: (roomId: string): Tenant[] => {
    return tenantsData.filter(tenant => tenant.roomId === roomId);
  },

  // Get tenant by ID
  getTenantById: (id: string): Tenant | undefined => {
    return tenantsData.find(tenant => tenant.id === id);
  },

  // Update tenant
  updateTenant: (id: string, updates: Partial<Tenant>): Tenant | null => {
    const index = tenantsData.findIndex(tenant => tenant.id === id);
    if (index !== -1) {
      tenantsData[index] = { ...tenantsData[index], ...updates };
      return tenantsData[index];
    }
    return null;
  },

  // Remove/delete tenant
  removeTenant: (id: string): boolean => {
    const tenant = tenantsData.find(t => t.id === id);
    if (tenant) {
      // Mark room as vacant
      const room = roomsData.find(r => r.id === tenant.roomId);
      if (room) {
        room.status = 'vacant';
        room.tenantId = undefined;
      }
      const index = tenantsData.findIndex(t => t.id === id);
      tenantsData.splice(index, 1);
      return true;
    }
    return false;
  },

  // Get all tenants
  getAllTenants: (): Tenant[] => {
    return [...tenantsData];
  },
};
