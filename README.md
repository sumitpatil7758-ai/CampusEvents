# 🎓 CampusConnect — College Event Management System

A full-stack web application for managing college events. Students can discover, register for, and track events. Organizers can create events, manage participants, and send notifications.

![Tech Stack](https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JS-blue)
![Tech Stack](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express.js-green)
![Tech Stack](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-purple)

---

## ✨ Features

### Student Features
- 🔍 **Discover Events** — Browse, search, and filter college events
- 📝 **Register for Events** — One-click registration with seat tracking
- 🎟️ **QR Code** — Get a QR code for each registration
- 📋 **My Registrations** — View and manage all registered events
- 🔔 **Notifications** — Receive real-time updates about events
- 📊 **Dashboard** — Personal dashboard with stats and upcoming events

### Organizer Features
- ➕ **Create Events** — Create detailed events with rules and requirements
- ✏️ **Edit & Delete Events** — Full event lifecycle management
- 👥 **Manage Participants** — View registered students with details
- 📤 **Export CSV** — Download participant lists
- 📢 **Send Notifications** — Notify registered students
- 📈 **Analytics** — Event statistics and category breakdown

### General Features
- 🔐 **Authentication** — JWT-based secure login/register
- 🎨 **Responsive Design** — Works on mobile, tablet, and desktop
- 🔄 **Real-time Seat Tracking** — Live seat availability updates
- 🏷️ **Event Categories** — Technical, Cultural, Sports, Workshop, Seminar, Competition, Hackathon
- 🔍 **Search & Filter** — Find events by name, category, or sort order

---

## 🛠️ Technologies

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | Supabase (PostgreSQL) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Icons | Font Awesome 6 |
| QR Codes | qrcode npm package |

---

## 📁 Project Structure

```
college-event-management/
│
├── frontend/                  # Frontend (static files)
│   ├── index.html             # Landing page
│   ├── login.html             # Login page
│   ├── register.html          # Registration page
│   ├── events.html            # Events listing
│   ├── event-details.html     # Single event view
│   ├── dashboard.html         # Student dashboard
│   ├── my-registrations.html  # Student registrations
│   ├── notifications.html     # Notifications page
│   ├── organizer-dashboard.html  # Organizer dashboard
│   ├── create-event.html      # Create event form
│   ├── manage-events.html     # Manage events table
│   ├── participants.html      # Participant management
│   │
│   ├── css/
│   │   └── style.css          # Complete stylesheet
│   │
│   └── js/
│       ├── auth.js            # Authentication & navbar
│       ├── events.js          # Events logic
│       ├── registrations.js   # Registration logic
│       ├── notifications.js   # Notifications logic
│       └── organizer.js       # Organizer features
│
├── backend/                   # Backend (Express.js API)
│   ├── server.js              # Express server entry
│   ├── package.json           # Dependencies
│   ├── .env.example           # Environment template
│   │
│   ├── config/
│   │   └── db.js              # Supabase client config
│   │
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   ├── events.js          # Event routes
│   │   ├── registrations.js   # Registration routes
│   │   └── notifications.js   # Notification routes
│   │
│   ├── controllers/
│   │   ├── authController.js         # Auth logic
│   │   ├── eventController.js        # Event CRUD logic
│   │   ├── registrationController.js # Registration logic
│   │   └── notificationController.js # Notification logic
│   │
│   └── middleware/
│       └── authMiddleware.js  # JWT auth middleware
│
├── database/
│   ├── schema.sql             # Database tables & indexes
│   └── seed-data.sql          # Demo data
│
└── README.md                  # This file
```

---

## 🚀 Installation Guide

Follow these steps to set up the project:

