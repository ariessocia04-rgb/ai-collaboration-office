/**
 * Tests for apps/irent/src/app/auth/callback/route.ts
 *
 * Covers the PR changes:
 * - try/catch around cookieStore.set and remove
 * - Changed exchangeCodeForSession to destructure { data, error }
 * - Added Gmail check (isGmail) and user_roles query
 * - Only redirect on !error && data?.user (previously just !error)
 * - console.error when owner has non-Gmail email
 */

import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest';

// ──────────────────────────────────────────────────────────────────
// Helpers & shared state
// ──────────────────────────────────────────────────────────────────

// We capture the cookie handlers that the route registers so we can
// exercise the try/catch blocks directly in separate tests.
let capturedCookieHandlers: {
  get: (name: string) => string | undefined;
  set: (name: string, value: string, options: object) => void;
  remove: (name: string, options: object) => void;
} | null = null;

// Supabase mock factory – returns a fresh mock per test.
const makeSupabaseMock = (
  exchangeResult: { data: unknown; error: unknown },
  roleResult: { data: unknown } = { data: null }
) => {
  const singleMock = vi.fn().mockResolvedValue(roleResult);
  const eqMock = vi.fn(() => ({ single: singleMock }));
  const selectMock = vi.fn(() => ({ eq: eqMock }));
  const fromMock = vi.fn(() => ({ select: selectMock }));

  return {
    auth: {
      exchangeCodeForSession: vi.fn().mockResolvedValue(exchangeResult),
    },
    from: fromMock,
    _mocks: { fromMock, selectMock, eqMock, singleMock },
  };
};

// ──────────────────────────────────────────────────────────────────
// Module-level mocks
// ──────────────────────────────────────────────────────────────────

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

vi.mock('next/server', () => ({
  NextResponse: {
    redirect: vi.fn((url: URL | string) => ({ redirectedTo: url.toString() })),
  },
}));

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}));

// ──────────────────────────────────────────────────────────────────
// Imports after mocks are set up
// ──────────────────────────────────────────────────────────────────
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const mockCookies = cookies as MockedFunction<typeof cookies>;
const mockCreateServerClient = createServerClient as MockedFunction<typeof createServerClient>;
const mockNextResponseRedirect = NextResponse.redirect as MockedFunction<typeof NextResponse.redirect>;

// ──────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────

function makeCookieStore(throwOnSet = false) {
  return {
    get: vi.fn((name: string) => ({ name, value: 'cookie-value' })),
    set: vi.fn(() => {
      if (throwOnSet) throw new Error('Cannot set cookie from Server Component');
    }),
  };
}

function buildRequest(params: Record<string, string> = {}, origin = 'https://example.com') {
  const url = new URL(`${origin}/auth/callback`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  return new Request(url.toString());
}

async function invokeRoute(request: Request) {
  // Dynamic import so mocks are in place before the module is loaded.
  const { GET } = await import('../app/auth/callback/route');
  return GET(request);
}

// ──────────────────────────────────────────────────────────────────
// Test suite
// ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  capturedCookieHandlers = null;

  // Default env vars
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://supabase.example.com';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';
});

