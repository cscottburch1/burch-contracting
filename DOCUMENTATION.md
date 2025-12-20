# 📚 Burch Contracting Website - Documentation Index

## 🚀 Getting Started

**Choose your setup guide based on your hosting:**

### Ubuntu/Linux Server (Command Line)
**→ Read: [`LINUX_MYSQL_SETUP.md`](LINUX_MYSQL_SETUP.md)**
- Direct MySQL setup via SSH
- PM2 for production deployment
- Nginx reverse proxy setup
- SSL/HTTPS with Let's Encrypt

### Hostinger with cPanel
**→ Read: [`MYSQL_SETUP_GUIDE.md`](MYSQL_SETUP_GUIDE.md)**
- phpMyAdmin GUI access
- Hostinger database setup
- Vercel deployment
- Hostinger VPS deployment

### Quick Reference (5 minutes)
**→ Read: [`QUICKSTART.md`](QUICKSTART.md)**
- Essential steps only
- Key URLs and commands
- File to customize

---

## 📖 Complete Documentation

### 1. Migration Information
| Document | Purpose |
|----------|---------|
| [`MIGRATION_COMPLETE.md`](MIGRATION_COMPLETE.md) | What changed from Supabase to MySQL |
| [`src/config/business.ts`](src/config/business.ts) | Business information configuration |

### 2. Database Schema
| Document | Purpose |
|----------|---------|
| [`supabase/migrations/mysql_001_create_contact_leads.sql`](supabase/migrations/mysql_001_create_contact_leads.sql) | Leads table (main) |
| [`supabase/migrations/mysql_002_create_lead_notes.sql`](supabase/migrations/mysql_002_create_lead_notes.sql) | Notes table |
| [`supabase/migrations/mysql_003_create_lead_activities.sql`](supabase/migrations/mysql_003_create_lead_activities.sql) | Activities table |

### 3. Environment Configuration
Create `.env.local` in your project root:
```env
DB_HOST=localhost
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
NODE_ENV=production
```

---

## 📁 Project Structure

```
burch-contracting/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home page
│   │   ├── contact/
│   │   │   └── page.tsx          # Contact form
│   │   ├── admin/                # Admin panel (CRM)
│   │   │   ├── page.tsx          # Dashboard
│   │   │   └── leads/[id]/
│   │   │       └── page.tsx      # Lead detail
│   │   ├── api/
│   │   │   ├── contact/
│   │   │   │   └── route.ts      # Contact form API
│   │   │   └── crm/
│   │   │       ├── leads/
│   │   │       ├── statistics/
│   │   │       └── ...
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx        # Navigation
│   │   │   └── Footer.tsx        # Footer
│   │   └── ui/                   # Reusable components
│   ├── config/
│   │   └── business.ts           # ⭐ CUSTOMIZE THIS
│   ├── lib/
│   │   └── mysql.ts              # Database utility
│   └── types/
│       └── crm.ts                # TypeScript types
├── supabase/migrations/
│   ├── mysql_001_create_contact_leads.sql
│   ├── mysql_002_create_lead_notes.sql
│   └── mysql_003_create_lead_activities.sql
├── package.json
├── .env.local                    # ← Create this
├── QUICKSTART.md                 # 5-min setup
├── LINUX_MYSQL_SETUP.md          # Linux/Ubuntu guide
├── MYSQL_SETUP_GUIDE.md          # Hostinger guide
├── MIGRATION_COMPLETE.md         # Technical details
└── README.md                     # Original project README
```

---

## 🎯 Core Features

### Marketing Website
- **Home Page** - Hero section, features, services, testimonials, projects
- **Contact Form** - Lead capture with validation
- **Responsive Design** - Mobile-first approach
- **SEO Optimized** - Meta tags, JSON-LD schema

### Admin Panel (CRM)
- **Dashboard** - Statistics at `/admin`
- **Lead Management** - View all leads with search/filter
- **Lead Details** - Full profile with notes and activities
- **Communications** - Track notes and status changes
- **Team Assignment** - Assign leads to team members
- **Priority Tracking** - Low, Medium, High, Urgent
- **Revenue Tracking** - Estimated value per lead

---

## 🔗 Important URLs

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Marketing page |
| Contact | `/contact` | Lead capture form |
| Admin | `/admin` | CRM dashboard |
| Lead Detail | `/admin/leads/{id}` | Individual lead |

---

## 📋 Setup Checklist

### Phase 1: Database Setup
- [ ] MySQL installed on server
- [ ] Database created
- [ ] Database user created
- [ ] Migration scripts executed (3 files)
- [ ] Tables verified

### Phase 2: Application Configuration
- [ ] `.env.local` created with database credentials
- [ ] `src/config/business.ts` customized with your info
- [ ] `npm install` completed
- [ ] `npm run build` successful

