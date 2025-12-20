# 🚀 Quick Start - Burch Contracting Website

## For The Impatient

### 3-Step Setup:

**1. Set Up Your Database**

**🐧 Linux/Ubuntu Server (No cPanel)?** → See `LINUX_MYSQL_SETUP.md`

**🌐 Hostinger cPanel/GUI?** → See `MYSQL_SETUP_GUIDE.md`

```bash
# Run these 3 SQL files in order:
- mysql_001_create_contact_leads.sql
- mysql_002_create_lead_notes.sql  
- mysql_003_create_lead_activities.sql
```

**2. Configure Your Environment**
```bash
# Create .env.local file with:
DB_HOST=your-mysql-host-from-hostinger
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
```

**3. Update Your Business Info**
```bash
# Edit: src/config/business.ts
# Change: name, phone, email, services, testimonials, projects
```

### Then:
```bash
npm install
npm run dev
```

Visit:
- http://localhost:3000 → Home page
- http://localhost:3000/contact → Contact form
- http://localhost:3000/admin → Admin dashboard

---

## Key URLs

| Page | URL |
|------|-----|
| **Home** | `/` |
| **Contact Form** | `/contact` |
| **Admin Dashboard** | `/admin` |
| **Lead Detail** | `/admin/leads/{id}` |

---

## Admin Features

- 📊 Dashboard with statistics
- 🔍 Search and filter leads
- 📝 Add notes to leads
- 📋 Track activities
- 👤 Assign to team members
- 💰 Track estimated values
- 🎯 Set priorities
- 📅 Schedule follow-ups

---

## File to Customize

**`src/config/business.ts`** - Everything about your business:
- Company name
- Phone/email  
- Service area
- Services list
- Features
- Testimonials
- Projects

---

## Deployment

### To Vercel (Easiest):
1. Push to GitHub
2. Connect repo to Vercel
3. Add `.env` variables in Vercel settings
4. Done!

### To Hostinger VPS:
1. SSH into server
2. Clone your repo
3. Run `npm install && npm run build`
4. Use PM2: `pm2 start npm -- start`

---

## Files Created/Modified

### New Files:
- ✅ `src/lib/mysql.ts` - Database utility
- ✅ `src/app/admin/page.tsx` - Admin dashboard
- ✅ `src/app/admin/leads/[id]/page.tsx` - Lead detail
- ✅ `MYSQL_SETUP_GUIDE.md` - Full setup instructions
- ✅ `MIGRATION_COMPLETE.md` - What changed

### Updated Files:
- ✅ All API routes (now use MySQL)
- ✅ Header navigation (added Admin link)
- ✅ package.json (removed Supabase, added MySQL)

---

## Common Issues

**"Error: Cannot find module 'mysql2'"**  
→ Run `npm install`

**"Error: Connection refused"**  
→ Check DB_HOST, DB_USER, DB_PASSWORD in .env

**"Unknown database"**  
→ Make sure database name in .env matches what you created

**No leads showing in admin**  
→ Did you run the migration scripts? Submit a test form.

---

## Next Steps

1. ✅ Set up MySQL database (5 min)
2. ✅ Configure .env (2 min)
3. ✅ Update business.ts (15 min)
4. ✅ Test locally (5 min)
5. ✅ Deploy (10 min)

**Total: ~40 minutes to live site**

---

## Need More Details?

- Full setup guide: See `MYSQL_SETUP_GUIDE.md`
- What changed: See `MIGRATION_COMPLETE.md`
- Database schema: See `/supabase/migrations/mysql_*.sql` files

---

## Success = 🎉

When you see leads appearing in your admin dashboard after submitting the contact form, you're done!
