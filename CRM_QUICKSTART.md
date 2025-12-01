# CRM Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Access the CRM
Navigate to: **http://localhost:3000/crm** (or your deployed URL + `/crm`)

You'll see the CRM dashboard with:
- 📊 Statistics cards (Total Leads, Pipeline Value, New Leads, Won Deals)
- 🔍 Search and filter bar
- 📋 Complete lead list in a table

### 2. View Your First Lead
When someone submits the contact form at `/contact`, they automatically appear in the CRM as a **"New"** lead.

To view lead details:
1. Click the **"View"** button on any lead
2. You'll see the full lead profile with all contact info and project details

### 3. Update Lead Status
Follow your sales process by moving leads through the pipeline:

**New** → **Contacted** → **Qualified** → **Proposal** → **Negotiation** → **Won** or **Lost**

To update:
1. Open a lead detail page
2. Click **"Edit Lead"** button
3. Change the **Status** dropdown
4. Click **"Save Changes"**
5. The change is automatically logged in the activity timeline

### 4. Add Notes to a Lead
Track all communications:

1. Scroll to the **"Notes"** section on the lead detail page
2. Type your note (e.g., "Called customer, left voicemail")
3. Check **"Mark as important"** for critical information
4. Click **"Add Note"**

Notes appear with newest first and important notes are highlighted.

### 5. Track Lead Value
Set expected revenue for pipeline forecasting:

1. Click **"Edit Lead"**
2. Enter amount in **"Estimated Value"** field (e.g., 5000 for $5,000)
3. Save changes
4. Dashboard statistics automatically update

### 6. Set Priority Levels
Flag urgent leads:

1. Click **"Edit Lead"**
2. Change **"Priority"** dropdown (Low, Medium, High, Urgent)
3. Save changes
4. Urgent leads appear with red badge in the main list

### 7. Assign Leads to Team Members
Distribute work across your team:

1. Click **"Edit Lead"**
2. Enter name in **"Assigned To"** field
3. Save changes
4. Filter by assigned team member in the main dashboard

## 🎯 Common Workflows

### New Lead Comes In
1. Lead automatically appears in CRM with "New" status
2. Assign to a team member
3. Set priority based on project size/urgency
4. Add estimated value if known

### Making Contact
1. Open lead detail page
2. Use **"Call Lead"** or **"Send Email"** quick action buttons
3. After contact, add a note describing the conversation
4. Update status to **"Contacted"**

### Sending a Proposal
1. Create your proposal (outside CRM)
2. Add note: "Sent proposal for $X on [date]"
3. Enter estimated value if not already set
4. Update status to **"Proposal"**

### Closing a Deal
1. Update status to **"Won"**
2. Add final note with project details
3. Lead moves to closed won - tracked in statistics

### Lost Opportunity
1. Update status to **"Lost"**
2. Add note explaining why (valuable for future improvements)

## 📊 Using the Dashboard

### Filter Leads
- **By Status**: Use dropdown to show only New, Contacted, etc.
- **By Search**: Type name, email, or phone number
- **Combined**: Use both filters together

### Read Statistics
- **Total Leads**: All leads ever submitted
- **Total Value**: Sum of all estimated values
- **New Leads**: Leads waiting for initial contact
- **Won Deals**: Successfully closed projects

### Sort Leads
Leads are automatically sorted by date created (newest first). You can click any lead to view details.

## 💡 Pro Tips

1. **Be Consistent**: Always update status when you take action
2. **Add Notes Liberally**: Track every interaction - emails, calls, meetings
3. **Use Important Flag**: Mark notes with key decisions or customer requirements
4. **Set Estimated Values**: Helps track pipeline health and forecast revenue
5. **Check Daily**: Review "New" leads every morning to stay responsive
6. **Use Priority**: High/Urgent tags help focus on hot leads
7. **Track Loss Reasons**: Learn from lost deals to improve your process

## 🔐 Important: Add Authentication

⚠️ **Before deploying to production**: The CRM currently has no authentication, meaning anyone with the URL can access it.

Recommended next steps:
1. Implement Supabase Auth
2. Add login page
3. Restrict CRM routes to authenticated users
4. Set up role-based access (admin, sales, viewer)

See `CRM_DOCUMENTATION.md` for detailed security recommendations.

## 📱 Mobile Access

The CRM is fully responsive and works on:
- 📱 Phones (vertical scrolling for tables)
- 📱 Tablets (optimal layout)
- 💻 Desktop (full features)

Access from anywhere to manage leads on the go!

## ❓ Need Help?

### Common Issues

**Q: I don't see any leads**
A: Submit a test lead through the contact form at `/contact`

**Q: Status changes aren't saving**
A: Check your Supabase connection in `.env` file

**Q: Can't add notes**
A: Verify the lead ID is valid and Supabase is connected

**Q: Statistics not updating**
A: Refresh the page - stats calculate in real-time from database

### For More Information
- Full documentation: `CRM_DOCUMENTATION.md`
- General setup: `README.md`
- Supabase dashboard: Check your project settings

## 🎉 You're Ready!

Start managing your leads like a pro. The CRM will grow with your business and help you:
- Never lose a lead
- Track every interaction
- Forecast revenue
- Close more deals
- Build customer relationships

Happy selling! 💼
