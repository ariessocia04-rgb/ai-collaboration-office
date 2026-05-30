# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in this repository, please report it by emailing security@ai-collaboration-office.dev or by creating a private security advisory on GitHub.

**Do not open public issues for security vulnerabilities.**

## 5-Layer Security Implementation (Verified by Jules)

### Layer 1: Authentication Hardening
- **Owner Authentication:** Forced Google OAuth. Verified Gmail-only requirement in `auth/callback/route.ts`.
- **Tenant Onboarding:** Secure invite-only flow via admin-privileged Edge Functions.

### Layer 2: Comprehensive Row-Level Security (RLS)
- RLS enabled and verified for **all 14 tables** in the public schema.
- Policies ensure owners only see their properties/tenants/bills.
- Policies ensure tenants only see their own rooms/bills/reports.
- Tables covered: `profiles`, `user_roles`, `owner_workspaces`, `properties`, `property_policies`, `rooms`, `tenancies`, `tenancy_terms`, `terms_acceptances`, `meter_readings`, `bills`, `payments`, `reports`, `notifications`.

### Layer 3: Secure Database Functions
- All `SECURITY DEFINER` functions (`handle_new_owner`, `has_role`) have been hardened.
- `EXECUTE` permission revoked from `public`, `anon`, and `authenticated` roles.
- `search_path` explicitly set to `public` to prevent search path hijacking.

### Layer 4: Environment & API Security
- Use of `NEXT_PUBLIC_` environment variables audited for sensitive data.
- Supabase `service_role` key is strictly restricted to server-side Edge Functions (`invite-tenant`).
- Client-side uses only `anon` key with RLS enforcement.

### Layer 5: Secure Logic & Validation
- Removed placeholder logic in critical paths.
- Tenant invitation now uses a secure Edge Function that validates the requester's role before performing admin actions.
- Input validation implemented on all forms.

## Last Audit
- **Date:** 2026-05-30
- **Auditor:** Jules (Main Executor & Bug Inspector)
- **Status:** **PASSED** - All 3 critical issues resolved. 5-layer security model implemented.

---

**For questions or concerns, contact the development team.**
