# Badminton Court Booking System 🎾

A full‑stack MERN application to book badminton courts with time slots, basic pricing, and user authentication.

## Tech Stack

- **Frontend:** React, Vite, Axios, CSS
- **Backend:** Node.js, Express.js, Mongoose, MongoDB
- **Auth:** JSON Web Tokens (JWT)
- **Build/Tooling:** npm, dotenv, cors

---

## Project Structure
* backend/
models/ # User, Court, Booking schemas
routes/ # authRoutes, bookingRoutes, courtRoutes
middleware/ # authMiddleware (JWT verification)
server.js # Express app entry
* frontend/
src/
pages/ # Login, Signup, Booking, Admin pages
components/ # Booking UI, admin court management, auth wrappers
styles/ # CSS for main pages
index.html 



---

## Setup Instructions

### 1. Clone and install

git clone <your-repo-url>
cd <your-repo-folder>

Backend
cd backend
npm install

Frontend
cd ../frontend
npm install



### 2. Environment variables

Create `.env` in **backend**:
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>

Create `.env` in **frontend**:
VITE_API_URL=http://localhost


### 3. Run the app

Backend:
cd backend
node server.js


Frontend:
cd frontend
npm run dev


Open the frontend URL shown in the terminal (usually `http://localhost:5173`).

---

## Seed Data

Use these initial documents in MongoDB:

### Courts

Collection: `courts`

[
{ "name": "Indoor Court", "type": "INDOOR", "basePrice": 500, "isActive": true },
{ "name": "Outdoor Court", "type": "OUTDOOR", "basePrice": 500, "isActive": true },
{ "name": "Indoor Court Premium", "type": "INDOOR", "basePrice": 600, "isActive": true },
{ "name": "Outdoor Court Premium", "type": "OUTDOOR", "basePrice": 600, "isActive": true }
]

# Database Design

The system uses three main MongoDB collections: **User**, **Court**, and **Booking**. A `User` document stores authentication data (email, hashed password) plus an `isAdmin` flag to distinguish regular users from admins. A `Court` document represents a physical court with basic fields such as `name`, `type` (`INDOOR` or `OUTDOOR`), `basePrice`, and `isActive`. A `Booking` document links a user to a selected court and time slot through `userId`, `courtId`, `courtName`, `date`, `time`, `price`, and `status`. A compound unique index on `(date, time, courtName)` ensures one booking per court and time slot, preventing double‑booking at the database level.

The current version focuses on a very simple flow: users only choose the court type (indoor or outdoor) and a time slot, without any extra options such as equipment, coaches, or dynamic pricing rules. The `basePrice` on each court is used as a static hourly price; the frontend reads this value when a court is selected and sends it as `price` in the booking request. The backend simply stores this value in the `Booking` document with no additional modification or calculation. Admin users have a read‑only view showing all created bookings so they can see which slots are taken, but there is no CRUD interface for courts or pricing yet. This minimal design keeps the codebase small and clear while leaving room to extend features later.


## Backend package.json:

express

mongoose

cors

dotenv

jsonwebtoken

bcrypt or bcryptjs


## Frontend package.json:

react

react-dom

react-router-dom

axios

vite