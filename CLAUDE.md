# CLAUDE.md — Foxtail AI

> **Read this entire document at the start of every session. Update sections 12, 13, and 15 after completing significant changes.**

---

## 1. Project Overview

**Project Name:** Foxtail AI (formerly Centrefit TailGate AI)
**Description:** AI-powered anti-tailgating detection system that monitors CCTV feeds at access-controlled doors to detect unauthorised entries (tailgating) at gyms and access-controlled facilities.
**Built By:** Centrefit Pty Ltd (security & access control company)
**Target Market:** Snap Fitness clubs — 300+ locations in Australia (Liftbrands), 2,500+ in the US. Hardware-agnostic, gym-brand-agnostic, scales to any access-controlled facility.
**Business Model:** $99/month per site (per door billing). Customer-centric: each Customer (gym owner/franchisee) owns Sites. Foxtail bills directly via Stripe (not distributor billing).
**Current Stage:** MVP deployed and tested at Centrefit office. 23 potential sales in pipeline.
**Domain:** foxtailai.com.au (DNS on Cloudflare)
**Dashboard URL:** https://www.foxtailai.com.au
**Local Path:** `C:\Users\mitch\OneDrive\Documents\Projects\Foxtail\` (home PC)
**Work PC Path:** `C:\Users\suzy\Documents\Foxtail\foxtail-edge\`

---

## 2. System Architecture

Hub-and-spoke model with three components:

```
[Edge Device at Gym]  ──HTTPS──►  [Railway Backend API]  ──SQL──►  [Supabase PostgreSQL]
                                         ▲
                                         │
                                  [Vercel Dashboard]
```

### 2.1 Edge Software (Per-Site)
Python app on local compute device (Jetson Nano, Intel NUC, or standard Windows PC). Connects to two Dahua cameras via RTSP. Runs YOLOv8 person detection locally. Self-contained, no access control API integration needed.

### 2.2 Platform Backend (Cloud)
FastAPI on Railway. JWT auth, site management, alert aggregation, device registration, edge device communication.

### 2.3 Dashboard Frontend
React SPA on Vercel. Role-based access control. Manages customers, sites, devices, alerts, users. Auto-deploys from GitHub.

---

## 3. Tech Stack

| Component | Technology |
|---|---|
| Edge Detection | Python, YOLOv8n, OpenCV, RTSP |
| Edge Setup Wizard | Flask + HTML/JS (http://device-ip:8080) |
| Backend API | FastAPI, SQLAlchemy, Alembic, JWT (python-jose), bcrypt |
| Database | PostgreSQL on Supabase (Sydney region) |
| File Storage | Supabase Storage (alert-evidence bucket) |
| Email | Resend (alerts@foxtailai.com.au, 100/day free) |
| Dashboard | React (Vite), Tailwind CSS, Lucide React |
| Dashboard Hosting | Vercel (auto-deploy from GitHub) |
| Backend Hosting | Railway (auto-deploy from GitHub) |
| DNS | Cloudflare (transferred from Crazy Domains for TXT record support) |
| Domain Registrar | Crazy Domains |
| Email Hosting | Titan Email (@foxtailai.com.au) |
| Remote Access | RustDesk (per-device credentials stored in DB) |

---

## 4. GitHub Repositories

| Repo | Contains | Deploys To |
|---|---|---|
| `mitchpearce94-afk/foxtail-ai` (private) | Platform API + Edge software | Railway |
| `mitchpearce94-afk/foxtail-dashboard` (private) | React dashboard | Vercel (app.foxtailai.com.au) |
| `mitchpearce94-afk/foxtail-website` (private) | Marketing site | Vercel (foxtailai.com.au) |

---

## 5. Project Structure

### Edge Software (`foxtail-ai/tailgate/edge/`)
```
edge/
├── main.py                    # Main entry point, wires all components, platform sync
├── view_cameras.py            # Visual testing tool with live feeds
├── setup_zones.py             # Interactive tripwire/reader zone config
├── core/
│   ├── camera.py              # RTSP camera management, threaded capture
│   ├── detector.py            # YOLOv8 detection, centroid tracking, tripwire + first-appearance entry
│   ├── scan_detector.py       # Card scan gesture detection on outside camera
│   ├── correlator.py          # Scan vs entry count correlation, guest allowance
│   └── door_ajar.py           # Propped door detection
├── alerts/
│   └── alert_manager.py       # Email alerts, dual-camera 20s clip extraction, H.264 re-encoding
├── sync/
│   └── platform_sync.py       # Edge-to-cloud comms, heartbeats, alert push, clip upload, remote config
├── setup/
│   ├── server.py              # Flask setup wizard backend (8-step + onboarding)
│   └── static/index.html      # Setup wizard frontend
└── config/
    ├── config.yaml            # Site-specific config
    └── config.example.yaml    # Template with correct defaults
