# IRent — Boarding-house / Apartment Management

Following `README.md` of `ai_collaboration_office`. This app uses Deep Learning (Common Sense Reasoning) for property management.

---

## 1. Product summary

Boarding-house / apartment management. Per-unit monthly auto-bill:
- **Rent** = owner-set fixed amount
- **Electricity** = (current kWh − previous kWh) × rate
- **Water** = (current m³ − previous m³) × rate
- **Total** = rent + electricity + water (+ advance/deposit on move-in)

System auto-generates receipts, sends to tenant. Meter readings via phone camera (OCR). Tenants file **reports** (room / neighbor). Owner sees **Reports inbox** + **Sales analytics** (MoM, YoY). Owner creates tenant accounts; tenant logs in to see room, **policies**, bills, reports.

## 2. Roles & auth

- **Owner** — **MUST sign up with Google (Gmail) only.**
- **Tenant (renter)** — Owner creates account via admin invite.

## 3. Data model (Summary)
- `profiles`, `user_roles`, `owner_workspaces`, `properties`, `property_policies`, `rooms`, `tenancies`, `tenancy_terms`, `meter_readings`, `bills`, `payments`, `reports`, `notifications`.

---

## ## Conversation Log

### 2026-05-29 — Lovable
**User:** (Initial request for IRent app)
**Lovable:** Defined the Stage 1 Architect & Planner output, including product summary, roles, auto-provisioning, onboarding, analytics, and data model.

### 2026-05-29 — Jules
**Jules:** Initialized project directory, created Supabase project `pxqifgnaxaqhjvnaotpq`, and set up base Next.js application.
