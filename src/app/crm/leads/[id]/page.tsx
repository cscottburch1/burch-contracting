'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Lead, LeadNote, LeadActivity } from '@/types/crm';

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');  // Fixed: single definition
  const [newNote, setNewNote] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Lead>>({});

  useEffect(() => {
    if (leadId) {
      fetchLeadDetails();
    }
  }, [leadId]);

  const fetchLeadDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const [leadRes, notesRes, activitiesRes] = await Promise.all([
        fetch(`/api/crm/leads/${leadId}`),
        fetch(`/api/crm/leads/${leadId}/notes`),
        fetch(`/api/crm/leads/${leadId}/activities`)
      ]);

      if (!leadRes.ok || !notesRes.ok || !activitiesRes.ok) {
        throw new Error('Failed to fetch lead data');
      }

      const leadData = await leadRes.json();
      const notesData = await notesRes.json();
      const activitiesData = await activitiesRes.json();

      setLead(leadData);
      setNotes(notesData);
      setActivities(activitiesData);
      setFormData(leadData);
    } catch (err) {
      setError('Failed to load lead details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  if (!lead) {
    return <div className="p-8 text-center">Lead not found</div>;
  }

  return (
    <Section>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">
          Lead: {lead.name || 'Unnamed Lead'}
        </h1>
        <Card>
          <p>Email: {lead.email}</p>
          <p>Phone: {lead.phone}</p>
          <Badge variant={
  lead.status === 'new' ? 'blue' : 
  lead.status === 'contacted' ? 'green' : 
  lead.status === 'qualified' ? 'orange' : 
  'gray'  // fallback
}>
  {lead.status}
</Badge>
          {/* Add notes, activities, add note form, edit button, etc. here */}
        </Card>
      </div>
    </Section>
  );
}
