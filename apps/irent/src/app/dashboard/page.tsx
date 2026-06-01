'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Property {
  id: string;
  name: string;
  address: string;
  owner_id: string;
  created_at: string;
}

interface Room {
  id: string;
  property_id: string;
  name: string;
  created_at: string;
}

interface Tenancy {
  id: string;
  room_id: string;
  tenant_id: string;
  move_in_date: string;
  move_out_date: string | null;
  status: string;
}

interface Bill {
  id: string;
  tenancy_id: string;
  month: string;
  rent: number;
  electricity: number;
  water: number;
  total: number;
  status: string;
  due_date: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tenancies, setTenancies] = useState<Tenancy[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingBills, setPendingBills] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          router.push('/login');
          return;
        }
        setUser(authUser);

        // Fetch properties owned by the user
        const { data: propsData, error: propsError } = await supabase
          .from('properties')
          .select('*')
          .eq('owner_id', authUser.id);

        if (propsError) throw propsError;
        setProperties(propsData || []);

        if (propsData && propsData.length > 0) {
          setSelectedProperty(propsData[0].id);

          // Fetch rooms for the first property
          const { data: roomsData, error: roomsError } = await supabase
            .from('rooms')
            .select('*')
            .eq('property_id', propsData[0].id);

          if (roomsError) throw roomsError;
          setRooms(roomsData || []);

          // Fetch tenancies
          const { data: tenanciesData, error: tenanciesError } = await supabase
            .from('tenancies')
            .select('*')
            .in('room_id', (roomsData || []).map((r: Room) => r.id));

          if (tenanciesError) throw tenanciesError;
          setTenancies(tenanciesData || []);

          // Fetch bills
          const { data: billsData, error: billsError } = await supabase
            .from('bills')
            .select('*')
            .in('tenancy_id', (tenanciesData || []).map((t: Tenancy) => t.id));

          if (billsError) throw billsError;
          setBills(billsData || []);

          // Calculate analytics
          const totalRev = (billsData || []).reduce((sum, bill) => sum + (bill.total || 0), 0);
          const pending = (billsData || []).filter(bill => bill.status === 'pending').length;
          setTotalRevenue(totalRev);
          setPendingBills(pending);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handlePropertyChange = async (propertyId: string) => {
    setSelectedProperty(propertyId);
    setLoading(true);

    try {
      // Fetch rooms for selected property
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .eq('property_id', propertyId);

      if (roomsError) throw roomsError;
      setRooms(roomsData || []);

      // Fetch tenancies
      const { data: tenanciesData, error: tenanciesError } = await supabase
        .from('tenancies')
        .select('*')
        .in('room_id', (roomsData || []).map((r: Room) => r.id));

      if (tenanciesError) throw tenanciesError;
      setTenancies(tenanciesData || []);

      // Fetch bills
      const { data: billsData, error: billsError } = await supabase
        .from('bills')
        .select('*')
        .in('tenancy_id', (tenanciesData || []).map((t: Tenancy) => t.id));

      if (billsError) throw billsError;
      setBills(billsData || []);

      // Calculate analytics
      const totalRev = (billsData || []).reduce((sum, bill) => sum + (bill.total || 0), 0);
      const pending = (billsData || []).filter(bill => bill.status === 'pending').length;
      setTotalRevenue(totalRev);
      setPendingBills(pending);
    } catch (error) {
      console.error('Error updating property data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex gap-4">
            <Link href="/tenants/new" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Invite Tenant
            </Link>
            <button
              onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Property</label>
          <select
            value={selectedProperty || ''}
            onChange={(e) => handlePropertyChange(e.target.value)}
            className="block w-full max-w-xs border border-gray-300 rounded-md shadow-sm p-2"
          >
            {properties.map((prop) => (
              <option key={prop.id} value={prop.id}>
                {prop.name} - {prop.address}
              </option>
            ))}
          </select>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Active Tenants</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{tenancies.filter(t => t.status === 'active').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Pending Bills</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{pendingBills}</p>
          </div>
        </div>

        {/* Rooms & Tenancies */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Rooms & Tenants</h2>
            <Link href="/rooms/new" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              + Add Room
            </Link>
          </div>
          <div className="divide-y">
            {rooms.length === 0 ? (
              <div className="px-6 py-4 text-gray-500">No rooms found. Create your first room.</div>
            ) : (
              rooms.map((room) => {
                const roomTenancy = tenancies.find(t => t.room_id === room.id && t.status === 'active');
                return (
                  <div key={room.id} className="px-6 py-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">{room.name}</h3>
                      <p className="text-sm text-gray-500">
                        {roomTenancy ? `Tenant: ${roomTenancy.tenant_id}` : 'Vacant'}
                      </p>
                    </div>
                    <Link href={`/rooms/${room.id}`} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                      View Details
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Bills */}
        <div className="bg-white rounded-lg shadow mt-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bills</h2>
          </div>
          <div className="divide-y">
            {bills.length === 0 ? (
              <div className="px-6 py-4 text-gray-500">No bills found.</div>
            ) : (
              bills.slice(0, 10).map((bill) => (
                <div key={bill.id} className="px-6 py-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">Bill {bill.month}</h3>
                    <p className="text-sm text-gray-500">
                      Rent: ${bill.rent} | Electricity: ${bill.electricity} | Water: ${bill.water}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${bill.total.toFixed(2)}</p>
                    <span className={`text-xs font-medium ${bill.status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                      {bill.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