### Phase 3: Testing
- [ ] Local dev server runs: `npm run dev`
- [ ] Home page loads at http://localhost:3000
- [ ] Contact form works at /contact
- [ ] Admin dashboard accessible at /admin
- [ ] Test form submission saves to database

### Phase 4: Deployment
- [ ] Choose hosting (Vercel, VPS, etc.)
- [ ] Deploy application
- [ ] Test on live server
- [ ] Configure domain and SSL
- [ ] Monitor for errors

---

## 🛠️ Common Tasks

### Update Business Information
Edit `src/config/business.ts`:
- Company name, phone, email
- Address and service area
- Services offered
- Testimonials
- Portfolio/projects

Then rebuild:
```bash
npm run build
npm start
```

### View Submitted Leads
1. Go to `/admin`
2. Check the lead table
3. Click "View" on any lead to see details

### Add Notes to a Lead
1. Open lead detail page
2. Scroll to "Notes" section
3. Type your note
4. Click "Add Note"

### Change Lead Status
1. Open lead detail page
2. Click "Edit Lead"
3. Change status dropdown
4. Click "Save Changes"

---

## 🐛 Troubleshooting

### Database Connection Issues
See: [`LINUX_MYSQL_SETUP.md`](LINUX_MYSQL_SETUP.md#troubleshooting) (Linux)  
See: [`MYSQL_SETUP_GUIDE.md`](MYSQL_SETUP_GUIDE.md) (Hostinger)

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Leads Not Showing in Admin
1. Verify migration scripts were run: `SHOW TABLES;`
2. Submit a test form
3. Check database: `SELECT COUNT(*) FROM contact_leads;`

### Form Submissions Not Saving
1. Check `.env.local` credentials
2. Verify database connection: `mysql -u user -p -e "USE database; SHOW TABLES;"`
3. Check app logs for errors

---

## 🚀 Deployment Options

### Vercel (Easiest)
1. Push code to GitHub
2. Connect repo to Vercel
3. Add `.env` variables
4. Automatic deploys on push

**Requires:** GitHub account, Vercel account  
**Pros:** Automatic scaling, free tier available  
**Cons:** Requires external database

### Ubuntu/Linux VPS
1. SSH into server
2. Clone repository
3. Set up MySQL
4. Configure `.env.local`
5. Run with PM2
6. Set up Nginx proxy

**Requires:** Server with SSH access  
**Pros:** Full control, all-in-one setup  
**Cons:** Manual management

### Hostinger
1. Use Hostinger's node.js hosting
2. Set up MySQL from control panel
3. Deploy via SFTP or Git
4. Configure environment variables

**Requires:** Hostinger account  
**Pros:** Easy integration  
**Cons:** Limited customization

---

## 📊 Database Tables

### contact_leads
Stores all submitted leads from contact form
- id, name, email, phone, address
- service_type, budget_range, timeframe
- status (new/contacted/qualified/proposal/negotiation/won/lost)
- priority (low/medium/high/urgent)
- estimated_value, assigned_to
- created_at, updated_at

### lead_notes
Communication notes for each lead
- id, lead_id, content
- is_important (flag)
- created_by, created_at

### lead_activities
Auto-logged activity timeline
- id, lead_id, activity_type
- description, metadata (JSON)
- created_by, created_at

---

## 🔐 Security

### Environment Variables
- ✅ Keep `.env.local` out of git (already in `.gitignore`)
- ✅ Use strong database password
- ✅ Don't share database credentials
- ✅ Enable SSL/HTTPS in production

### Database Security
- ✅ MySQL user should NOT be root
- ✅ Limit user privileges to single database
- ✅ Use connection pooling (enabled by default)
- ✅ Regular backups recommended

### Application Security
- ✅ Form validation on client and server
- ✅ SQL injection prevention (using parameterized queries)
- ✅ Proper error handling (no sensitive info in errors)
- ✅ HTTPS in production (recommended)

---

## 📞 Support Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **MySQL Documentation**: https://dev.mysql.com/doc/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **PM2 Guide**: https://pm2.keymetrics.io/docs
- **Nginx Configuration**: https://nginx.org/en/docs/

---

## 📝 File Descriptions

| File | Description |
|------|-------------|
| **QUICKSTART.md** | 5-minute quick reference |
| **LINUX_MYSQL_SETUP.md** | Complete Ubuntu/Linux setup guide |
| **MYSQL_SETUP_GUIDE.md** | Hostinger cPanel setup guide |
| **MIGRATION_COMPLETE.md** | Technical migration details |
| **src/config/business.ts** | ⭐ Customize business info here |
| **src/lib/mysql.ts** | Database connection utility |
| **.env.local** | Create this with database credentials |

---

## ✅ You're Ready!

1. Choose your setup guide (Linux or Hostinger)
2. Follow the step-by-step instructions
3. Test locally
4. Deploy to your server
5. Update your business info
6. Start collecting leads!

Questions? Each guide has troubleshooting sections. 🚀
