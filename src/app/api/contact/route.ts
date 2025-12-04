import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { Resend } from 'resend';

const schema = z.object({
  name: z.string().min(1),
  phone: z.string().min(10),
  email: z.string().email(),
  description: z.string().min(1),
  address: z.string().optional(),
  serviceType: z.string().optional(),
  budgetRange: z.string().optional(),
  timeframe: z.string().optional(),
  referralSource: z.string().optional(),
});

// Log envs for debugging (remove in prod)
console.log('Supabase URL loaded:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key loaded:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const resendApiKey = process.env.RESEND_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase envs – check Vercel settings');
  throw new Error('Supabase config missing');
}

const supabase = createClient(supabaseUrl, supabaseKey);
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = schema.parse(body);

    // Map camelCase to snake_case for Supabase (common schema issue)
    const insertData = {
      name: validated.name,
      phone: validated.phone,
      email: validated.email,
      address: validated.address || null,
      service_type: validated.serviceType || null,  // Snake case!
      budget_range: validated.budgetRange || null,
      timeframe: validated.timeframe || null,
      referral_source: validated.referralSource || null,
      description: validated.description,
      status: 'new' as const,
    };

    console.log('Inserting to Supabase:', insertData);  // Debug log

    const { data, error } = await supabase
      .from('contact_leads')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: `DB error: ${error.message}` }, { status: 500 });
    }

    // Send email (non-blocking)
    if (resend) {
      try {
        await resend.emails.send({
          from: 'noreply@burchcontracting.com',  // Update in Resend dashboard
          to: ['your-email@example.com'],  // YOUR EMAIL HERE!
          subject: 'New Burch Contracting Lead',
          html: `
            <h2>New Lead!</h2>
            <p><strong>Name:</strong> ${validated.name}</p>
            <p><strong>Phone:</strong> ${validated.phone}</p>
            <p><strong>Email:</strong> ${validated.email}</p>
            <p><strong>Message:</strong> ${validated.description}</p>
            <p>Full details saved in Supabase.</p>
            <p>Submitted: ${new Date().toLocaleString()}</p>
          `,
        });
        console.log('Email sent successfully');
      } catch (emailErr) {
        console.error('Email failed (continuing):', emailErr);
      }
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error('Full API error:', err);
    return NextResponse.json(
      { error: err instanceof z.ZodError ? 'Invalid form data' : 'Server error – please call us' },
      { status: err instanceof z.ZodError ? 400 : 500 }
    );
  }
}
