# 🏏 BUILD YOUR IPL XI — Full-Stack Fantasy Draft Application

An authentic, broadcast-grade IPL Playing XI historical draft game built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **MongoDB Atlas**, **Auth.js (NextAuth v5)** with **Google OAuth**, and **Zod** validation.

---

## 📋 Table of Contents
1. [Core Game Concept](#core-game-concept)
2. [Architecture Overview](#architecture-overview)
3. [Tech Stack & Dependencies](#tech-stack--dependencies)
4. [Environment Variables](#environment-variables)
5. [Step-by-Step Setup Guide](#step-by-step-setup-guide)
   - [Google Cloud OAuth Setup](#1-google-cloud-oauth-setup)
   - [MongoDB Atlas Setup](#2-mongodb-atlas-setup)
   - [Database Seeding](#3-database-seeding)
6. [Local Development & Commands](#local-development--commands)
7. [Running Tests](#running-tests)
8. [Production Build & Vercel Deployment](#production-build--vercel-deployment)
9. [Authoritative Historical IPL Data Archive](#authoritative-historical-ipl-data-archive)
10. [API Reference](#api-reference)
11. [Security Architecture](#security-architecture)

---

## 🎯 Core Game Concept

The player drafts their ultimate IPL Playing XI across 11 rounds:
1. **Spin the Wheel**: Each spin randomly generates an authentic **IPL Team + Season** (e.g., `CSK 2011`, `RCB 2016`, `MI 2019`).
2. **Select One Player**: The historical squad for that exact season is displayed. The player selects **one eligible player** to add to their XI.
3. **Repeat for 11 Rounds**: Build a complete Playing XI under real cricket constraints:
   - Exactly 11 players.
   - At least 1 Wicketkeeper (`WK`).
   - Specialist Batters, All-Rounders, and Bowling options.
   - **Maximum 4 Overseas Players**.
   - Optional **₹100 Cr Salary Cap Mode**.
   - Auto-rescue protection: guarantees eligible wicketkeepers in final rounds if missing.
4. **Final Verdict & Lineup Scoring**: Algorithmically rated across Batting Depth, Bowling Attack, All-Round Impact, Lineup Balance, and Overseas Utilization, complete with official verdicts (`🏆 CHAMPIONSHIP MATERIAL`, `🔥 TITLE CONTENDER`, etc.) and an interactive cricket pitch formation.

---

## 🏗️ Architecture Overview

```
gameipl/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # Auth.js Google OAuth route handler
│   │   ├── drafts/route.ts              # GET active draft, POST create draft
│   │   ├── drafts/[draftId]/route.ts    # GET / DELETE draft by ID
│   │   ├── drafts/[draftId]/spin/route.ts# Server-authoritative squad spin
│   │   ├── drafts/[draftId]/pick/route.ts# Server pick validation & atomic save
│   │   ├── drafts/history/route.ts      # GET completed draft history
│   │   └── status/route.ts              # Environment & database readiness check
│   ├── globals.css                      # Athletic typography, stadium lighting, styles
│   ├── layout.tsx                       # Root layout with fonts & SessionProvider
│   └── page.tsx                         # Main client orchestrator
├── auth.ts                              # Auth.js v5 Google OAuth & MongoDB Adapter config
├── components/
│   ├── AuthButton.tsx                   # Google Sign In / Profile dropdown menu
│   ├── CurrentXI.tsx                    # Dugout panel, slots, budget, overseas tracker
│   ├── DraftHistoryModal.tsx            # Saved drafts modal & resume functionality
│   ├── GameScreen.tsx                   # In-game wheel, reveal jumbotron, player grid
│   ├── HomeScreen.tsx                   # Athletic landing screen with rules & CTA
│   ├── PlayerCard.tsx                   # FUT-style trading card with holographic hover
│   ├── Providers.tsx                    # SessionProvider client wrapper
│   ├── ResultScreen.tsx                 # Score breakdown, pitch formation & share
│   └── SpinWheel.tsx                    # Canvas wheel with LED rim, audio, digital HUD
├── data/
│   ├── gameLogic.ts                     # Rules, scoring engine, composition calculations
│   ├── historicalTeams.ts               # Verified IPL squads (2008–2025)
│   └── types.ts                         # Core TypeScript interfaces & franchise themes
├── lib/
│   ├── mongodb-client.ts                # MongoDB native driver client for Auth.js
│   ├── mongoose.ts                      # Mongoose connection pooling & caching
│   └── server/
│       ├── auth-helper.ts               # Authenticated session & guest fallback helper
│       ├── draft-engine.ts              # Server-side authoritative draft state machine
│       └── validations.ts               # Zod validation schemas
├── models/
│   ├── Draft.ts                         # Mongoose Draft schema & history events
│   ├── HistoricalTeamSeason.ts          # Mongoose HistoricalTeamSeason schema
│   ├── Player.ts                        # Mongoose Player schema
│   └── User.ts                          # Mongoose User schema (Auth.js compatible)
├── scripts/
│   └── seed.ts                          # Repeatable, idempotent MongoDB seed script
├── tests/
│   ├── draft-engine.test.ts             # Ownership, concurrency, pick validation tests
│   └── rules-and-completion.test.ts     # Overseas quota, full 11-round completion tests
└── vitest.config.ts                     # Test runner configuration with path aliases
```

---

## ⚙️ Tech Stack & Dependencies

- **Framework**: Next.js 16.4 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with custom athletic font variables
- **Database**: MongoDB Atlas via `mongoose` (app models) & `mongodb` native driver (`@auth/mongodb-adapter`)
- **Authentication**: Auth.js (`next-auth@5.0.0-beta.32`) with Google OAuth 2.0
- **Validation**: Zod 4 for server-side payload and schema enforcement
- **Testing**: Vitest 5 for high-speed unit & integration tests
- **Audio**: Web Audio API (native browser synthesis, zero external MP3 assets)

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory (based on `.env.example`):

```bash
# MongoDB Atlas Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/gameipl?retryWrites=true&w=majority

# Auth.js Secret Key (32+ chars)
AUTH_SECRET=your_32_character_random_auth_secret_key_here

# Google OAuth 2.0 Credentials
AUTH_GOOGLE_ID=your_google_oauth_client_id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=GOCSPX-your_google_oauth_client_secret_here

# Next.js Site URLs
AUTH_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
```

> [!NOTE]
> **Graceful Demo Mode**: If `MONGODB_URI` or Google OAuth variables are not provided, the application runs in memory/demo mode, allowing full gameplay and local testing without breaking.

---

## 🛠️ Step-by-Step Setup Guide

### 1. Google Cloud OAuth Setup
1. Visit the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project: e.g., `IPL-Draft-Game`.
3. Navigate to **APIs & Services** → **OAuth consent screen**:
   - User Type: **External**.
   - App Name: `IPL Draft`.
   - User support email & developer contact email: your email.
   - Scopes: `.../auth/userinfo.email`, `.../auth/userinfo.profile`, `openid`.
   - Test Users: Add your personal Google account.
4. Navigate to **Credentials** → **Create Credentials** → **OAuth client ID**:
   - Application type: **Web application**.
   - Name: `IPL Draft Web Client`.
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (Local development)
     - `https://your-production-domain.vercel.app` (After Vercel deployment)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google` (Local)
     - `https://your-production-domain.vercel.app/api/auth/callback/google` (Production)
5. Copy the generated **Client ID** and **Client Secret** into `.env.local` as `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`.

### 2. MongoDB Atlas Setup
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Database Access** → **Add New Database User**:
   - Authentication Method: Password.
   - Built-in Role: `Read and write to any database`.
3. Go to **Network Access** → **Add IP Address**:
   - For local development: Add your current IP or `0.0.0.0/0` (Allow access from anywhere).
4. Go to **Database** → **Connect** → **Drivers** (Node.js):
   - Copy connection string: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/gameipl?retryWrites=true&w=majority`.
   - Paste it into `.env.local` as `MONGODB_URI`.

### 3. Database Seeding
To populate MongoDB with verified historical squads and player statistics:
```bash
npm run seed
```
This script is **idempotent**: it uses `findOneAndUpdate` upserts, preventing duplicate records when run repeatedly.

---

## 💻 Local Development & Commands

```bash
# Install dependencies
npm install

# Run the database seed script
npm run seed

# Start development server
npm run dev

# Run Vitest test suite
npm test

# Build production bundle
npm run build

# Start production server
npm start
```

---

## 🧪 Running Tests

The test suite validates:
- Unauthenticated requests and guest fallback.
- Ownership protection (User B cannot read, mutate, or delete User A's draft).
- Invalid team-season IDs.
- Rejecting selections outside the active squad.
- Rejecting duplicate player selections across the draft.
- Enforcement of the maximum 4 overseas player rule.
- Concurrency and round-mismatch guards.
- Full 11-round completion, algorithmic scoring, and verdict assignment.
- Zod schema validations.

Run the test suite:
```bash
npm test
```

---

## 🚀 Production Build & Vercel Deployment

1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. In **Settings** → **Environment Variables**, add:
   - `MONGODB_URI`
   - `AUTH_SECRET`
   - `AUTH_GOOGLE_ID`
   - `AUTH_GOOGLE_SECRET`
   - `AUTH_URL` (set to your Vercel deployment URL, e.g. `https://your-app.vercel.app`)
4. In Google Cloud Console, update the OAuth Client:
   - Add your Vercel URL to **Authorized JavaScript origins**.
   - Add `https://your-app.vercel.app/api/auth/callback/google` to **Authorized redirect URIs**.
5. Trigger deployment. The app will build and serve serverlessly.

---

## 📂 Authoritative Historical IPL Data Archive

The archive in `data/historicalTeams.ts` contains verified rosters from famous IPL seasons:
- **RR 2008**: Shane Warne, Shane Watson, Yusuf Pathan, Sohail Tanvir, Graeme Smith...
- **CSK 2010, 2011, 2018, 2021, 2023**: MS Dhoni, Suresh Raina, Faf du Plessis, Ravindra Jadeja, Dwayne Bravo, Ravichandran Ashwin, Doug Bollinger...
- **KKR 2012, 2014, 2024**: Gautam Gambhir, Sunil Narine, Jacques Kallis, Andre Russell, Mitchell Starc, Shreyas Iyer...
- **MI 2013, 2015, 2017, 2019, 2020**: Rohit Sharma, Sachin Tendulkar, Lasith Malinga, Jasprit Bumrah, Kieron Pollard, Hardik Pandya...
- **SRH 2016**: David Warner, Shikhar Dhawan, Bhuvneshwar Kumar, Rashid Khan...
- **RCB 2016, 2025**: Virat Kohli, AB de Villiers, Chris Gayle, Yuzvendra Chahal...
- **GT 2022**: Hardik Pandya, Shubman Gill, David Miller, Mohammed Shami...
- **LSG 2022**: KL Rahul, Quinton de Kock, Marcus Stoinis, Ravi Bishnoi...

### Adding a New Season
To add a new verified historical season:
1. Open `data/historicalTeams.ts`.
2. Append a new `HistoricalTeam` object with verified squad members.
3. Run `npm run seed` to upsert the new records into MongoDB.

---

## 🛡️ Security Architecture

1. **Server-Authoritative Game State**:
   - The client never decides which squad is selected or whether a player is eligible.
   - Spins and picks are validated and computed exclusively on the server.
2. **Draft Ownership Enforcement**:
   - All mutations verify `userId === session.user.id`.
3. **Atomic Operations & Concurrency Protection**:
   - Round updates use conditional writes (`{ draftId, userId, round, status: 'in_progress' }`) to prevent double-submissions from advancing rounds twice.
4. **Zod Schema Validation**:
   - All incoming API payloads are parsed and validated prior to database access.
5. **No Secret Leaks**:
   - Database credentials and OAuth secrets are restricted to server-side execution.
