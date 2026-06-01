import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center justify-center rounded-xl bg-white px-8 py-12 shadow-lg dark:bg-black sm:items-start">
        <Image
          className="mb-8 dark:invert"
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

        <div className="mt-12 flex w-full flex-col gap-4 text-base font-medium sm:flex-row">
          <Link
            href="/login"
            className="flex h-12 flex-1 items-center justify-center rounded-full bg-indigo-600 text-white transition-colors hover:bg-indigo-700"
          >
            Owner Login
          </Link>
          <Link
            href="/login/tenant"
            className="flex h-12 flex-1 items-center justify-center rounded-full border border-solid border-zinc-200 px-5 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
          >
            Tenant Login
          </Link>
        </div>

        <div className="mt-16 w-full border-t border-zinc-100 pt-8 dark:border-zinc-800">
          <p className="text-sm text-zinc-500">
            Secured with Jules 5-Layer Security Model.
          </p>
        </div>
      </main>
    </div>
  );
}
