'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { Lead } from '@/types/crm';

export default function AdminLeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    } else if (user && params.id) {
      fetchLead();
      fetchNotes();
      fetchActivities();
    }
  }, [user, authLoading, router, params.id]);

  const fetchLead = async () => {
    try {
      const response = await fetch(`/api/crm/leads/${params.id}`);
      const data = await response.json();
      setLead(data.lead);
    } catch (error) {
      console.error('Error fetching lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await fetch(`/api/crm/leads/${params.id}/notes`);
      const data = await response.json();
      setNotes(data.notes || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch(`/api/crm/leads/${params.id}/activities`);
      const data = await response.json();
      setActivities(data.activities || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const response = await fetch(`/api/crm/leads/${params.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote }),
      });

      if (response.ok) {
        setNewNote('');
        fetchNotes();
        fetchActivities();
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleConvertToCustomer = async () => {
    if (!confirm('Convert this lead to a customer?')) return;

    try {
      const response = await fetch(`/api/admin/leads/${params.id}/convert`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Lead converted to customer successfully!');
        router.push('/admin/customers');
      } else {
        alert('Failed to convert lead');
      }
    } catch (error) {
      console.error('Error converting lead:', error);
      alert('Error converting lead');
    }
  };

  if (authLoading || loading) {
    return (
      <Section padding="lg">
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lead details...</p>
        </div>
      </Section>
    );
  }

  if (!lead) {
    return (
      <Section padding="lg">
        <div className="text-center py-12">
          <p className="text-gray-600">Lead not found</p>
          <Button variant="primary" size="md" href="/admin/leads" className="mt-4">
            Back to Leads
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button variant="outline" size="sm" href="/admin/leads" className="border-white text-white hover:bg-white hover:text-gray-900 mb-4">
            <Icon name="ArrowLeft" size={16} />
            Back to Leads
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{lead.name}</h1>
          <p className="text-gray-300">{lead.email} • {lead.phone}</p>
        </div>
      </section>

      <Section background="gray" padding="lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card padding="lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Lead Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-gray-900">{lead.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{lead.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold text-gray-900">{lead.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Service Type</p>
                  <p className="font-semibold text-gray-900">{lead.service_type || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Budget Range</p>
                  <p className="font-semibold text-gray-900">{lead.budget_range || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Timeframe</p>
                  <p className="font-semibold text-gray-900">{lead.timeframe || 'N/A'}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <p className="text-gray-900">{lead.description}</p>
              </div>
            </Card>

            <Card padding="lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Notes</h2>
              <div className="space-y-4 mb-4">
                {notes.map((note) => (
                  <div key={note.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="text-gray-900">{note.content}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(note.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button variant="primary" size="md" onClick={handleAddNote}>
                  <Icon name="Plus" size={16} />
                  Add
                </Button>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card padding="lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Button variant="primary" size="md" fullWidth onClick={handleConvertToCustomer}>
                  <Icon name="UserCheck" size={16} />
                  Convert to Customer
                </Button>
                <Button variant="outline" size="md" fullWidth href={`/admin/quotes/new?leadId=${lead.id}`}>
                  <Icon name="FileText" size={16} />
                  Create Quote
                </Button>
                <Button variant="outline" size="md" fullWidth href={`mailto:${lead.email}`}>
                  <Icon name="Mail" size={16} />
                  Send Email
                </Button>
                <Button variant="outline" size="md" fullWidth href={`tel:${lead.phone}`}>
                  <Icon name="Phone" size={16} />
                  Call
                </Button>
              </div>
            </Card>

            <Card padding="lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Activity Timeline</h2>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
