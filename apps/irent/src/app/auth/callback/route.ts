import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) {
          try { cookieStore.set({ name, value, ...options }); } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set({ name, value: '', ...options }); } catch {}
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data?.user) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const user = data.user;

  // Deep thinking: where should this owner go?
  // If they have NO property yet → onboarding wizard
  // If they already have a property → dashboard (returning user)
  const { data: properties } = await supabase
    .from('properties')
    .select('id')
    .eq('owner_id', user.id)
    .limit(1);

  const hasProperty = properties && properties.length > 0;
  const destination = hasProperty ? '/dashboard' : '/onboarding';

  return NextResponse.redirect(`${origin}${destination}`);
}