### Prerequisites
- **Node.js** (v16 or later) — [Download here](https://nodejs.org/)
- **Supabase account** (free) — [Sign up here](https://supabase.com/)

### Step 1: Download the Project

Download or clone this project to your computer.

### Step 2: Set Up Supabase Database

1. Go to [Supabase](https://supabase.com/) and create a **new project**
2. Wait for the project to finish setting up
3. Go to **SQL Editor** in the left sidebar
4. Copy the contents of `database/schema.sql` and run it — this creates all tables
5. Copy the contents of `database/seed-data.sql` and run it — this adds demo data
6. Go to **Settings → API** and copy your:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public key** (under "Project API keys")

### Step 3: Configure Environment Variables

1. Open the `backend` folder
2. Copy `.env.example` to a new file called `.env`
3. Fill in your values:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
JWT_SECRET=any-long-random-string-here
PORT=5000
```

> **Tip:** For `JWT_SECRET`, use any long random string like `mySuperSecretKey12345`

### Step 4: Install Dependencies

Open a terminal/command prompt and run:

```bash
cd backend
npm install
```

This installs all required packages (Express, Supabase client, JWT, etc.)

### Step 5: Start the Server

```bash
npm start
```

You should see:
```
CampusConnect server running on port 5000
```

### Step 6: Open the Application

Open your browser and go to:

```
http://localhost:5000
```

That's it! 🎉 The application is now running.

---

## 🧪 Test Accounts

All demo accounts use the same password: **`Password123`**

| Role | Name | Email | Password |
|------|------|-------|----------|
| 👨‍🎓 Student | Sumit Patil | `sumit@student.edu` | `Password123` |
| 👩‍🎓 Student | Priya Sharma | `priya@student.edu` | `Password123` |
| 👨‍🎓 Student | Rahul Kumar | `rahul@student.edu` | `Password123` |
| 👩‍🏫 Organizer | Dr. Anita Desai | `anita@organizer.edu` | `Password123` |
| 👨‍🏫 Organizer | Prof. Vikram Singh | `vikram@organizer.edu` | `Password123` |

---

## 📡 API Documentation

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create new account | No |
| POST | `/api/auth/login` | Login (returns JWT) | No |
| GET | `/api/auth/profile` | Get user profile | Yes |

### Events

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/events` | List events (search, filter, sort) | No |
| GET | `/api/events/stats/overview` | Get platform statistics | No |
| GET | `/api/events/:id` | Get event details | No |
| POST | `/api/events` | Create event | Organizer |
| PUT | `/api/events/:id` | Update event | Organizer |
| DELETE | `/api/events/:id` | Delete event | Organizer |

### Registrations

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/registrations` | Register for event | Student |
| GET | `/api/registrations/my` | Get my registrations | Student |
| GET | `/api/registrations/check/:eventId` | Check if registered | Student |
| GET | `/api/registrations/event/:eventId` | Get event participants | Organizer |
| DELETE | `/api/registrations/:id` | Cancel registration | Yes |

### Notifications

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/notifications` | Get my notifications | Yes |
| PUT | `/api/notifications/:id/read` | Mark as read | Yes |
| PUT | `/api/notifications/read-all` | Mark all as read | Yes |
| DELETE | `/api/notifications/:id` | Delete notification | Yes |
| POST | `/api/notifications/send` | Send to event participants | Organizer |

**Authentication:** Send JWT token in the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🎬 Hackathon Demo Flow

Follow this exact sequence to demonstrate the full application:

### Part 1: Student Experience

| Step | Action |
|------|--------|
| 1 | Open `http://localhost:5000` — show the landing page |
| 2 | Click "Explore Events" — browse the events page |
| 3 | Search for "Hackathon" in the search bar |
| 4 | Click "View Details" on the AI & Innovation Hackathon |
| 5 | Show event details, seat availability bar |
| 6 | Click "Login to Register" — login as `sumit@student.edu` / `Password123` |
| 7 | Open the hackathon again, click "Register Now" |
| 8 | Fill phone number, click "Confirm Registration" |
| 9 | Show the success modal with Registration ID and QR Code |
| 10 | Open "My Registrations" from navbar — show the registration |
| 11 | Open "Notifications" — show registration confirmation notification |
| 12 | Open "Dashboard" — show stats and upcoming events |
| 13 | Logout |

### Part 2: Organizer Experience

| Step | Action |
|------|--------|
| 14 | Login as organizer: `anita@organizer.edu` / `Password123` |
| 15 | Show the Organizer Dashboard with stats and analytics |
| 16 | Click "Manage Events" — show events table |
| 17 | Click "Participants" on AI & Innovation Hackathon — show registered student |
| 18 | Click "Export CSV" — download participant list |
| 19 | Go back, click "Create Event" — create a new event |
| 20 | Fill in event details and submit |
| 21 | Verify the new event appears in Manage Events |
| 22 | Open Events page to confirm it's publicly visible |

---

## 🔒 Security Features

- ✅ JWT-based authentication with expiry
- ✅ Password hashing with bcryptjs
- ✅ Role-based access control (Student vs Organizer)
- ✅ Input validation (frontend + backend)
- ✅ Duplicate registration prevention
- ✅ Registration deadline enforcement
- ✅ Seat capacity enforcement
- ✅ Organizers can only manage their own events
- ✅ Students can only cancel their own registrations
- ✅ Environment variables for secrets (never hardcoded)

---

## 📋 Implemented Features Checklist

- [x] Student registration & login
- [x] Organizer registration & login
- [x] Landing page with stats & featured events
- [x] Events listing with search, filter, sort
- [x] Event details with seat availability
- [x] Event registration with validation
- [x] Registration ID generation (REG-YYYY-XXXXX)
- [x] QR code generation
- [x] My Registrations page
- [x] Cancel registration
- [x] Notification system
- [x] Mark notifications as read
- [x] Student dashboard
- [x] Organizer dashboard with analytics
- [x] Create / Edit / Delete events
- [x] Participant management
- [x] CSV export
- [x] Send notifications to participants
- [x] Responsive design (mobile/tablet/desktop)
- [x] Duplicate registration prevention
- [x] Deadline & seat capacity enforcement
- [x] Input validation (frontend + backend)
- [x] Error handling with user-friendly messages

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot connect to database" | Check your `.env` file has correct Supabase URL and key |
| "Login failed" | Make sure you ran `seed-data.sql` in Supabase |
| "Port 5000 already in use" | Change `PORT` in `.env` to another number (e.g., 3000) |
| "npm install fails" | Make sure Node.js is installed: run `node --version` |
| Blank pages | Open browser console (F12) and check for errors |

---

## 📄 License

This project is created for educational purposes and college hackathon demonstrations.

---

**Made with ❤️ for CampusConnect**
