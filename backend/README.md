# Savrajas Shared Backend & Sync API

This backend acts as the single secure bridge between the **Savrajas Website** and the **Savrajas Android App**, coordinating data persistence in the centralized **Supabase** database.

## Architecture

```
┌─────────────────────┐             ┌─────────────────────┐
│   Savrajas Website  │             │ Savrajas Android App│
│   (HTML/CSS/JS)     │             │   (Admin Mobile)    │
└──────────┬──────────┘             └──────────┬──────────┘
           │ (Direct / Shared DB)              │ (Bearer JWT / HTTPS)
           ▼                                   ▼
┌─────────────────────────────────────────────────────────┐
│            Savrajas Node.js Express Backend             │
│        Authentication (PIN / JWT), Validation,          │
│            CORS, Rate Limiting, Health Check            │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
          ┌──────────────────────────────────┐
          │   Centralized Supabase Database  │
          │  - savrajas_pricing              │
          │  - savrajas_portfolio            │
          │  - savrajas_leads                │
          └──────────────────────────────────┘
```

## Security Design
- **Zero Exposed Keys on Android:** No database passwords, service role keys, or sensitive credentials reside on the Android client.
- **PIN-based JWT Authentication:** The Android app authenticates against `POST /api/auth/login` using the administrative PIN. On success, a signed JWT token is issued and stored in encrypted Android app storage.
- **Token Verification:** All mutation endpoints (`PUT`, `POST`, `DELETE`, `PATCH`) and protected data reads (`/api/leads`, `/api/dashboard/stats`) require `Authorization: Bearer <token>`.
- **CORS & Input Validation:** Fully configured for browser and mobile environments.

## Endpoints

### 1. Health
- `GET /api/health` — Service status check.

### 2. Authentication
- `POST /api/auth/login` — `{ "pin": "1234" }` (returns `{ success: true, token, expiresAt }`)
- `GET /api/auth/verify` — (Protected) Verify active session.
- `PUT /api/auth/pin` — (Protected) Update admin PIN.

### 3. Pricing
- `GET /api/pricing` — Returns active pricing tiers and add-ons.
- `PUT /api/pricing` — (Protected) Update pricing tiers and add-ons. Changes reflect instantly on website and Android.

### 4. Portfolio
- `GET /api/portfolio` — Returns portfolio case studies.
- `POST /api/portfolio` — (Protected) Create new portfolio project.
- `PUT /api/portfolio/:id` — (Protected) Update an existing project.
- `DELETE /api/portfolio/:id` — (Protected) Remove a project.

### 5. Client Leads / CRM
- `GET /api/leads` — (Protected) Returns client inquiries received from the website.
- `POST /api/leads` — Ingest new lead submission (from website or Android).
- `PATCH /api/leads/:id/status` — (Protected) Update lead status (`new`, `contacted`, `converted`, `archived`).
- `DELETE /api/leads/:id` — (Protected) Delete a lead.

### 6. Dashboard
- `GET /api/dashboard/stats` — (Protected) Returns pipeline totals, lead counts, and sync status.

## Starting the Server

```bash
cd backend
npm install
npm start
```
By default, the server runs on `http://localhost:5000`.

To run the automated API suite:
```bash
node test/api.test.js
```

