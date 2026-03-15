<div align="center">

# 🚌 Bus Booking System

A full stack bus booking application — search routes, select seats, and confirm bookings in real time.

**Built for the AppWeave Full Stack Developer Intern Assignment**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Frontend-black?style=for-the-badge)](https://your-app.vercel.app)
[![API](https://img.shields.io/badge/API-Backend-gray?style=for-the-badge)](https://your-api.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Private%20Repo-181717?style=for-the-badge&logo=github)](https://github.com/yourusername/bus-booking-system)

</div>

---

## ✨ Features

- **Bus Search** — Search by departure city, arrival city and date
- **Smart Filters** — Filter by seat type, AC/NON-AC and departure time slot
- **Seat Selection** — Interactive seat grid with live availability
- **Reservation Timer** — 2-minute seat lock while filling passenger details
- **Booking Confirmation** — Unique booking ID on every successful booking
- **Pagination** — Clean page-by-page bus listing
- **35 Routes** — Available for the next 30 days

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS, Vite |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB Atlas, Mongoose |
| Deployment | Vercel (frontend), Render (backend) |

---

## 📁 Project Structure
```
bus-booking/
├── frontend/                  # React + TypeScript
│   └── src/
│       ├── components/        # Navbar, BusCard
│       ├── pages/             # Home, BusList, SeatSelection, Confirm, Success
│       ├── services/          # API calls (axios)
│       ├── types/             # TypeScript interfaces
│       └── utils/             # Helper functions
│
└── backend/                   # Node.js + Express
    └── src/
        ├── config/            # MongoDB connection
        ├── controllers/       # Business logic
        ├── middleware/        # Error handler
        ├── models/            # Mongoose schemas
        ├── routes/            # API routes
        ├── seeds/             # Database seeding
        └── utils/             # Seat layout generator
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/buses` | Search buses with filters + pagination |
| `GET` | `/api/buses/:busId` | Get full seat layout |
| `POST` | `/api/bookings` | Confirm booking |


---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)

### Backend
```bash
cd backend
npm install
# Fill in your MONGO_URI in .env
npm run dev
```

### Seed Database
```bash
npm run seed
# Seeds 35 bus routes × 30 days = 1050 entries
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend → `http://localhost:5173`  
Backend → `http://localhost:8000`

---

## 🔐 Environment Variables

Create `backend/.env`:
```env
PORT=8000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_uri
CORS_ORIGIN=http://localhost:5173
SEAT_RESERVATION_TTL=120000
```

---



---

## 📸 Screenshots

> SS needed here!

---

<div align="center">

Made with ❤️ by **Suman Deka**

</div>
