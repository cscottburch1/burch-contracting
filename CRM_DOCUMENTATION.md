# CRM Integration Documentation

## Overview

A complete Customer Relationship Management (CRM) system has been integrated into the Burch Contracting website to manage leads, track communications, and monitor the sales pipeline.

## Features

### 📊 Dashboard Overview
- **Lead Statistics**: Real-time metrics showing total leads, pipeline value, new leads, and won deals
- **Lead List**: Sortable, searchable table of all leads with filtering by status
- **Quick Actions**: Easy access to create new leads and view lead details

### 🔍 Lead Management
- **Lead Tracking**: Full lead lifecycle from initial contact to closed deal
- **Status Pipeline**:
  - New → Contacted → Qualified → Proposal → Negotiation → Won/Lost
- **Priority Levels**: Low, Medium, High, Urgent
- **Estimated Value**: Track potential revenue per lead
- **Assignment**: Assign leads to team members

### 📝 Communication Tracking
- **Notes System**: Add detailed notes to each lead
- **Important Notes**: Flag critical information
- **Activity Timeline**: Automatic tracking of all lead interactions
- **Status Changes**: Auto-logged when lead status is updated

### 🎯 Lead Details
Each lead detail page includes:
- Full contact information
- Project requirements and budget
- Editable fields for status, priority, value, and assignment
- Notes section with important flag option
- Activity timeline showing all interactions
- Quick action buttons (email, call)
- Lead source tracking

## Database Schema

### Tables Created

#### `contact_leads` (Enhanced)
New CRM fields added:
- `assigned_to` - Team member assigned to the lead
- `priority` - Lead priority level (low, medium, high, urgent)
- `estimated_value` - Projected deal value in dollars
- `scheduled_date` - Date for scheduled meetings/calls
- `last_contact_date` - Last time lead was contacted
- `source_url` - Originating page URL
- `tags` - Array of tags for categorization

#### `lead_notes`
Stores all notes associated with leads:
- `id` - Unique identifier
- `lead_id` - Foreign key to contact_leads
- `note_type` - Category of note (general, call, email, etc.)
- `content` - Note text
- `created_by` - Who added the note
- `created_at` - Timestamp
- `is_important` - Flag for important notes

#### `lead_activities`
Automatic activity logging:
- `id` - Unique identifier
- `lead_id` - Foreign key to contact_leads
- `activity_type` - Type of activity (status_change, note_added, etc.)
- `description` - Human-readable description
- `created_by` - Who performed the action
- `created_at` - Timestamp
- `metadata` - JSON data for additional context

#### `lead_statistics` (View)
Aggregate statistics by status:
- Lead count per status
- Average value per status
- Total pipeline value per status

## API Endpoints

### Lead Management

#### `GET /api/crm/leads`
Retrieve all leads
- Returns: Array of lead objects ordered by created_at DESC

#### `GET /api/crm/leads/[id]`
Get single lead details
- Returns: Lead object

#### `PATCH /api/crm/leads/[id]`
Update lead information
- Body: Partial lead object with fields to update
- Triggers automatic activity logging for status changes
- Returns: Updated lead object

### Notes Management

#### `GET /api/crm/leads/[id]/notes`
Get all notes for a lead
- Returns: Array of notes ordered by created_at DESC

#### `POST /api/crm/leads/[id]/notes`
Add a new note to a lead
- Body: `{ content, note_type?, is_important?, created_by? }`
- Automatically logs activity
- Returns: Created note object

### Activities

#### `GET /api/crm/leads/[id]/activities`
Get activity timeline for a lead
- Returns: Array of activities ordered by created_at DESC

### Statistics

#### `GET /api/crm/statistics`
Get aggregated lead statistics
- Returns: Statistics grouped by status

## Accessing the CRM

### URL Routes
- **Dashboard**: `/crm` - Main CRM interface with lead list and statistics
- **Lead Detail**: `/crm/leads/[id]` - Individual lead management page
- **Navigation**: CRM link added to main site navigation header

### No Authentication (Currently)
⚠️ **Important**: The CRM is currently accessible without authentication. For production use, you should:

1. Add authentication (Supabase Auth recommended)
2. Implement role-based access control
3. Restrict API routes to authenticated users
4. Add RLS policies for authenticated users only

## Usage Guide

### Managing Leads

