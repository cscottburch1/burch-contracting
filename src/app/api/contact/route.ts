// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.body ? await req.json() : {};

    const { error } = await supabase.from('contact_leads').insert({
      name: body.name || 'Anonymous',
      phone: body.phone || '',
      email: body.email || '',
      address: body.address || null,
      service_type: body.serviceType || null,
      budget_range: body.budgetRange || null,
      timeframe: body.timeframe || null,
      referral_source: body.referralSource || null,
      description: body.description || '',
      status: 'new',
    });

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
