import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
const schema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  description: z.string().min(1),
  address: z.string().optional(),
  serviceType: z.string().optional(),
  budgetRange: z.string().optional(),
  timeframe: z.string().optional(),
  referralSource: z.string().optional(),
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());

    const { error } = await supabase.from('contact_leads').insert({
      name: body.name,
      phone: body.phone,
      email: body.email,
      address: body.address || null,
      service_type: body.serviceType || null,
      budget_range: body.budgetRange || null,
      timeframe: body.timeframe || null,
      referral_source: body.referralSource || null,
      description: body.description,
      status: 'new',
    });

    if (error) throw error;

    // Email you
    if (resend) {
      await resend.emails.send({
        from: 'leads@burchcontracting.com',
        to: ['scott@burchcontracting'],          // ← PUT YOUR REAL EMAIL HERE
        subject: 'New Lead – Burch Contracting',
        html: `<h2>New Lead</h2><p>Name: ${body.name}<br>Phone: ${body.phone}<br>Email: ${body.email}<br>Message: ${body.description}</p>`,
      });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