1. **View All Leads**
   - Navigate to `/crm`
   - Use search bar to filter by name, email, or phone
   - Use status dropdown to filter by pipeline stage

2. **View Lead Details**
   - Click "View" button on any lead
   - Or navigate to `/crm/leads/[lead-id]`

3. **Update Lead Status**
   - Open lead detail page
   - Click "Edit Lead" button
   - Change status, priority, value, or assignment
   - Click "Save Changes"
   - Status changes are automatically logged in activity timeline

4. **Add Notes**
   - Open lead detail page
   - Scroll to Notes section
   - Type note in text area
   - Optionally check "Mark as important"
   - Click "Add Note"

5. **Track Activities**
   - Activities are automatically logged for:
     - Status changes
     - Notes added
     - Any lead modifications
   - View timeline in lead detail sidebar

### Understanding Lead Statuses

- **New**: Just submitted, not yet contacted
- **Contacted**: Initial contact made
- **Qualified**: Confirmed as viable opportunity
- **Proposal**: Quote/proposal sent
- **Negotiation**: Discussing terms/pricing
- **Won**: Deal closed successfully
- **Lost**: Deal did not close

### Using Priority Levels

- **Low**: Non-urgent, can wait
- **Medium**: Standard priority (default)
- **High**: Should be addressed soon
- **Urgent**: Requires immediate attention

## Automatic Features

### Status Change Tracking
Database trigger automatically:
- Logs all status changes
- Records old and new status
- Updates the `updated_at` timestamp
- Creates activity entry

### Activity Logging
Automatic logging for:
- Lead status changes
- Notes added to leads
- Any field modifications

## Future Enhancements

Consider adding:

### Authentication & Security
- [ ] Supabase Auth integration
- [ ] Role-based access (admin, sales, viewer)
- [ ] User management interface
- [ ] Secure API routes

### Features
- [ ] Email integration (send emails from CRM)
- [ ] Calendar integration for scheduled meetings
- [ ] Document attachments for leads
- [ ] Pipeline visualization (Kanban board)
- [ ] Advanced reporting and analytics
- [ ] Email templates for common responses
- [ ] Automated lead assignment rules
- [ ] Lead scoring system
- [ ] Export leads to CSV/Excel
- [ ] Integration with accounting software

### Notifications
- [ ] Email alerts for new leads
- [ ] Reminders for follow-ups
- [ ] Notifications when lead is assigned
- [ ] Digest emails for daily/weekly summaries

## Technical Details

### TypeScript Types
All CRM types defined in `/src/types/crm.ts`:
- `Lead` - Complete lead interface
- `LeadNote` - Note structure
- `LeadActivity` - Activity log entry
- `LeadStatus` - Union type of valid statuses
- `LeadPriority` - Union type of priority levels
- `ActivityType` - Union type of activity types

### Database Indexes
Optimized queries with indexes on:
- `contact_leads.status`
- `contact_leads.created_at`
- `contact_leads.assigned_to`
- `lead_notes.lead_id`
- `lead_activities.lead_id`

### RLS Policies
Current policies allow:
- Public insert for new leads (from contact form)
- Service role full access (for CRM operations)

**For production**, update to:
- Authenticated users only for CRM access
- Admin role for full CRUD
- Sales role for read and update assigned leads
- Viewer role for read-only access

## Integration with Contact Form

The existing contact form at `/contact` automatically:
- Creates new leads with status "new"
- Stores all form data in the CRM
- Makes leads immediately visible in CRM dashboard

No code changes needed - the integration is automatic!

## Troubleshooting

### No leads showing in CRM
- Check if any leads have been submitted through contact form
- Verify Supabase connection in `.env` file
- Check browser console for API errors

### Cannot update lead
- Check API route is accessible
- Verify lead ID is valid
- Check Supabase RLS policies allow updates

### Activities not logging
- Verify database trigger is created: `log_lead_status_change`
- Check if status is actually changing
- Review Supabase logs for errors

## Performance

The CRM is optimized for:
- Fast load times with indexed queries
- Efficient pagination (ready to add)
- Minimal re-renders with proper React state management
- Optimistic UI updates

For high-volume usage:
- Add pagination to lead list (currently loads all)
- Implement virtual scrolling for large lists
- Add caching layer (React Query recommended)
- Consider database connection pooling

---

**Built with**: Next.js 14, TypeScript, Supabase, Tailwind CSS
