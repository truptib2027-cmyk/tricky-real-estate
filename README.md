# Tricky Real Estate — Luxury Dubai Property & CRM Platform

An ultra-luxury real estate website and private CRM platform tailored specifically for the Dubai luxury residential market. Built in accordance with strict Dubai real estate standards, featuring prices exclusively in AED, zero email dependencies, advanced lead scoring, an interactive deal pipeline, automated 2% commission calculations, and complete security protections.

---

## 🌟 Executive Feature Summary

### 1. Public Luxury Web Sanctuary
- **Home Page**: Full-screen Dubai skyline hero, multi-criteria quick search, curated ready residences, featured off-plan developments, **"Why Invest in Dubai"** investment guide (0% tax, high rental yields, 10-Year Golden Visa), community showcases, and **Register Interest** form.
- **Properties Portfolio**: Filterable catalog (by community, property type, price in AED, bedrooms) with detailed specifications, amenities tags, **"Book a Viewing"**, and **"Enquire"** modal forms.
- **Off-Plan Developments**: Architectural projects with milestone payment plans (e.g. 60/40), handover schedules (2026–2028), net yield ROI projections, and **"Download Brochure"** forms.
- **Mortgage & Upfront Costs Calculator**: Interactive repayment slider with exact Dubai Land Department (DLD 4%), trustee, registration, and agency fee breakdowns + **"Speak to an Advisor"** form.
- **Sell / Private Disposal**: Certified RERA property valuation request form and confidential representation protocol.
- **About & Contact**: Downtown Dubai headquarters details (Boulevard Plaza Tower 1), senior partner leadership bios, direct VIP telephone (+971 4 800 8742), and direct contact form.
- **Universal Floating Concierge**: Floating WhatsApp VIP Desk and **"Call Me Back"** modal on every page.
- **Prompt-Exact Confirmation**: Every form submission displays the exact requested message:
  > *"A Tricky Real Estate advisor will contact you within 24 hours."*
- **Strictly Zero Email Sending**: No SMTP or third-party mailers; all buyer inquiries are securely ingested straight into the database.

### 2. Lead Intelligence & Anti-Spam Engine
- **Source Tracking**: Every lead records the exact page and form it originated from.
- **Rate-Limiting**: IP sliding-window limiter prevents rapid submissions (maximum 4 forms per 3 minutes).
- **Honeypot Anti-Bot**: Hidden decoy fields and minimum submission timestamp checks block automated spammers silently.
- **Lead Scoring (0 to 100)**:
  - +25 points for Cash buyers
  - +25 points for Immediate purchase timeframe (+15 for within 1 month)
  - +20 points for Budgets AED 30M+ (+15 for 15M–30M, +10 for 5M–15M)
  - +15 points for Valid telephone number
  - +15 points for Specific property or project interest
  - **Dynamic Badges**: `HOT` ($\ge 70$), `WARM` (40–69), `COLD` ($< 40$).

### 3. Private Admin & CRM Suite
- **Confidential Staff Authentication**: Private login portal with role-based access.
- **Agent Data Isolation**: Agents only see their own assigned leads; Master Admin (Jay) has global visibility.
- **Notification Bell**: Displays live count of new/unread leads, auto-refreshing every 60 seconds with recent inquiry previews.
- **KPI Executive Dashboard**: Real-time counters for New Leads Today, Total Pipeline Value in AED, Viewings Scheduled, and Month-to-date Completed 2% Commission, with dynamic funnel and lead acquisition charts.
- **Drag-and-Drop Pipeline Board**: Visual Kanban board across 6 stages: *New*, *Contacted*, *Viewing*, *Offer*, *Won*, and *Lost*.
- **Automated 2% Deal Commission**: When dragging or marking a lead as **"Won"**, an executive modal prompts for the agreed sale price, automatically calculates the **2% brokerage commission in AED**, records the sale in the database, appends a celebratory deal note, and automatically marks the property as **"Sold"**.
- **Lead Directory & Excel Export**: Search by client name, telephone, or reference number, filter by stage or agent, and export the entire directory to a CSV/Excel file in one click.
- **Lead Dossier Modal**: Full client profile, stage transitions, agent reassignment, viewing scheduler, timeline notes, and direct **Call** (`tel:`) and **WhatsApp** (`wa.me`) action buttons.
- **Viewings Management**: Central inspection calendar with client contacts and status badges.
- **Agent Performance Leaderboard**: Monthly volume rankings against target quotas (e.g. AED 30,000,000) with percentage completion progress bars.
- **Stale Leads Alert**: Flags any active lead with zero activity for 3 or more days to prevent client drop-off.
- **Property & Project Inventory Manager**: Add, edit, and remove residences and off-plan projects directly from the admin panel.

