'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  created_at: string;
}

interface Tenancy {
  id: string;
  room_id: string;
  tenant_id: string;
  status: string;
  rooms?: { name: string };
}

export default function BillsPage() {
  const router = useRouter();
  const [bills, setBills] = useState<Bill[]>([]);
  const [tenancies, setTenancies] = useState<Tenancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('due_date');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        // Fetch properties
        const { data: propsData } = await supabase
          .from('properties')
          .select('id')
          .eq('owner_id', user.id);

        if (!propsData || propsData.length === 0) {
          setLoading(false);
          return;
        }

        // Fetch rooms
        const { data: roomsData } = await supabase
          .from('rooms')
          .select('id')
          .in('property_id', propsData.map(p => p.id));

        if (!roomsData || roomsData.length === 0) {
          setLoading(false);
          return;
        }

        // Fetch tenancies
        const { data: tenanciesData } = await supabase
          .from('tenancies')
          .select('*')
          .in('room_id', roomsData.map(r => r.id));

        setTenancies(tenanciesData || []);

        // Fetch bills
        const { data: billsData, error: err } = await supabase
          .from('bills')
          .select('*')
          .in('tenancy_id', (tenanciesData || []).map(t => t.id));

        if (err) throw err;
        setBills(billsData || []);
      } catch (error) {
        console.error('Error fetching bills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const filteredBills = bills.filter(bill => {
    if (filterStatus === 'all') return true;
    return bill.status === filterStatus;
  });

  const sortedBills = [...filteredBills].sort((a, b) => {
    if (sortBy === 'due_date') {
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    } else if (sortBy === 'total') {
      return b.total - a.total;
    } else if (sortBy === 'month') {
      return a.month.localeCompare(b.month);
    }
    return 0;
  });

  const totalAmount = bills.reduce((sum, bill) => sum + bill.total, 0);
  const paidAmount = bills.filter(b => b.status === 'paid').reduce((sum, bill) => sum + bill.total, 0);
  const pendingAmount = bills.filter(b => b.status === 'pending').reduce((sum, bill) => sum + bill.total, 0);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Bills Management</h1>
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Bills</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">${totalAmount.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2">{bills.length} bills</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Paid</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">${paidAmount.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2">{bills.filter(b => b.status === 'paid').length} bills</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">${pendingAmount.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2">{bills.filter(b => b.status === 'pending').length} bills</p>
          </div>
        </div>

        {/* Filters & Sort */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="due_date">Due Date</option>
              <option value="total">Amount</option>
              <option value="month">Month</option>
            </select>
          </div>
        </div>

        {/* Bills Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Electricity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Water</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedBills.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No bills found
                  </td>
                </tr>
              ) : (
                sortedBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bill.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${bill.rent.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${bill.electricity.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${bill.water.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${bill.total.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(bill.due_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          bill.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {bill.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
