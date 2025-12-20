'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { Lead } from '@/types/crm';

export default function AdminLeadsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    } else if (user) {
      fetchLeads();
    }
  }, [user, authLoading, router]);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/crm/leads');
      const data = await response.json();
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const response = await fetch(`/api/crm/leads/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setLeads(leads.filter(lead => lead.id !== id));
      } else {
        alert('Failed to delete lead');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Error deleting lead');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/crm/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setLeads(leads.map(lead =>
          lead.id === id ? { ...lead, status: newStatus as any } : lead
        ));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchesSearch = !searchQuery ||
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-700',
      contacted: 'bg-purple-100 text-purple-700',
      qualified: 'bg-green-100 text-green-700',
      proposal: 'bg-yellow-100 text-yellow-700',
      negotiation: 'bg-orange-100 text-orange-700',
      won: 'bg-green-600 text-white',
      lost: 'bg-gray-300 text-gray-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (date?: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (authLoading || loading) {
    return (
      <Section padding="lg">
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leads...</p>
        </div>
      </Section>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Button variant="outline" size="sm" href="/admin" className="border-white text-white hover:bg-white hover:text-gray-900 mb-4">
                <Icon name="ArrowLeft" size={16} />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Lead Management</h1>
              <p className="text-gray-300">View and manage all customer leads</p>
            </div>
          </div>
        </div>
      </section>

      <Section background="gray" padding="lg">
        <Card padding="lg">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search leads by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Service</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500">
                      No leads found
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <p className="font-semibold text-gray-900">{lead.name}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-600">{lead.email}</p>
                        <p className="text-sm text-gray-600">{lead.phone}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-700">{lead.service_type || 'N/A'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(lead.status)} border-0 cursor-pointer`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="proposal">Proposal</option>
                          <option value="negotiation">Negotiation</option>
                          <option value="won">Won</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            href={`/admin/leads/${lead.id}`}
                          >
                            <Icon name="Eye" size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(lead.id)}
                            className="text-red-600 hover:bg-red-50 border-red-300"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </Section>
    </>
  );
}
