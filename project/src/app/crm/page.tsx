'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, Filter, Plus, Phone, Mail, Calendar, DollarSign } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  description: string;
  status: 'new' | 'contacted' | 'quoted' | 'won' | 'lost';
}

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Fetch initial leads
  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLeads(data as Lead[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();

    // Real-time subscription
    const channel = supabase
      .channel('public:leads')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leads' },
        (payload) => {
          setLeads((current) => [payload.new as Lead, ...current]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'leads' },
        (payload) => {
          setLeads((current) =>
            current.map((lead) => (lead.id === payload.new.id ? (payload.new as Lead) : lead))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || lead.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    won: leads.filter((l) => l.status === 'won').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading CRM...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Burch Contracting CRM</h1>
          <p className="text-gray-600">Real-time lead dashboard • Updates instantly</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-gray-600">Total Leads</div>
          </div>
          <div className="bg-orange-50 p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-orange-600">{stats.new}</div>
            <div className="text-gray-600">New</div>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-yellow-600">{stats.contacted}</div>
            <div className="text-gray-600">Contacted</div>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-green-600">{stats.won}</div>
            <div className="text-gray-600">Jobs Won</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-3 border rounded-lg"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="quoted">Quoted</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredLeads.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No leads yet — submit a test from /contact to see real-time magic!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Lead</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Service</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Details</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium">{lead.name || 'No name'}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-4 mt-1">
                          {lead.email && <span className="flex items-center gap-1"><Mail className="h-4 w-4" />{lead.email}</span>}
                          {lead.phone && <span className="flex items-center gap-1"><Phone className="h-4 w-4" />{lead.phone}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{lead.service_type || '—'}</td>
                      <td className="px-6 py-4 text-sm max-w-xs truncate">
                        {lead.description || 'No description'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          lead.status === 'new' ? 'bg-orange-100 text-orange-800' :
                          lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                          lead.status === 'won' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {lead.status || 'new'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(lead.created_at).toLocaleDateString()} <br />
                        {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
