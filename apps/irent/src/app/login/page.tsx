import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to IRent
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Owners please use Google to sign in
          </p>
        </div>

        <GoogleAuthButton label="Sign in with Google" />

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">Or</span>
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/login/tenant"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 border-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Tenant login (Email + Password)
          </Link>
        </div>
      </div>
    </div>
  );
}
