'use client';

import React, { useMemo, useState } from 'react';

type FormState = {
  // Honeypot (bots fill it, humans don't)
  company: string;

  name: string;
  email: string;
  phone: string;
  address: string;
  serviceType: string;
  budgetRange: string;
  timeframe: string;
  referralSource: string;
  description: string;
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    company: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    serviceType: '',
    budgetRange: '',
    timeframe: '',
    referralSource: '',
    description: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return form.email.trim().length > 3 && form.description.trim().length > 5 && !submitting;
  }, [form.email, form.description, submitting]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    // Basic client-side validation (server still validates)
    if (!form.email.trim() || !form.description.trim()) {
      setErrorMsg('Please include your email and a brief description of your project.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Include all fields, including honeypot "company"
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        setErrorMsg(data?.error || 'Submission failed. Please try again.');
        setSubmitting(false);
        return;
      }

      setSuccessMsg('Thanks! Your request was received. We’ll follow up shortly.');
      setForm({
        company: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        serviceType: '',
        budgetRange: '',
        timeframe: '',
        referralSource: '',
        description: '',
      });
    } catch (err) {
      setErrorMsg('Network error. Please try again or call (864) 724-4600.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Contact Burch Contracting</h1>
        <p className="mt-2 text-gray-600">
          Tell us about your project. We’ll respond as soon as possible.
        </p>

        <div className="mt-8 rounded-xl border border-gray-200 p-6 shadow-sm">
          {successMsg && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-green-800">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot field (hidden). Bots fill it; humans never see it. */}
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={(e) => update('company', e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-900">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-900">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-900">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
                  placeholder="(864) 724-4600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-900">Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
                  placeholder="City, State"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-900">Service Type</label>
                <select
                  name="serviceType"
                  value={form.serviceType}
                  onChange={(e) => update('serviceType', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
                >
                  <option value="">Select…</option>
                  <option value="Kitchen Remodel">Kitchen Remodel</option>
                  <option value="Bathroom Remodel">Bathroom Remodel</option>
                  <option value="Room Addition">Room Addition</option>
                  <option value="Basement Finish">Basement Finish</option>
                  <option value="Handyman / Repairs">Handyman / Repairs</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-900">Budget Range</label>
                <select
                  name="budgetRange"
                  value={form.budgetRange}
                  onChange={(e) => update('budgetRange', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
                >
                  <option value="">Select…</option>
                  <option value="Under $10k">Under $10k</option>
                  <option value="$10k–$25k">$10k–$25k</option>
                  <option value="$25k–$50k">$25k–$50k</option>
                  <option value="$50k–$100k">$50k–$100k</option>
                  <option value="$100k+">$100k+</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-900">Timeframe</label>
                <select
                  name="timeframe"
                  value={form.timeframe}
                  onChange={(e) => update('timeframe', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
                >
                  <option value="">Select…</option>
                  <option value="ASAP">ASAP</option>
                  <option value="1–3 months">1–3 months</option>
                  <option value="3–6 months">3–6 months</option>
                  <option value="6+ months">6+ months</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-900">How did you hear about us?</label>
                <select
                  name="referralSource"
                  value={form.referralSource}
                  onChange={(e) => update('referralSource', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
                >
                  <option value="">Select…</option>
                  <option value="Google">Google</option>
                  <option value="Referral">Referral</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Yard Sign">Yard Sign</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-900">
                Project Description <span className="text-red-600">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                className="min-h-[140px] w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900"
                placeholder="Tell us what you want to build, repair, or remodel…"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Prefer to call? <a className="underline" href="tel:8647244600">(864) 724-4600</a>
              </p>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Sending…' : 'Send Request'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
