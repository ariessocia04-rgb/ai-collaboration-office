# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in this repository, please report it by emailing security@ai-collaboration-office.dev or by creating a private security advisory on GitHub.

**Do not open public issues for security vulnerabilities.**

## Security Practices

### Environment Variables
- Never commit `.env` files to the repository
- All sensitive credentials must be stored in GitHub Secrets or deployment platform (Vercel, Supabase)
- Use `.env.example` as a template for developers

### API Keys & Secrets
- Rotate API keys regularly
- Use separate keys for development and production
- Supabase: Use row-level security (RLS) policies on all tables
- Never expose Supabase project IDs or API keys in documentation

### Authentication
- Owner authentication: Google OAuth only (required)
- Tenant accounts: Created via admin invite with secure links
- All auth flows use Supabase auth-helpers-nextjs

### Database Security
- All Supabase tables must have RLS enabled
- Service role keys only used server-side
- Anon keys restricted to specific tables and operations

### Dependencies
- Dependabot enabled for automated security updates
- Review all major version updates before deploying
- Run `npm audit` before each release

### Code Review
- All changes require code review before merging
- Security audit required before production deployment
- Jules inspects all critical changes

## Compliance

This project follows:
- OWASP Top 10 security guidelines
- Supabase security best practices
- Next.js security recommendations

## Last Audit
- **Date:** 2026-05-30
- **Auditor:** Security Audit by GitHub Copilot
- **Status:** 3 Critical issues identified, awaiting Jules inspection

---

**For questions or concerns, contact the development team.**