### 4. Search Engine Optimization & Confidentiality
- **Admin Cloaking**: `robots.txt`, `<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">`, and HTTP response headers `X-Robots-Tag: noindex, nofollow` ensure Google and search engines never index staff portals or administrative APIs.
- **Google SEO Ready**: Public pages include canonical URLs, optimized meta titles/descriptions, Open Graph cards, Twitter cards, geo coordinates for Dubai, XML Sitemap (`sitemap.xml`), and Schema.org JSON-LD structured data (`RealEstateAgent`, `ItemList`, `FinancialProduct`).
- **Data Privacy Guard**: The Express server strictly forbids direct web access to `.env`, source code (`server.js`), package manifests, database schemas, and git repositories.

### 5. Luxury Styling & Mobile First
- **Aesthetic**: Cormorant Garamond headings, Inter body text, pure white/off-white (`#F7F5F2`), charcoal (`#1A1A1A`), warm gray (`#6B6B6B`), and subtle gold (`#B8975A`).
- **Loading & Error Pages**: Ultra-luxury 404 Not Found (`404.html`) and 500 System Interlude (`500.html`) pages + 3px shimmering gold progress loader on link navigation and form transmissions.
- **Mobile Responsive**: Full-bleed swipeable mobile navigation drawer, swipe-friendly Kanban columns with scroll snap, responsive tables with horizontal scroll containers, and responsive modals.

---

## 🚀 Simple Instructions for How to Run the Website

### Prerequisites
You need **Node.js** (version 16 or newer) installed on your computer. If you don't have it, download it from [nodejs.org](https://nodejs.org).

### Step 1: Open Your Terminal
Open PowerShell, Command Prompt, or Terminal and navigate to the project directory:
```bash
cd "c:\Users\hp\Antigravity Real Estate 29Sep"
```

### Step 2: Install Dependencies
Install the required packages (`express`, `dotenv`, `pg`):
```bash
npm install
```

### Step 3: Start the Server
Run the application using:
```bash
npm start
```
*(Or alternatively: `node server.js`)*

