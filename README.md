# 🏗️ BuildTrack CRM — Construction Lead Management System

A full-stack mini CRM built for construction companies to manage client inquiries, track lead pipelines, and convert leads into projects.

---


📸 Screenshots
<img width="1890" height="886" alt="Login-Page" src="https://github.com/user-attachments/assets/b61ad834-8fb0-4f61-8298-7a54e126cdc0" />
<img width="1886" height="910" alt="Dashboard" src="https://github.com/user-attachments/assets/926aee45-2dfd-4e56-ba82-4565d37c1e9b" />
<img width="1882" height="895" alt="Leads" src="https://github.com/user-attachments/assets/5435e408-37f8-4f78-9d8b-6973090b31d5" />
<img width="1895" height="891" alt="Add New Lead" src="https://github.com/user-attachments/assets/4f28ce4f-cf36-4190-9238-34de39d48a08" />
<img width="1900" height="781" alt="Analytics Report" src="https://github.com/user-attachments/assets/bbfab5c8-d2e6-4025-89f6-fb261555b730" />

---

## ✨ Features

- **Lead Management** — Add, view, edit, delete leads with full client details
- **Lead Status Tracking** — Pipeline from New → Contacted → Site Visit → Quotation → Converted/Closed
- **Follow-Up Notes** — Time-stamped notes for every client interaction
- **Admin Authentication** — JWT-secured login, protected dashboard
- **Dashboard Analytics** — Summary cards, conversion rate, pipeline view
- **Analytics Page** — Bar charts, donut chart, lead source breakdown
- **Search & Filter** — Search by name/phone, filter by status & project type

---

## 🛠 Tech Stack

| Layer       | Technology                         |
|-------------|-------------------------------------|
| Frontend    | React.js (Vite), React Router, Axios |
| Backend     | Node.js, Express.js                 |
| Database    | MongoDB with Mongoose               |
| Auth        | JWT (JSON Web Tokens)               |
| Styling     | Plain CSS with CSS Variables        |
| Fonts       | Syne + DM Sans (Google Fonts)       |

---

📁 Project Structure
FUTURE_FS_02/
├── frontend/
├── backend/
---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

---

### 1. Clone / Download the project

```bash
cd construction-lead-crm
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
MONGO_URI=mongodb://localhost:27017/construction-crm
JWT_SECRET=your_super_secret_key_here_change_this
PORT=5000
```

Start the backend:
```bash
node server.js
# or for development with auto-reload:
npx nodemon server.js
```

Backend runs at: `http://localhost:5000`

---

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🍃 MongoDB Setup

### Option A: Local MongoDB
1. Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Start MongoDB service: `mongod`
3. Use URI: `mongodb://localhost:27017/construction-crm`

### Option B: MongoDB Atlas (Free Cloud)
1. Go to https://cloud.mongodb.com
2. Create a free cluster
3. Get your connection string
4. Use it as `MONGO_URI` in `.env`

---

## 🔑 First Login

1. Open `http://localhost:5173/login`
2. Click **"Create admin account"**
3. Register with your name, email, and password
4. You're in!

---

## 🔌 API Endpoints

### Auth
| Method | Route                | Description    |
|--------|----------------------|----------------|
| POST   | /api/auth/register   | Create account |
| POST   | /api/auth/login      | Login          |

### Leads (all protected with JWT)
| Method | Route                    | Description        |
|--------|--------------------------|--------------------|
| GET    | /api/leads               | Get all leads      |
| POST   | /api/leads               | Create lead        |
| GET    | /api/leads/:id           | Get single lead    |
| PUT    | /api/leads/:id           | Update lead        |
| DELETE | /api/leads/:id           | Delete lead        |
| POST   | /api/leads/:id/notes     | Add follow-up note |
| GET    | /api/leads/analytics     | Get analytics      |

### Query params for GET /api/leads
- `?search=name_or_phone`
- `?status=New`
- `?projectType=Renovation`

---

## 📊 Lead Fields

| Field       | Type    | Values / Notes                                              |
|-------------|---------|-------------------------------------------------------------|
| name        | String  | Required                                                    |
| phone       | String  | Required                                                    |
| email       | String  | Optional                                                    |
| projectType | Enum    | House Construction, Apartment Construction, Commercial Building, Renovation, Interior Design |
| budget      | String  | e.g. "50,00,000"                                            |
| location    | String  | e.g. "Pune, Maharashtra"                                    |
| source      | Enum    | Website, Referral, Social Media, Walk-in, Phone Call, Other |
| status      | Enum    | New, Contacted, Site Visit Scheduled, Quotation Sent, Converted, Closed |

---

## 🌱 Seed Data (100 Sample Customers)

The project includes a `seed.js` script that populates your MongoDB database with **100 realistic Indian construction leads** spread across all pipeline stages — perfect for testing, demos, or getting started quickly.

### What gets seeded

| Stage                 | Count | Description                        |
|-----------------------|-------|------------------------------------|
| New                   | ~17   | Fresh inquiries, not yet contacted |
| Contacted             | ~16   | Initial call or message done       |
| Site Visit Scheduled  | ~15   | Visit booked with client           |
| Quotation Sent        | ~18   | Quote shared, awaiting approval    |
| Converted             | ~20   | Won deals, project started         |
| Closed                | ~14   | Lost leads / cancelled projects    |
| **Total**             | **100** |                                  |

Each lead includes realistic Indian names, phone numbers, email addresses, locations across 20 cities, budgets ranging from ₹5L to ₹1.5Cr, all 5 project types, all 6 lead sources, and 1–2 follow-up notes per lead.

### How to run

Make sure your backend is set up and `.env` is configured, then:

```bash
cd backend
node seed.js
```

You'll see a confirmation in the terminal:

```
🔗 Connecting to MongoDB...
✅ Connected.

📊 Lead distribution:
   Converted                 20
   Quotation Sent            18
   New                       17
   Contacted                 16
   Site Visit Scheduled      15
   Closed                    14
   TOTAL                     100

🎉 Successfully inserted 100 leads!
```

### Options

By default, the seed script **adds** leads without deleting existing data. To wipe all existing leads before seeding, open `seed.js` and change line 11:

```js
// Change this:
const CLEAR_EXISTING = false;

// To this:
const CLEAR_EXISTING = true;
```

> ⚠️ Setting `CLEAR_EXISTING = true` permanently deletes all current leads. Use with caution in production.

---

## 🎨 Design

- **Theme**: Dark industrial / utilitarian
- **Colors**: Charcoal background with amber (#f0a500) accent
- **Fonts**: Syne (headings, display) + DM Sans (body)
- **Fully responsive** sidebar with collapsible navigation

---

## 📝 License

MIT — free to use and modify for your construction business.

🎯 Internship Submission Note
Repository follows required format: FUTURE_FS_02
Built as part of Full Stack Internship
Includes complete frontend + backend code
👨‍💻 Author

Uday A
Full Stack Developer

⭐ Support

If you like this project, give it a ⭐ on GitHub!

© 2026 Uday A
