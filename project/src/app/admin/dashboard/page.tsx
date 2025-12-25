import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

async function getSession() {
  const cookieStore = cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === 'authenticated'; // Simple check
}

export default async function AdminDashboard() {
  const isAuth = await getSession();
  if (!isAuth) redirect('/admin');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
        <p className="text-lg mb-4">Welcome! You are logged in.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="/crm" className="bg-blue-600 text-white p-6 rounded-lg text-center hover:bg-blue-700">
            <h2 className="text-2xl">CRM / Leads</h2>
          </a>
          <div className="bg-gray-200 p-6 rounded-lg text-center">
            <h2 className="text-2xl">Analytics (Coming)</h2>
          </div>
          <div className="bg-gray-200 p-6 rounded-lg text-center">
            <h2 className="text-2xl">Settings (Coming)</h2>
          </div>
        </div>
        <form action="/api/admin/logout" method="post" className="mt-8">
          <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}

