# 🪙 Full-Stack Crypto Exchange Platform

A comprehensive, centralized crypto exchange platform built from scratch with a modern tech stack. This project features a complete user authentication system, multiple trading interfaces, real-time data integration, and a full-featured admin panel.

---

## Live Demo

- **Frontend (Vercel):** `https://crypto-exchange-4tmi7izaw-saikrishnacreats-projects.vercel.app/`
- **Backend (Render):** `https://crypto-exchange-h0aw.onrender.com/`

---

## ✨ Core Features

- **Secure User Authentication:** Full registration and login flow using **JWTs** and password hashing with **bcrypt**.
- **Protected Routes:** Secure dashboard and trading pages accessible only to authenticated users.
- **Live Spot Trading:** UI fetches real-time crypto prices from a **Chainlink oracle** via the backend for trade calculations.
- **P2P Trading:** Peer-to-peer market where users can create and view trade offers.
- **Crypto Deposits & Withdrawals:**
  - Unique deposit addresses generated for each user.
  - Backend **listener service** watches the blockchain for user deposits.
  - Secure withdrawal system sends on-chain transactions from the exchange's hot wallet.
- **Admin Panel:** Protected area for administrators to view, manage, and edit all users on the platform.

---

## 🛠️ Tech Stack

### Backend

- **Framework:** Node.js, Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Blockchain Interaction:** Ethers.js, Chainlink Contracts
- **Authentication:** JWT, bcrypt
- **Deployment:** Render

### Frontend

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Hooks (`useState`, `useEffect`)
- **Deployment:** Vercel

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- PostgreSQL (running instance, e.g., Supabase)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/crypto-exchange.git
cd crypto-exchange
```

### 2. Backend Setup

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create a .env file from the example
cp .env.example .env

# Run database migrations to create tables
npx prisma migrate dev

# Run the development server
npm run dev
```

### 3. Frontend Setup

```bash
# Navigate to the client directory from the root
cd client

# Install dependencies
npm install

# Create a .env.local file for the frontend
cp .env.local.example .env.local

# Run the development server
npm run dev
```

Your application should now be running, with the frontend on **`http://localhost:3000`** and the backend on **`http://localhost:3001`**.

---

## ⚙️ Environment Variables

You will need to create `.env` files for both the client and server.

### Backend (`/server/.env`)

| Variable                 | Description                                                  |
|--------------------------|--------------------------------------------------------------|
| `DATABASE_URL`           | Your PostgreSQL connection string (e.g., from Supabase).     |
| `JWT_SECRET`             | A long, random string for signing authentication tokens.     |
| `SEPOLIA_RPC_URL`        | RPC URL for the Sepolia testnet (e.g., from Alchemy).        |
| `HOT_WALLET_PRIVATE_KEY` | Private key of the exchange's wallet for withdrawals.        |

### Frontend (`/client/.env.local`)

| Variable              | Description                                        |
|-----------------------|----------------------------------------------------|
| `NEXT_PUBLIC_API_URL` | URL of your backend API (`http://localhost:3001` for local dev). |