### Step 4: Open in Your Browser
Once the server starts, open your browser and visit:
- **Public Luxury Website**: [http://localhost:3000](http://localhost:3000)
- **Private Staff Login**: [http://localhost:3000/login.html](http://localhost:3000/login.html)
- **Admin & CRM Suite**: [http://localhost:3000/admin.html](http://localhost:3000/admin.html)

---

## 🗄️ Database Setup (Neon PostgreSQL)

The platform includes an **intelligent dual-engine database**:
- **Out of the box**: Runs immediately using an embedded in-memory database pre-seeded with 5 developers, 6 off-plan projects, 15 luxury properties, 40 scored buyer leads, 10 viewings, 5 completed sales (AED 147.2M volume), and 4 staff accounts.
- **When connecting to Neon PostgreSQL**:
  1. Create a free PostgreSQL database at [console.neon.tech](https://console.neon.tech).
  2. Copy your **Connection String** (Pooled or Direct, with `sslmode=require`).
  3. Open the file [`.env`](file:///c:/Users/hp/Antigravity%20Real%20Estate%2029Sep/.env) in the project root.
  4. Paste your connection string after `DATABASE_URL=`:
     ```env
     PORT=3000
     DATABASE_URL=postgresql://username:password@ep-your-database.us-east-2.aws.neon.tech/neondb?sslmode=require
     ```
  5. Restart the server (`npm start`). The server will automatically create all 8 database tables from `db/schema.sql` and seed the dataset automatically.

---

## 🔐 Staff Login Credentials

Navigate to [http://localhost:3000/login.html](http://localhost:3000/login.html) to sign in. The login page includes convenient quick-fill buttons for instant testing:

| Name | Role | Email | Password | Scope & Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Jay** | Master Admin | `admin@trickyrealestate.ae` | `TrickyAdmin2026!` | Global access to all 40 leads, pipeline, leaderboard, viewings, and property CRUD |
| **Tariq Al-Mansoor** | Senior Advisor | `tariq@trickyrealestate.ae` | `Tariq2026!` | Scoped to Tariq's assigned leads and viewings only |
| **Elena Rostova** | Senior Advisor | `elena@trickyrealestate.ae` | `Elena2026!` | Scoped to Elena's assigned leads and viewings only |
| **Marcus Sterling** | Senior Advisor | `marcus@trickyrealestate.ae` | `Marcus2026!` | Scoped to Marcus's assigned leads and viewings only |

---

## 🐙 Step-by-Step Instructions to Save to GitHub

Follow these exact steps to push this entire project to your personal GitHub account:

### Step 1: Create a New Repository on GitHub
1. Log in to [github.com](https://github.com).
2. In the top right corner, click the **`+`** icon and select **New repository**.
3. Repository name: enter `tricky-real-estate` (or any name you prefer).
4. Description: `Ultra-Luxury Dubai Property Sales & Private CRM Platform`.
5. Choose **Public** or **Private** (recommended: Private).
6. **Important**: Leave "Add a README file", "Add .gitignore", and "Choose a license" **UNCHECKED** (we have already created all of these for you).
7. Click **Create repository**.
8. Copy the repository URL (e.g. `https://github.com/YOUR_USERNAME/tricky-real-estate.git`).

### Step 2: Initialize Git and Check Secret Protections
In your terminal, run:
```bash
git init
```
Verify that `.gitignore` is in place so that `.env` and `node_modules` are protected and will never be uploaded to GitHub:
```bash
git status
```
*(Notice that `.env` is NOT listed in the untracked files — your private database keys and passwords remain completely safe!)*

### Step 3: Stage and Commit the Project Files
Run:
```bash
git add .
git commit -m "feat: complete luxury Dubai real estate platform & enhanced CRM suite"
```

### Step 4: Link Your GitHub Repository and Push
Replace `YOUR_USERNAME` and `REPO_NAME` with your actual GitHub repository URL and run:
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

If prompted by GitHub, sign in using your GitHub credentials or Personal Access Token (PAT). Your entire project is now securely saved and version-controlled on GitHub!

---

## 📁 Project File Directory

```
├── .env                       # Local private environment variables (NEVER committed to git)
├── .env.example               # Safe distribution template for environment variables
├── .gitignore                  # Git exclusions (protects .env, node_modules, logs)
├── package.json               # Node.js project manifest & scripts
├── package-lock.json          # Locked dependency tree
├── server.js                  # Express backend, rate-limiting, anti-spam, security & CRM API
├── robots.txt                 # Search engine rules (hides admin, allows public pages)
├── sitemap.xml                # Search engine XML sitemap for public SEO discovery
├── 404.html                   # Ultra-luxury custom 404 Not Found page
├── 500.html                   # Ultra-luxury custom 500 Server Interruption page
├── index.html                 # Luxury Home Page
├── properties.html            # Ready Properties Catalog & Filter Bar
├── off-plan.html              # Off-Plan Projects & Payment Plans
├── mortgage.html              # Mortgage & DLD Upfront Costs Calculator
├── sell.html                  # Property Valuation Request Page
├── about.html                 # Heritage & Leadership Team Page
├── contact.html               # Downtown Dubai Headquarters Contact Page
├── login.html                 # Private Staff Authentication Portal
├── admin.html                 # Full CRM Suite (Dashboard, Kanban, Leads, Inventory)
├── css/
│   └── style.css              # Master design system, tokens, typography, luxury loader, responsive rules
├── js/
│   └── shared.js              # Floating WhatsApp/Callback, luxury loader, anti-spam form handlers
├── db/
│   ├── index.js               # Database controller (Neon PostgreSQL + local fallback)
│   ├── schema.sql             # Complete PostgreSQL schema (8 tables)
│   └── seedData.js            # Sample data (5 devs, 6 projects, 15 properties, 40 leads, sales, staff)
└── assets/
    └── images/                # High-definition Dubai architectural photos
```

---

## 🛡️ License & Confidentiality
Confidential property of Tricky Real Estate LLC. All property descriptions, developer titles, and architectural illustrations are bespoke representations for private client advisory in Dubai, UAE.
