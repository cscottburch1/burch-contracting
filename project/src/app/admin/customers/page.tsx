'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  created_at: string;
}

export default function AdminCustomersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    } else if (user) {
      fetchCustomers();
    }
  }, [user, authLoading, router]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/admin/customers');
      const data = await response.json();
      setCustomers(data.customers || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    !searchQuery ||
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <Section padding="lg">
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </Section>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button variant="outline" size="sm" href="/admin" className="border-white text-white hover:bg-white hover:text-gray-900 mb-4">
            <Icon name="ArrowLeft" size={16} />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Customer Management</h1>
          <p className="text-gray-300">View and manage all customers</p>
        </div>
      </section>

      <Section background="gray" padding="lg">
        <Card padding="lg">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-500">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 font-semibold text-gray-900">{customer.name}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{customer.email}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{customer.phone}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" href={`/admin/customers/${customer.id}`}>
                            <Icon name="Eye" size={16} />
                          </Button>
                          <Button variant="outline" size="sm" href={`/admin/quotes/new?customerId=${customer.id}`}>
                            <Icon name="FileText" size={16} />
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
