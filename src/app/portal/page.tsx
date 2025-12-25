"use client";

import React, { useState } from 'react';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

interface PortalDocument {
  id: number;
  title: string;
  url: string;
  created_at?: string;
}

export default function CustomerPortalPage() {
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [portalUserId, setPortalUserId] = useState<number | null>(null);
  const [docs, setDocs] = useState<PortalDocument[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setDocs([]);

    try {
      const res = await fetch('/api/portal/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, accessCode })
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Login failed. Please check your access code.');
        setPortalUserId(null);
        return;
      }

      setPortalUserId(data.portalUserId);
      setMessage('Login successful. Fetching your documents...');
      await fetchDocs(data.portalUserId, accessCode);
    } catch (error) {
      console.error(error);
      setMessage('Unexpected error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocs = async (pid: number, code: string) => {
    try {
      const res = await fetch('/api/portal/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portalUserId: pid, accessCode: code })
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Unable to load documents.');
        return;
      }
      setDocs(data.documents || []);
      setMessage(data.documents?.length ? 'Documents loaded.' : 'No documents available yet.');
    } catch (error) {
      console.error(error);
      setMessage('Unable to load documents.');
    }
  };

  return (
    <>
      <section className="bg-gradient-to-br from-blue-900 to-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Customer Portal</h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            Access your project documents and updates. Use the email and access code we provided after your request.
          </p>
        </div>
      </section>

      <Section background="white" padding="lg">
        <div className="max-w-3xl mx-auto">
          <Card padding="lg">
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Code</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border rounded-lg"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" variant="primary" size="md" disabled={loading}>
                  <Icon name="Clock" size={18} />
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
                {message && <p className="text-sm text-gray-700">{message}</p>}
              </div>
            </form>
          </Card>

          {portalUserId && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Documents</h2>
              {docs.length === 0 ? (
                <p className="text-gray-600">No documents available yet.</p>
              ) : (
                <div className="space-y-3">
                  {docs.map((doc) => (
                    <Card key={doc.id} padding="md" className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{doc.title}</p>
                        {doc.created_at && (
                          <p className="text-xs text-gray-500">Uploaded {new Date(doc.created_at).toLocaleDateString()}</p>
                        )}
                      </div>
                      <a
                        href={doc.url}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
