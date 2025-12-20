# Burch Contracting Website - MySQL Setup & Deployment Guide

## ✅ Changes Made

### 1. **Removed Supabase Dependencies**
- Removed `@supabase/supabase-js` from package.json
- Added `mysql2` package for direct MySQL connections
- Created `/src/lib/mysql.ts` for database utility functions

### 2. **Converted All APIs to MySQL**
Updated the following API routes to use MySQL instead of Supabase:
- `/api/contact` - Contact form submission
- `/api/crm/leads` - Get all leads
- `/api/crm/leads/[id]` - Get/update single lead
- `/api/crm/leads/[id]/notes` - Lead notes
- `/api/crm/leads/[id]/activities` - Lead activities
- `/api/crm/statistics` - Lead statistics

### 3. **Reorganized CRM to Admin Panel**
- Created `/admin` page with full CRM dashboard
- Created `/admin/leads/[id]` for lead detail view
- Updated navigation header to show "Admin" link instead of "CRM"
- All functionality remains the same, just moved to admin section

### 4. **Created MySQL Migration Files**
Three migration scripts in `/supabase/migrations/`:
- `mysql_001_create_contact_leads.sql` - Main leads table
- `mysql_002_create_lead_notes.sql` - Lead notes table
- `mysql_003_create_lead_activities.sql` - Lead activities table

---

## 🚀 Deployment Steps

### Step 1: Set Up Hostinger MySQL Database

1. Log in to your **Hostinger control panel**
2. Go to **Databases** section
3. Create a new MySQL database:
   - **Database Name**: `burch_contracting` (or your choice)
   - **Username**: Create a new MySQL user
   - **Password**: Set a strong password
   - Note these credentials - you'll need them

### Step 2: Run Migration Scripts

1. In Hostinger, go to **phpMyAdmin** or use **MySQL client**
2. Select your database
3. Run each migration script in order:
   - Copy contents of `mysql_001_create_contact_leads.sql`
   - Paste into SQL editor and execute
   - Repeat for `mysql_002_create_lead_notes.sql`
   - Repeat for `mysql_003_create_lead_activities.sql`

**Alternative**: Use MySQL command line directly:
```bash
mysql -h your-host -u your-user -p your-database < mysql_001_create_contact_leads.sql
mysql -h your-host -u your-user -p your-database < mysql_002_create_lead_notes.sql
mysql -h your-host -u your-user -p your-database < mysql_003_create_lead_activities.sql
```

### Step 3: Configure Environment Variables

1. Update your `.env` file (or `.env.local` for development):
```env
# Hostinger MySQL Configuration
DB_HOST=your-hostinger-mysql-host
DB_USER=your-mysql-username
DB_PASSWORD=your-mysql-password
DB_NAME=burch_contracting

NODE_ENV=production
```

**How to find your Hostinger MySQL host:**
- It's typically listed in Hostinger under Database settings
- Format: `mysql123.hostinger.com` or similar

### Step 4: Install Dependencies

```bash
npm install
```

This will install the new `mysql2` package and remove Supabase.

### Step 5: Update Business Configuration (IMPORTANT)

Edit `/src/config/business.ts` with your actual business info:

```typescript
export const businessConfig = {
  name: "Burch Contracting",  // ← Change to your company name
  tagline: "Your tagline here",
  
  contact: {
    phone: "(555) 123-4567",   // ← Update with your phone
    email: "info@example.com",   // ← Update with your email
    address: "123 Main Street",  // ← Update with your address
    city: "YourCity",
    state: "ST",
    zip: "12345",
  },
  
  // ... update services, testimonials, projects, etc.
};
```

### Step 6: Test Locally

```bash
npm run dev
```

Visit http://localhost:3000 and test:
- Home page loads correctly
- Contact form works and can be submitted
- Admin panel is accessible at `/admin`
- Lead table displays submitted leads
- Click "View" on a lead to see detail page

### Step 7: Build for Production

```bash
npm run build
```

Ensure there are no errors.

### Step 8: Deploy to Your Hosting

**Option A: Deploy to Vercel (Easiest)**
1. Push code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel project settings
4. Vercel will auto-deploy on every push

**Option B: Deploy to Hostinger (VPS/Managed Hosting)**
1. Connect to your Hostinger server via SSH
2. Clone your GitHub repository
3. Install Node.js (if not already installed)
4. Run `npm install && npm run build`
5. Use PM2 or similar to run the Node.js application
6. Set up Nginx reverse proxy to your Next.js app

**Option C: Manual Deployment**
1. Run `npm run build`
2. Upload the project to your hosting
3. Start the application: `npm start`

---

## 📋 Database Schema Overview

### contact_leads table
- `id` - Auto-increment primary key
- `name`, `phone`, `email` - Contact information
- `address`, `service_type`, `budget_range`, `timeframe` - Project details
- `description` - Project description
- `status` - Lead status (new, contacted, qualified, proposal, negotiation, won, lost)
- `priority` - Priority level (low, medium, high, urgent)
- `estimated_value` - Revenue estimate
- `assigned_to` - Team member assignment
- `last_contact_date`, `scheduled_date` - Tracking dates
- `created_at`, `updated_at` - Timestamps

### lead_notes table
- Links to contact_leads via `lead_id`
- Stores all communication notes
- Supports marking important notes

### lead_activities table
- Links to contact_leads via `lead_id`
- Auto-logs all status changes and activities
- Stores metadata as JSON

---

## 🔐 Security Notes

1. **Environment Variables**: Never commit `.env` to git. Add to `.gitignore`
2. **Database Credentials**: Keep database username/password secure
3. **Connection Pooling**: The mysql2 library uses connection pooling by default
4. **Use HTTPS**: Ensure your deployment uses HTTPS in production

---

## ✅ What's Ready to Go

- [x] Marketing website (home page)
- [x] Contact/estimate form (saves to MySQL)
- [x] Admin dashboard (at `/admin`)
- [x] Lead management system
- [x] Lead notes and activity tracking
- [x] Responsive design
- [x] SEO optimized
- [x] All business config centralized in one file

---

## 🆘 Troubleshooting

### "Error: Cannot find module 'mysql2'"
**Solution**: Run `npm install`

### "Error: ECONNREFUSED - Connection refused"
**Solution**: 
- Check your DB_HOST, DB_USER, DB_PASSWORD are correct
- Verify database exists and user has access
- Check Hostinger firewall allows connections from your IP

### "Error: Unknown database"
**Solution**: Create the database in Hostinger and update DB_NAME in .env

### Admin page showing no leads
**Solution**:
- Verify migration scripts were run
- Check that contact_leads table exists
- Submit a test form through `/contact`

---

## 📞 Support URLs

- Hostinger Help: https://support.hostinger.com/
- Next.js Docs: https://nextjs.org/docs
- MySQL Docs: https://dev.mysql.com/doc/
- mysql2 Docs: https://github.com/sidorares/node-mysql2

---

## 📝 Next Steps

1. ✅ Set up Hostinger MySQL database
2. ✅ Run migration scripts
3. ✅ Configure .env with your credentials
4. ✅ Update /src/config/business.ts with your info
5. ✅ Test locally with `npm run dev`
6. ✅ Deploy to production

Your website is now ready to track leads with your own MySQL database!
