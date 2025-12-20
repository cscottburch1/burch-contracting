# Burch Contracting Website

A modern, production-ready marketing website for Burch Contracting built with Next.js, React, TypeScript, and Tailwind CSS.

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout with header, footer, SEO
│   ├── page.tsx             # Home page
│   ├── contact/
│   │   └── page.tsx         # Contact/Estimate request page
│   ├── crm/
│   │   ├── page.tsx         # CRM Dashboard
│   │   └── leads/[id]/
│   │       └── page.tsx     # Lead detail page
│   └── api/
│       ├── contact/
│       │   └── route.ts     # Contact form submission
│       └── crm/
│           ├── leads/
│           │   ├── route.ts              # Get all leads
│           │   └── [id]/
│           │       ├── route.ts          # Get/update single lead
│           │       ├── notes/route.ts    # Lead notes
│           │       └── activities/route.ts # Lead activities
│           └── statistics/
│               └── route.ts              # Pipeline statistics
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── layout/              # Layout components
│   ├── FeatureCard.tsx
│   ├── ServiceCard.tsx
│   ├── TestimonialCard.tsx
│   └── ProjectCard.tsx
├── config/
│   └── business.ts          # 🎯 BUSINESS CONFIGURATION FILE
├── types/
│   └── crm.ts               # TypeScript types for CRM
└── index.css                # Global styles with Tailwind
```

## 🎯 Customizing Business Information

**All business data is centralized in one file for easy updates:**

`src/config/business.ts`

### What You Can Edit:

- **Contact Information**: Phone, email, address, hours
- **Service Area**: Cities and regions served
- **Services List**: All service types and descriptions
- **Features**: Company highlights (Licensed, Communication, etc.)
- **Testimonials**: Customer reviews and ratings
- **Projects**: Portfolio items
- **SEO Settings**: Page titles, descriptions, keywords

### Example:

```typescript
// Update phone number
contact: {
  phone: "(YOUR) NEW-NUMBER",
  email: "your@email.com",
  ...
}

// Update service area
serviceArea: {
  locations: ["Your City", "Nearby Town", "County Name"]
}
```

## Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Visit http://localhost:3000

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## Features

### Pages Included
- ✅ **Home Page** - Hero, features, services overview, testimonials
- ✅ **Contact Page** - Full estimate request form with validation
- ✅ **CRM Dashboard** (`/crm`) - Complete lead management system with statistics
- ✅ **Lead Detail Pages** (`/crm/leads/[id]`) - Individual lead tracking with notes and activities
- 📝 Services, About, and Projects pages ready to be added

### Functionality
- ✅ Contact form with validation
- ✅ Form submissions stored in Supabase database
- ✅ **Full CRM Integration**:
  - Lead status pipeline (New → Contacted → Qualified → Proposal → Won/Lost)
  - Priority levels (Low, Medium, High, Urgent)
  - Estimated value tracking for pipeline forecasting
  - Team member assignment
  - Notes and communication tracking
  - Automatic activity logging
  - Search and filter capabilities
  - Real-time statistics dashboard
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ SEO optimized with meta tags and JSON-LD schema
- ✅ Accessible with skip-to-content and ARIA attributes

### Database
Complete CRM database with Supabase:
- **Table: `contact_leads`** - Enhanced with CRM fields (priority, estimated_value, assigned_to, etc.)
- **Table: `lead_notes`** - Track all communications and notes per lead
- **Table: `lead_activities`** - Automatic activity logging for status changes and interactions
- **View: `lead_statistics`** - Real-time pipeline analytics and reporting
- **Triggers**: Auto-log status changes and update timestamps
- Row Level Security enabled (currently allows public inserts from contact form, service role for CRM)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Deployment Ready**: Vercel, Netlify, or any Node.js host

## Color Palette

Based on the existing Burch Contracting brand:
- **Primary Blue**: #2235dd (buttons, accents)
- **Dark Navy**: #05060f, #131739 (headers, text)
- **Light Backgrounds**: #f0f1fd, #e4e7fd
- **White & Grays**: Clean, professional spacing

## Next Steps

### Additional Pages to Create:
1. **Services Page** (`/services`) - Detailed service descriptions
2. **About Page** (`/about`) - Company story and values
3. **Projects Page** (`/projects`) - Portfolio gallery with filters

### CRM Enhancements:
- **Add Authentication**: Implement Supabase Auth to secure CRM access
- **Email Integration**: Send emails directly from CRM
- **Calendar Integration**: Schedule meetings and follow-ups
- **Pipeline Visualization**: Kanban board view of lead pipeline
- **Advanced Reporting**: Charts, graphs, and export capabilities
- **Lead Scoring**: Automatic lead qualification scoring
- **Email Notifications**: Alerts for new leads and status changes
- **Document Attachments**: Upload files to leads (proposals, contracts)

### Website Enhancements:
- Add real project images (replace placeholder emojis)
- Connect email notifications for form submissions
- Add Google Analytics
- Implement blog functionality
- Add more service areas or locations
- Create Services, About, and Projects pages

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## CRM Usage

### Accessing the CRM
Navigate to `/crm` to access the CRM dashboard. From there you can:
- View all leads with statistics
- Search and filter leads by status
- Click on any lead to view full details
- Update lead status, priority, and estimated value
- Add notes to track communications
- View automatic activity timeline

### For Detailed CRM Documentation
See `CRM_DOCUMENTATION.md` for:
- Complete feature list
- Database schema details
- API endpoint documentation
- Usage guide and best practices
- Security recommendations
- Future enhancement ideas

## Support

All components are TypeScript typed and include clear prop interfaces. The codebase follows Next.js and React best practices for maintainability.

---

Built with ❤️ for Burch Contracting
