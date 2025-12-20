'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';

interface Stats {
  totalLeads: number;
  totalCustomers: number;
  totalQuotes: number;
  totalInvoices: number;
  pendingQuotes: number;
  unpaidInvoices: number;
  unreadMessages: number;
  recentActivity: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0,
    totalCustomers: 0,
    totalQuotes: 0,
    totalInvoices: 0,
    pendingQuotes: 0,
    unpaidInvoices: 0,
    unreadMessages: 0,
    recentActivity: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    } else if (user) {
      fetchStats();
    }
  }, [user, authLoading, router]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <Section padding="lg">
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </Section>
    );
  }

  const quickActions = [
    { label: 'Manage Leads', href: '/admin/leads', icon: 'Users', color: 'blue' },
    { label: 'Manage Customers', href: '/admin/customers', icon: 'UserCheck', color: 'green' },
    { label: 'Create Quote', href: '/admin/quotes/new', icon: 'FileText', color: 'purple' },
    { label: 'Create Invoice', href: '/admin/invoices/new', icon: 'Receipt', color: 'orange' },
    { label: 'View Messages', href: '/admin/messages', icon: 'Mail', color: 'red' },
    { label: 'Settings', href: '/admin/settings', icon: 'Settings', color: 'gray' },
  ];

  return (
    <>
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-300">Manage your business operations</p>
            </div>
            <Button variant="outline" size="md" href="/" className="border-white text-white hover:bg-white hover:text-gray-900">
              <Icon name="Home" size={20} />
              View Site
            </Button>
          </div>
        </div>
      </section>

      <Section background="gray" padding="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Leads</p>
                <p className="text-3xl font-bold">{stats.totalLeads}</p>
              </div>
              <Icon name="Users" size={40} className="opacity-80" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Total Customers</p>
                <p className="text-3xl font-bold">{stats.totalCustomers}</p>
              </div>
              <Icon name="UserCheck" size={40} className="opacity-80" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Pending Quotes</p>
                <p className="text-3xl font-bold">{stats.pendingQuotes}</p>
              </div>
              <Icon name="FileText" size={40} className="opacity-80" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm mb-1">Unpaid Invoices</p>
                <p className="text-3xl font-bold">{stats.unpaidInvoices}</p>
              </div>
              <Icon name="Receipt" size={40} className="opacity-80" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card padding="lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <a
                    key={action.href}
                    href={action.href}
                    className={`flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-${action.color}-500 hover:bg-${action.color}-50 transition-all group`}
                  >
                    <div className={`w-12 h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center group-hover:bg-${action.color}-500 transition-colors`}>
                      <Icon name={action.icon as any} size={24} className={`text-${action.color}-600 group-hover:text-white`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{action.label}</p>
                    </div>
                  </a>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <Card padding="lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Overview</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="Users" size={20} className="text-blue-600" />
                    <span className="text-sm text-gray-700">Total Leads</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.totalLeads}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="UserCheck" size={20} className="text-green-600" />
                    <span className="text-sm text-gray-700">Customers</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.totalCustomers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="FileText" size={20} className="text-purple-600" />
                    <span className="text-sm text-gray-700">Total Quotes</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.totalQuotes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="Receipt" size={20} className="text-orange-600" />
                    <span className="text-sm text-gray-700">Total Invoices</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.totalInvoices}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="Mail" size={20} className="text-red-600" />
                    <span className="text-sm text-gray-700">Unread Messages</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.unreadMessages}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