```

### Platform Backend (`foxtail-ai/tailgate/platform/`)
```
platform/
├── api/
│   ├── main.py                # FastAPI app, auto-migrations, startup
│   ├── models/database.py     # SQLAlchemy models (customers, sites, users, alerts, clips, edge_devices)
│   ├── routers/
│   │   ├── auth.py            # Login, register, me
│   │   ├── sites.py           # Site CRUD, config, snapshots, delete cascade
│   │   ├── alerts.py          # Alert management, bulk review
│   │   ├── devices.py         # Device registration, RustDesk fields, update
│   │   ├── edge_api.py        # Heartbeat, alerts, snapshots, clip upload, onboard, validate-token
│   │   ├── customers.py       # Customer CRUD, transfers, delete
│   │   ├── users.py           # User CRUD, role management, delete
│   │   ├── billing.py         # Stripe checkout, webhooks, portal, billing status
│   │   └── distributors.py    # Distributor applications, approve/reject, locations
│   └── services/
│       ├── storage.py         # Supabase Storage uploads, public URLs
│       ├── email_service.py   # Resend email alerts with snapshots + video links
│       ├── billing_service.py # Stripe integration (checkout sessions, subscriptions)
│       ├── distributor_email.py # Distributor notification emails (apply, approve, reject)
│       └── s3.py              # Compatibility shim → storage.py
├── requirements.txt
├── alembic/                   # Database migrations
└── start.py                   # Entry point for Railway (reads PORT env)
```

### Dashboard (`foxtail-dashboard/`)
```
foxtail-dashboard/
├── src/
│   ├── App.jsx                # Main app with all pages, modals, RBAC
│   └── services/api.js        # API client (all backend calls)
├── package.json
└── vite.config.js
```

---

## 6. Database

**Supabase Project:** foxtail-ai
**Region:** Sydney (ap-southeast-2)
**Host:** db.nnsvssgnssetuxdhyrob.supabase.co
**Session Pooler (use this):** aws-1-ap-southeast-2.pooler.supabase.com:5432

### Tables

| Table | Purpose |
|---|---|
| customers | Gym owners/franchisees (name, email, phone, billing rate, stripe_customer_id, billing_status, stripe_subscription_id, billing_started_at) |
| sites | Gym locations (name, address, device_token, device_config, config_version, status, device_sn, doors, price_per_door=$99, billing_active) |
| users | Login accounts with roles, assigned_sites, must_change_password, invite_token, invite_token_expires_at, has_completed_onboarding, customer_id |
| alerts | Detection events (timestamp, confidence, door, type, media URLs, email_sent flag) |
| clips | Video evidence linked to alerts |
| edge_devices | Device registration, heartbeat data, camera snapshots, rustdesk_id/password, hostname, notes |
| distributors | Distributor applications (business_name, abn, contact_name, email, phone, business_type, state, status, admin_notes) |
| distributor_locations | Multi-location support (distributor_id FK, state, city, street_address, postcode, service_area, phone, is_primary) |
| alembic_version | Migration tracking |

**Storage:** Supabase Storage bucket `alert-evidence` (public). Paths: `clips/{site_code}/{alert_id}/{camera}.{ext}`

---

## 7. Detection Pipeline

### Person Detection
YOLOv8n (nano model). CentroidTracker with persistent IDs. Bottom-center of bbox as centroid (feet position). ~4 FPS per camera (8 FPS total, alternating).

### Tripwire Crossing
Virtual tripwire from two percentage-based points. Compares first-seen position `centroids[0]` vs current `centroids[-1]`. If sides differ, crossing fires. Track deleted after `max_disappeared_frames` (40 frames, ~10s).

### First-Appearance Entry (Solid Door Fallback)
For solid doors where YOLO first detects a person already past the tripwire. **6 mandatory gates:**
1. Minimum confidence 0.65 (IR phantoms score 50-55%)
2. Minimum 5 frames tracked (~1.25s at 4 FPS)
3. First centroid within 15% of frame diagonal from tripwire
4. ALL centroids on entry side
5. Currently close to tripwire
6. Moving away from tripwire (into room, not exiting)

### Scan Gesture Detection
Reader zone rectangle on outside camera. Requires 3 consecutive frames of bbox overlap (~0.75s). Uses centroid (feet) distance, not bbox edge. min_dwell_seconds=0.5, proximity_threshold_pct=0.15.

### Correlation Engine
Evaluates immediately on each entry. Guest allowance: `max_persons_per_scan` (1=standard, 2=member+guest, 3=member+2 guests). Scan usage tracked per-scan. Alert fires when entries exceed scan capacity.

### Door Ajar Detection
Sustained unsecured entry pattern = propped door. Entry threshold within time window with high unsecured-to-total ratio.

---

## 8. Role-Based Access Control

| Role | Tier | Permissions |
|---|---|---|
| Foxtail Admin | Internal | Full access: all customers, sites, devices, users, billing, settings, delete |
| Foxtail Staff | Internal | Operational: manage customers & sites, no billing/pricing, no delete |
| Site Manager | Customer | Manage assigned sites: view alerts, test cameras, manage viewers |
| Viewer | Customer | Read-only access to assigned sites |

---

## 9. Infrastructure & Environment Variables

### Railway Backend
**URL:** https://web-production-af09.up.railway.app
**Swagger:** https://web-production-af09.up.railway.app/docs

| Variable | Purpose |
|---|---|
| DATABASE_URL | Supabase PostgreSQL connection string |
| SECRET_KEY | JWT token signing |
| CORS_ORIGINS | Allowed dashboard URLs |
| PORT | Set by Railway |
| SUPABASE_URL | Project URL for Storage API |
| SUPABASE_SERVICE_KEY | Service role key for Storage uploads |
| RESEND_API_KEY | Email sending |
| ALERT_FROM_EMAIL | alerts@foxtailai.com.au |
| DASHBOARD_URL | https://app.foxtailai.com.au |
| INSTALLER_KEY | Auth key for setup wizard onboarding (default: ftx-install-2026) |
| STRIPE_SECRET_KEY | Stripe API secret key |
| STRIPE_WEBHOOK_SECRET | Stripe webhook signing secret |
| STRIPE_PRICE_ID | Stripe price ID for $99/mo per-site plan |
| STRIPE_PUBLISHABLE_KEY | Stripe publishable key (frontend checkout) |

### Vercel Dashboard
**URL:** foxtail-dashboard.vercel.app / app.foxtailai.com.au
**Env:** VITE_API_URL → Railway backend URL

### Default Admin Login
admin@foxtailai.com.au / changeme (MUST CHANGE)

---

## 10. Key Features Built

### Edge Device
- YOLOv8 person detection with centroid tracking
- Tripwire crossing + first-appearance entry (6-gate hardened)
- Scan gesture detection (3-frame overlap, centroid distance)
- Correlation engine with guest allowance (max_persons_per_scan)
- Door ajar detection
- Dual-camera 20s clip extraction (10s before + 10s after) with H.264 re-encoding
- Background threaded frame capture
- Platform sync: heartbeats (60s), immediate alert push, clip upload
- Camera snapshots uploaded every 60s
- Remote config pull (applies live without restart)
- Timestamp-prefixed event IDs (no collision on restart)

### Setup Wizard (http://device-ip:8080)
- 8-step wizard: network check → find cameras → assign cameras → set tripwire → set reader zone → register site (on-site onboarding) → verify & complete → start monitoring
- On-site onboarding: tech creates customer + site + site manager directly (no admin needed)
- Fallback: paste device token mode for pre-created sites
- Default password FoxtailSetup! with forced change
- Guest allowance dropdown in Step 7

### Platform Backend
- Full CRUD for customers, sites, users, devices, alerts
- Edge API: heartbeat, alerts, snapshots, clip upload, onboard, validate-token
- Auto-activate site on first heartbeat
- Alert deduplication by edge_event_id
- Instant email on alert arrival (Resend)
- Remote device config (push via heartbeat)
- Delete cascade (sites, users, customers)
- Auto-generated site codes and device serial numbers (FTX-ED-001)
- Stripe billing: checkout sessions, webhook handling (subscription lifecycle), billing portal
- User invite flow: email invite with token, set-password endpoint, onboarding completion
- Customer-user linking: customer_id on users, auto-scoped site access
- Distributor system: public apply, admin approve/reject, email notifications, multi-location support

### Dashboard
- Overview with KPI cards, live camera status, recent alerts
- Customer management with site ownership and transfers
- Site management with device assignment, live camera snapshots, remote config
- Alert viewer with tabs (New/Reviewed/False+/All), bulk actions, evidence display
- Device management with RustDesk remote access integration
- User management with role assignment, invite flow, delete
- Styled ConfirmModal replacing native confirm() dialogs
- 30s auto-refresh polling
- Configure Device modal: draw tripwire/reader zone on live snapshot, detection settings
- Billing page: Stripe checkout, subscription status, billing portal link
- Distributor management: approve/reject applications, multi-location CRUD, state badges

### Marketing Website (foxtailai.com.au)
- React SPA with inline CSS, single-file architecture
- Pages: Home, How It Works, Pricing, Find a Distributor, Become a Distributor, Contact
- Distributor application form (POSTs to backend API)
- Public distributor listing with state filter pills and company-grouped cards
- Contact form (POSTs to backend API)
- No email addresses exposed — all communication via forms

### USB Installer
- install.bat: auto-detects Python/RustDesk versions, offline wheel support, ffmpeg pre-cache
- download-wheels.bat: pre-cache pip packages for offline installs
- Auto-start, firewall rules, sleep/crash prevention

---

## 11. Detection Scenarios

| Scenario | Outside Camera | Inside Camera | Result |
|---|---|---|---|
| Normal entry | 1 scan | 1 person enters | No alert |
| Tailgating | 1 scan | 2+ people enter | Tailgate alert |
| No scan entry | 0 scans | 1+ people enter | Unauthorised alert |
| Door propped | 0 scans | Continuous entries | Door ajar alert |
| Guest allowed | 1 scan | 2 people enter | No alert (if max_persons_per_scan=2) |

---

## 12. Current Status

### What's Working (✅)
- Edge detection with YOLOv8 on real Dahua RTSP cameras
- First-appearance entry detection with 6-gate hardening
- Scan gesture detection with centroid distance and 3-frame overlap
- Correlation engine with guest allowance
- Platform sync with immediate alert push and clip upload
- Setup wizard with on-site onboarding (no admin needed)
- Full dashboard with RBAC, live cameras, remote config, alert evidence
- Email alerts via Resend with inline snapshots and video links
- Video evidence pipeline (Supabase Storage)
- RustDesk remote access per device
- USB installer for pre-staging
- Custom domain (foxtailai.com.au) with SSL on Cloudflare
- 17-page technician setup guide (PDF)
- Stripe billing integration ($99/mo AUD per site, checkout, webhooks, billing portal, billing gate)
- Customer onboarding flow (invite emails, password setup, guided tutorial)
- Customer-user linking (customer_id on users, auto-scope to own sites)
- Distributor system (application form, admin approve/reject, email notifications, multi-location support)
- Marketing website: distributor application form, public distributor listing, contact form
- Marketing website: "Find a Distributor" page with state filter pills and company-grouped cards
- Marketing website: SPA rewrites (vercel.json) for direct URL navigation
- Alerts nav RBAC fix (viewAlerts/reviewAlerts enabled for foxtail_admin and foxtail_staff)
- E2E test suite: 63 Playwright tests across 12 files (auth, navigation, RBAC, all pages, billing gate, marketing site)

### What's Pending (🔨)
- Deploy updated edge code to work PC (false positive fixes from Session 20)
- New work PC setup using USB installer
- Further on-site testing with hardened first-appearance detection

### What's Not Started (📋)
- Mobile app (Capacitor/React Native) for site managers
- Multi-door expansion (multiple door pairs per site)
- Files subdomain (files.foxtailai.com.au via Cloudflare R2)
- Over-the-air edge updates
- MAC address display in setup wizard camera discovery
- Facial biometric member identification

---

## 13. TODO / Roadmap

### Immediate (Market Ready)
1. Deploy Session 19+20 edge fixes to work PC
2. On-site walk-through testing with real people
3. New work PC setup via USB installer

### Short Term
- Mobile app for site managers (push notifications, persistent login)
- Multi-door expansion (multiple camera pairs per site)
- Files subdomain for installers/updates (Cloudflare R2)
- Reader zone sensitivity tuning for quick card taps

### Medium Term
- Over-the-air edge software updates
- Scale to 300+ AU Snap Fitness locations
- USB installer refinement and mass pre-staging

### Long Term
- US expansion (2,500+ Snap Fitness locations)
- Multi-brand support (Planet Fitness, Anytime Fitness, etc.)
- Advanced analytics and reporting
- Facial biometric member identification

---

## 14. Bugs Fixed (Key Lessons)

| Bug | Root Cause | Fix |
|---|---|---|
| Tripwire not registering at low FPS | YOLO detects person already past tripwire | First-position vs current-position comparison (centroids[0] vs centroids[-1]) |
| IR phantom false positives at night | No minimum confidence on first-appearance | 6-gate system: min 0.65 confidence, 5 frames tracked, proximity checks |
| Staff walk-up false positive | First-appearance didn't check where person appeared from | Gate 3: first centroid must be within 15% of tripwire |
| Scan too aggressive (walk-bys) | Single frame bbox overlap triggered scan | 3 consecutive frames required, centroid distance, 0.5s dwell |
| Event ID collisions on restart | Counter reset to 1 each startup | Timestamp-prefixed IDs: TG-2603060613-0001 |
| Duplicate alerts on clip upload | on_alert_with_clips re-pushed entire event | upload_clips_for_alert() method — uploads to existing alert |
| Browser can't play video | OpenCV writes mp4v not H.264 | Re-encode with ffmpeg via imageio-ffmpeg |
| Timestamps wrong (AEST vs UTC) | Edge sent local time without timezone marker | Site timezone from config.yaml with zoneinfo module |
| Dashboard CRUD not persisting | Only updating React state, never calling API | Wired all create/update/delete to backend API |

---

## 15. Session History

| Date | Session | Changes |
|------|---------|---------|
| Pre-Feb 2026 | 1-10 | Core edge detection, platform API, dashboard, initial deployment |
| 11 Feb 2026 | 14 | Dashboard CRUD wiring, DB fix, password change flow, custom domain, setup wizard |
| 12 Feb 2026 | 15 | Platform sync wired, edge deployed at work, live snapshots, remote config, site management, RustDesk |
| 12 Feb 2026 | 16 | Alert bug fixes (dedup, confidence, auto-refresh, timestamps), RustDesk detail panel, DNS propagated, infrastructure + setup guides created |
| 13 Feb 2026 | 17 | Supabase Storage for clips, Resend email alerts, dual-camera 20s clips, timezone-correct timestamps, DNS to Cloudflare |
| 5-6 Mar 2026 | 19 | New cameras, setup wizard fixes, solid door first-appearance detection, scan detection overhaul, event ID fix, immediate flush, instant email, H.264 re-encoding, USB installer, alerts page restored |
| 10 Mar 2026 | 20 | 6-gate first-appearance hardening, guest allowance (max_persons_per_scan), on-site onboarding in wizard, delete users/customers, styled ConfirmModals, USB installer rebuilt, 17-page setup guide PDF, homepage stats updated |
| 11-12 Mar 2026 | 21-22 | Stripe billing (checkout, webhooks, portal, billing gate $99/mo AUD), customer onboarding (invite emails, password setup, guided tutorial), distributor system (application form, admin approval, public listing, multi-location), E2E test suite (63 Playwright tests across 12 files), RBAC fix (alerts nav), website SPA rewrites, DASHBOARD_URL fix |

---

## 16. Rules for Claude Code

1. **Read this entire document** at the start of every session.
2. **Update this document** after significant changes — especially sections 12, 13, and 15.
3. **Three repos:** Edge+Platform in `foxtail-ai`, Dashboard in `foxtail-dashboard`, Marketing site in `foxtail-website`. Push each separately.
4. **Git after changes:** `git add -A && git commit -m "descriptive message" && git push origin main`
5. **Use `python -m pip`** instead of `pip` directly on Windows.
6. **Edge detection is sensitive.** Do not change detection thresholds, gate values, or correlation logic without explicit approval. These have been carefully tuned through extensive testing.
7. **Test site config:** NVR 192.168.11.242, admin/CFp@!$DL2576? (URL-encoded in RTSP). Inside=ch1, Outside=ch3.
8. **Original test site:** NVR 192.168.11.66, admin/centreFit2014. Inside=ch3, Outside=ch5.
9. **Railway env vars:** 14 total. Check section 9 before adding new ones.
10. **Supabase auto-migrations:** Backend main.py auto-adds columns on startup. Alembic for schema changes.
11. **Don't over-engineer.** Ship working code. 23 sales waiting.
12. **Ask before architectural changes** affecting edge detection pipeline, database schema, or multi-site flow.

---

*Last updated: 12 March 2026*
*Updated by: Mitchell / Claude*