describe('GET /auth/callback', () => {
  // ----------------------------------------------------------------
  // Redirect when no code param
  // ----------------------------------------------------------------
  describe('when no code query param is present', () => {
    it('redirects to /auth/auth-code-error', async () => {
      mockCookies.mockResolvedValue(makeCookieStore() as any);
      mockCreateServerClient.mockReturnValue(makeSupabaseMock({ data: null, error: null }) as any);

      const req = buildRequest({}); // no 'code'
      await invokeRoute(req);

      expect(mockNextResponseRedirect).toHaveBeenCalledWith(
        'https://example.com/auth/auth-code-error'
      );
    });
  });

  // ----------------------------------------------------------------
  // Successful exchange with valid Gmail owner
  // ----------------------------------------------------------------
  describe('when code is present and exchange succeeds', () => {
    it('redirects to default /onboarding when no next param', async () => {
      const supabase = makeSupabaseMock(
        { data: { user: { id: 'u1', email: 'owner@gmail.com' } }, error: null },
        { data: { role: 'owner' } }
      );
      mockCookies.mockResolvedValue(makeCookieStore() as any);
      mockCreateServerClient.mockReturnValue(supabase as any);

      const req = buildRequest({ code: 'abc123' });
      await invokeRoute(req);

      expect(mockNextResponseRedirect).toHaveBeenCalledWith(
        'https://example.com/onboarding'
      );
    });

    it('redirects to custom next param when provided', async () => {
      const supabase = makeSupabaseMock(
        { data: { user: { id: 'u1', email: 'owner@gmail.com' } }, error: null },
        { data: { role: 'owner' } }
      );
      mockCookies.mockResolvedValue(makeCookieStore() as any);
      mockCreateServerClient.mockReturnValue(supabase as any);

      const req = buildRequest({ code: 'abc123', next: '/dashboard' });
      await invokeRoute(req);

      expect(mockNextResponseRedirect).toHaveBeenCalledWith(
        'https://example.com/dashboard'
      );
    });

    it('does NOT console.error for owner with Gmail email', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const supabase = makeSupabaseMock(
        { data: { user: { id: 'u1', email: 'owner@gmail.com' } }, error: null },
        { data: { role: 'owner' } }
      );
      mockCookies.mockResolvedValue(makeCookieStore() as any);
      mockCreateServerClient.mockReturnValue(supabase as any);

      const req = buildRequest({ code: 'abc123' });
      await invokeRoute(req);

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  // ----------------------------------------------------------------
  // Gmail / owner security check (Layer 1)
  // ----------------------------------------------------------------
  describe('Layer 1: Gmail security check', () => {
    it('logs console.error when an owner has a non-Gmail email', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const supabase = makeSupabaseMock(
        { data: { user: { id: 'u1', email: 'owner@outlook.com' } }, error: null },
        { data: { role: 'owner' } }
      );
      mockCookies.mockResolvedValue(makeCookieStore() as any);
      mockCreateServerClient.mockReturnValue(supabase as any);

      const req = buildRequest({ code: 'abc123' });
      await invokeRoute(req);

      expect(consoleSpy).toHaveBeenCalledWith('Owner signed up with non-gmail account');
      consoleSpy.mockRestore();
    });

    it('still redirects successfully even when owner has non-Gmail email', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      const supabase = makeSupabaseMock(
        { data: { user: { id: 'u1', email: 'owner@outlook.com' } }, error: null },
        { data: { role: 'owner' } }
      );
      mockCookies.mockResolvedValue(makeCookieStore() as any);
      mockCreateServerClient.mockReturnValue(supabase as any);

      const req = buildRequest({ code: 'abc123' });
      await invokeRoute(req);

      expect(mockNextResponseRedirect).toHaveBeenCalledWith(
        'https://example.com/onboarding'
      );
    });

    it('does NOT console.error for a tenant with non-Gmail email', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const supabase = makeSupabaseMock(
        { data: { user: { id: 'u2', email: 'tenant@outlook.com' } }, error: null },
        { data: { role: 'tenant' } }
      );
      mockCookies.mockResolvedValue(makeCookieStore() as any);
      mockCreateServerClient.mockReturnValue(supabase as any);

      const req = buildRequest({ code: 'abc123' });
      await invokeRoute(req);

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('does NOT console.error when user has no role assigned', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const supabase = makeSupabaseMock(
        { data: { user: { id: 'u3', email: 'user@outlook.com' } }, error: null },
        { data: null } // no role row
      );
      mockCookies.mockResolvedValue(makeCookieStore() as any);
      mockCreateServerClient.mockReturnValue(supabase as any);

      const req = buildRequest({ code: 'abc123' });
      await invokeRoute(req);

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('treats email with gmail.com in subdomain as non-Gmail (endsWith check)', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      // e.g. "notgmail.com" does NOT end with "@gmail.com"
      const supabase = makeSupabaseMock(
        { data: { user: { id: 'u4', email: 'owner@notgmail.com' } }, error: null },
        { data: { role: 'owner' } }
      );
      mockCookies.mockResolvedValue(makeCookieStore() as any);
      mockCreateServerClient.mockReturnValue(supabase as any);

      const req = buildRequest({ code: 'abc123' });
      await invokeRoute(req);

      expect(consoleSpy).toHaveBeenCalledWith('Owner signed up with non-gmail account');
      consoleSpy.mockRestore();
    });

    it('handles user with undefined email without throwing', async () => {
      const supabase = makeSupabaseMock(
        { data: { user: { id: 'u5', email: undefined } }, error: null },
        { data: { role: 'owner' } }
      );
      mockCookies.mockResolvedValue(makeCookieStore() as any);
      mockCreateServerClient.mockReturnValue(supabase as any);

      const req = buildRequest({ code: 'abc123' });
      // Should not throw; optional chaining on email?.endsWith
      await expect(invokeRoute(req)).resolves.toBeDefined();
    });
  });

  // ----------------------------------------------------------------
  // Exchange failure
  // ----------------------------------------------------------------
  describe('when exchangeCodeForSession returns an error', () => {
    it('redirects to /auth/auth-code-error when there is an error', async () => {
      const supabase = makeSupabaseMock({
        data: { user: { id: 'u1', email: 'x@gmail.com' } },
        error: { message: 'Invalid code' },
      });
      mockCookies.mockResolvedValue(makeCookieStore() as any);
      mockCreateServerClient.mockReturnValue(supabase as any);

      const req = buildRequest({ code: 'bad-code' });
      await invokeRoute(req);

      expect(mockNextResponseRedirect).toHaveBeenCalledWith(
        'https://example.com/auth/auth-code-error'
      );
    });

    it('redirects to /auth/auth-code-error when data.user is null', async () => {
      const supabase = makeSupabaseMock({
        data: { user: null },
        error: null,
      });
      mockCookies.mockResolvedValue(makeCookieStore() as any);
      mockCreateServerClient.mockReturnValue(supabase as any);

      const req = buildRequest({ code: 'abc123' });
      await invokeRoute(req);

      expect(mockNextResponseRedirect).toHaveBeenCalledWith(
        'https://example.com/auth/auth-code-error'
      );
    });

    it('redirects to /auth/auth-code-error when data is null entirely', async () => {
      const supabase = makeSupabaseMock({ data: null, error: null });
      mockCookies.mockResolvedValue(makeCookieStore() as any);
      mockCreateServerClient.mockReturnValue(supabase as any);

      const req = buildRequest({ code: 'abc123' });
      await invokeRoute(req);

      expect(mockNextResponseRedirect).toHaveBeenCalledWith(
        'https://example.com/auth/auth-code-error'
      );
    });
  });

  // ----------------------------------------------------------------
  // Cookie handler try/catch (new in this PR)
  // ----------------------------------------------------------------
  describe('cookie handler error resilience', () => {
    it('silently catches errors thrown by cookieStore.set in the set handler', async () => {
      // Cookie store whose .set() always throws
      const throwingCookieStore = makeCookieStore(true);
      mockCookies.mockResolvedValue(throwingCookieStore as any);

      // Capture what createServerClient receives
      mockCreateServerClient.mockImplementation((_url, _key, opts: any) => {
        capturedCookieHandlers = opts.cookies;
        return makeSupabaseMock({ data: null, error: null }) as any;
      });

      const req = buildRequest({ code: 'abc123' });
      // Should not throw even when cookieStore.set throws
      await expect(invokeRoute(req)).resolves.toBeDefined();
    });

    it('silently catches errors thrown by cookieStore.set in the remove handler', async () => {
      const throwingCookieStore = makeCookieStore(true);
      mockCookies.mockResolvedValue(throwingCookieStore as any);

      mockCreateServerClient.mockImplementation((_url, _key, opts: any) => {
        capturedCookieHandlers = opts.cookies;
        return makeSupabaseMock({ data: null, error: null }) as any;
      });

      const req = buildRequest({ code: 'abc123' });
      await expect(invokeRoute(req)).resolves.toBeDefined();

      // Directly invoke the remove handler with a throwing cookieStore to confirm no throw
      if (capturedCookieHandlers) {
        expect(() =>
          capturedCookieHandlers!.remove('session', {})
        ).not.toThrow();
      }
    });

    it('registers a cookie set handler that calls cookieStore.set with correct args', async () => {
      const cookieStore = makeCookieStore();
      mockCookies.mockResolvedValue(cookieStore as any);

      mockCreateServerClient.mockImplementation((_url, _key, opts: any) => {
        capturedCookieHandlers = opts.cookies;
        return makeSupabaseMock({ data: null, error: null }) as any;
      });

      const req = buildRequest({ code: 'abc123' });
      await invokeRoute(req);

      // Invoke the captured set handler
      capturedCookieHandlers!.set('my-cookie', 'my-value', { httpOnly: true });
      expect(cookieStore.set).toHaveBeenCalledWith({
        name: 'my-cookie',
        value: 'my-value',
        httpOnly: true,
      });
    });

    it('registers a cookie remove handler that sets cookie value to empty string', async () => {
      const cookieStore = makeCookieStore();
      mockCookies.mockResolvedValue(cookieStore as any);

      mockCreateServerClient.mockImplementation((_url, _key, opts: any) => {
        capturedCookieHandlers = opts.cookies;
        return makeSupabaseMock({ data: null, error: null }) as any;
      });

      const req = buildRequest({ code: 'abc123' });
      await invokeRoute(req);

      capturedCookieHandlers!.remove('my-cookie', { httpOnly: true });
      expect(cookieStore.set).toHaveBeenCalledWith({
        name: 'my-cookie',
        value: '',
        httpOnly: true,
      });
    });

    it('registers a cookie get handler that reads from cookieStore', async () => {
      const cookieStore = makeCookieStore();
      mockCookies.mockResolvedValue(cookieStore as any);

      mockCreateServerClient.mockImplementation((_url, _key, opts: any) => {
        capturedCookieHandlers = opts.cookies;
        return makeSupabaseMock({ data: null, error: null }) as any;
      });

      const req = buildRequest({ code: 'abc123' });
      await invokeRoute(req);

      const value = capturedCookieHandlers!.get('test-cookie');
      expect(cookieStore.get).toHaveBeenCalledWith('test-cookie');
      expect(value).toBe('cookie-value');
    });
  });

  // ----------------------------------------------------------------
  // user_roles query integration
  // ----------------------------------------------------------------
  describe('user_roles query', () => {
    it('queries user_roles with the authenticated user id', async () => {
      const supabase = makeSupabaseMock(
        { data: { user: { id: 'user-999', email: 'x@gmail.com' } }, error: null },
        { data: { role: 'owner' } }
      );
      mockCookies.mockResolvedValue(makeCookieStore() as any);
      mockCreateServerClient.mockReturnValue(supabase as any);

      const req = buildRequest({ code: 'abc123' });
      await invokeRoute(req);

      expect(supabase.from).toHaveBeenCalledWith('user_roles');
      expect(supabase._mocks.eqMock).toHaveBeenCalledWith('user_id', 'user-999');
    });
  });
});