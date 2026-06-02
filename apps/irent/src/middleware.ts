import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require no auth
const PUBLIC_ROUTES = ['/', '/login', '/login/tenant', '/auth/callback', '/auth/auth-code-error'];

// Routes only owners can access
const OWNER_ROUTES = ['/dashboard', '/onboarding', '/tenants', '/rooms', '/meter-readings', '/reports', '/bills'];

// Routes only tenants can access
const TENANT_ROUTES = ['/tenant-portal', '/welcome'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow public routes and static assets
  if (
    PUBLIC_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/')) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Not logged in — send to login
  if (!user) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Get user role
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  const role = roleData?.role ?? 'tenant';

  // Tenant trying to access owner routes → send to tenant portal
  if (role === 'tenant' && OWNER_ROUTES.some(r => pathname.startsWith(r))) {
    // But first check if they accepted terms
    const { data: profileData } = await supabase
      .from('profiles')
      .select('terms_accepted_at')
      .eq('id', user.id)
      .single();

    if (!profileData?.terms_accepted_at && pathname !== '/welcome') {
      return NextResponse.redirect(new URL('/welcome', request.url));
    }

    if (pathname !== '/tenant-portal') {
      return NextResponse.redirect(new URL('/tenant-portal', request.url));
    }
  }

  // Owner trying to access tenant routes → send to dashboard
  if (role === 'owner' && TENANT_ROUTES.some(r => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
