import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-col w-full max-w-3xl items-center justify-center py-12 px-8 bg-white dark:bg-black sm:items-start rounded-xl shadow-lg">
        <Image
          className="dark:invert mb-8"
          src="/next.svg"
          alt="Next.js logo"
          width={120}
          height={24}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
            IRent Management System
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Welcome to the AI-powered boarding house and apartment management platform.
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-12 w-full sm:flex-row">
          <Link
            href="/login"
            className="flex h-12 flex-1 items-center justify-center rounded-full bg-indigo-600 text-white transition-colors hover:bg-indigo-700 font-bold"
          >
            Owner Login
          </Link>
          <Link
            href="/login/tenant"
            className="flex h-12 flex-1 items-center justify-center rounded-full border border-solid border-zinc-200 px-5 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 font-bold"
          >
            Tenant Login
          </Link>
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-800 w-full">
          <p className="text-sm text-zinc-500">
            Secured with Jules 5-Layer Security Model.
          </p>
        </div>
      </main>
    </div>
  );
}
