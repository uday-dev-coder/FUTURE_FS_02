/**
 * Seed Script — 100 Construction CRM Leads
 * Run: node seed.js
 * This will INSERT 100 leads into your MongoDB without deleting existing data.
 * To clear existing leads first, set CLEAR_EXISTING = true below.
 */

const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config();

const CLEAR_EXISTING = false; // change to true to wipe leads before seeding

// ─── Schema (inline so no import issues) ────────────────────────────────────
const noteSchema = new mongoose.Schema({ text: String, createdAt: { type: Date, default: Date.now } });
const Lead = mongoose.model('Lead', new mongoose.Schema({
  name:        { type: String, required: true },
  email:       String,
  phone:       { type: String, required: true },
  projectType: { type: String, enum: ['House Construction','Apartment Construction','Commercial Building','Renovation','Interior Design'], required: true },
  budget:      String,
  location:    String,
  source:      { type: String, enum: ['Website','Referral','Social Media','Walk-in','Phone Call','Other'], default: 'Website' },
  status:      { type: String, enum: ['New','Contacted','Site Visit Scheduled','Quotation Sent','Converted','Closed'], default: 'New' },
  notes:       [noteSchema],
}, { timestamps: true }));

// ─── Data pools ──────────────────────────────────────────────────────────────
const firstNames = [
  'Aarav','Aditya','Akash','Amit','Anand','Anjali','Ankit','Ankita','Arjun','Aryan',
  'Ashish','Bharat','Deepak','Deepika','Dinesh','Divya','Gaurav','Harish','Heena','Hitesh',
  'Isha','Jatin','Karan','Kavita','Kedar','Kirti','Lalit','Madhuri','Mahesh','Manish',
  'Meena','Mohan','Mukesh','Nalini','Narayan','Neha','Nilesh','Nisha','Omkar','Pallavi',
  'Pankaj','Paresh','Pooja','Pradeep','Prakash','Priya','Rahul','Rajesh','Ranjit','Rekha',
  'Rohit','Sachin','Sandeep','Sanjay','Sarita','Seema','Shilpa','Shyam','Sneha','Sudhir',
  'Sunil','Sunita','Suresh','Swati','Tejas','Uday','Uma','Varun','Vijay','Vikram',
  'Vinay','Vinita','Vivek','Yogesh','Yuvraj','Zara','Rashmi','Ravi','Siddharth','Shruti',
  'Tushar','Tanvi','Ramesh','Priyanka','Nikhil','Nidhi','Mayur','Mira','Lokesh','Lata',
  'Kunal','Kaveri','Jayesh','Jyoti','Girish','Geeta','Faisal','Ekta','Chirag','Chetan',
];
const lastNames = [
  'Sharma','Verma','Patel','Shah','Mehta','Gupta','Joshi','Nair','Reddy','Iyer',
  'Singh','Kumar','Rao','Desai','Agarwal','Bose','Chavan','Deshpande','Hegde','Jain',
  'Kapoor','Lal','Mishra','Naidu','Pandey','Patil','Raut','Sawant','Trivedi','Yadav',
];
const locations = [
  'Bengaluru, Karnataka','Mumbai, Maharashtra','Pune, Maharashtra','Hyderabad, Telangana',
  'Chennai, Tamil Nadu','Delhi, NCR','Ahmedabad, Gujarat','Surat, Gujarat','Jaipur, Rajasthan',
  'Kolkata, West Bengal','Indore, Madhya Pradesh','Nagpur, Maharashtra','Coimbatore, Tamil Nadu',
  'Kochi, Kerala','Vadodara, Gujarat','Bhopal, Madhya Pradesh','Lucknow, Uttar Pradesh',
  'Chandigarh, Punjab','Mysuru, Karnataka','Thiruvananthapuram, Kerala',
];
const projectTypes = [
  'House Construction','House Construction','House Construction',
  'Apartment Construction','Apartment Construction',
  'Commercial Building',
  'Renovation','Renovation',
  'Interior Design',
];
const sources = ['Website','Referral','Social Media','Walk-in','Phone Call','Other'];
const statuses = [
  'New','New','New','New','New','New','New','New','New','New','New','New','New','New','New','New','New', // ~17 New
  'Contacted','Contacted','Contacted','Contacted','Contacted','Contacted','Contacted','Contacted','Contacted','Contacted','Contacted','Contacted','Contacted','Contacted','Contacted','Contacted', // ~16 Contacted
  'Site Visit Scheduled','Site Visit Scheduled','Site Visit Scheduled','Site Visit Scheduled','Site Visit Scheduled','Site Visit Scheduled','Site Visit Scheduled','Site Visit Scheduled','Site Visit Scheduled','Site Visit Scheduled','Site Visit Scheduled','Site Visit Scheduled','Site Visit Scheduled','Site Visit Scheduled','Site Visit Scheduled', // ~15
  'Quotation Sent','Quotation Sent','Quotation Sent','Quotation Sent','Quotation Sent','Quotation Sent','Quotation Sent','Quotation Sent','Quotation Sent','Quotation Sent','Quotation Sent','Quotation Sent','Quotation Sent','Quotation Sent','Quotation Sent','Quotation Sent','Quotation Sent','Quotation Sent', // ~18
  'Converted','Converted','Converted','Converted','Converted','Converted','Converted','Converted','Converted','Converted','Converted','Converted','Converted','Converted','Converted','Converted','Converted','Converted','Converted','Converted', // ~20
  'Closed','Closed','Closed','Closed','Closed','Closed','Closed','Closed','Closed','Closed','Closed','Closed','Closed','Closed', // ~14
];
const budgets = [
  '500000','750000','1000000','1200000','1500000','2000000','2500000','3000000',
  '3500000','4000000','5000000','6000000','7500000','10000000','12000000','15000000',
];
const notesByStatus = {
  'New': [
    'Lead captured from online inquiry form.',
    'Customer showed interest in upcoming project.',
    'Received inquiry via WhatsApp message.',
    'Walk-in client, collected basic requirements.',
    'Referred by an existing customer.',
  ],
  'Contacted': [
    'Initial call done. Client is exploring options.',
    'Spoke for 20 minutes. Shared company brochure.',
    'Client asked for portfolio. Sent via email.',
    'Follow-up call scheduled for next week.',
    'Client interested but needs family discussion.',
  ],
  'Site Visit Scheduled': [
    'Site visit confirmed for Saturday 10 AM.',
    'Client available on weekends only.',
    'Scheduled site visit with senior engineer.',
    'Site visit booked. Client will bring architect.',
    'Visit confirmed. Need to prepare project samples.',
  ],
  'Quotation Sent': [
    'Detailed quotation sent via email.',
    'Quotation for ₹45L approved in principle.',
    'Client reviewed quote, negotiating on timeline.',
    'Revised quote sent after site measurement.',
    'Awaiting client approval on final quotation.',
  ],
  'Converted': [
    'Agreement signed. Project kick-off next month.',
    'Down payment received. Work order issued.',
    'Contract finalized. Team assigned to project.',
    '25% advance received. Materials procurement started.',
    'Project officially started. Site mobilization done.',
  ],
  'Closed': [
    'Client chose a different contractor.',
    'Budget constraints. Project postponed indefinitely.',
    'No response after multiple follow-ups.',
    'Client relocated. Project cancelled.',
    'Lost to competitor with lower quote.',
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const pick  = (arr) => arr[Math.floor(Math.random() * arr.length)];
const phone = () => `${pick(['9','8','7','6'])}${Array.from({length:9},()=>Math.floor(Math.random()*10)).join('')}`;
const email = (fn, ln) => `${fn.toLowerCase()}.${ln.toLowerCase()}${Math.floor(Math.random()*99)+1}@${pick(['gmail.com','yahoo.com','outlook.com','hotmail.com'])}`;
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d; };

// ─── Build 100 leads ──────────────────────────────────────────────────────────
function buildLeads() {
  // Shuffle statuses array so distribution is random but totals stay the same
  const shuffledStatuses = [...statuses].sort(() => Math.random() - 0.5);

  return Array.from({ length: 100 }, (_, i) => {
    const fn     = firstNames[i % firstNames.length];
    const ln     = pick(lastNames);
    const status = shuffledStatuses[i];
    const proj   = pick(projectTypes);
    const src    = pick(sources);
    const loc    = pick(locations);
    const bud    = pick(budgets);
    const createdAt = daysAgo(Math.floor(Math.random() * 180)); // within last 6 months

    const notePool = notesByStatus[status];
    const notes = [
      { text: pick(notePool), createdAt },
    ];
    // Some leads get a 2nd note
    if (Math.random() > 0.5) {
      notes.push({ text: pick(notePool), createdAt: new Date(createdAt.getTime() + 86400000 * Math.floor(Math.random()*5+1)) });
    }

    return {
      name: `${fn} ${ln}`,
      email: email(fn, ln),
      phone: phone(),
      projectType: proj,
      budget: bud,
      location: loc,
      source: src,
      status,
      notes,
      createdAt,
      updatedAt: createdAt,
    };
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🔗 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected.');

  if (CLEAR_EXISTING) {
    await Lead.deleteMany({});
    console.log('🗑️  Cleared existing leads.');
  }

  const leads = buildLeads();

  // Status summary
  const summary = {};
  leads.forEach(l => { summary[l.status] = (summary[l.status] || 0) + 1; });
  console.log('\n📊 Lead distribution:');
  Object.entries(summary).sort((a,b) => b[1]-a[1]).forEach(([s,c]) => console.log(`   ${s.padEnd(25)} ${c}`));
  console.log(`   ${'TOTAL'.padEnd(25)} ${leads.length}\n`);

  await Lead.insertMany(leads, { timestamps: false });
  console.log(`🎉 Successfully inserted ${leads.length} leads!\n`);
  console.log('You can now open your CRM to see all customers.');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => { console.error('❌ Seed failed:', err.message); process.exit(1); });
