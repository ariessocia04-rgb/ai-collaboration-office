import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-indigo-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            IRent
          </h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            AI-powered property management system for boarding houses and apartments. 
            Automate billing, manage tenants, and track utilities with intelligent insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/login"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
            >
              Owner Login
            </Link>
            <Link
              href="/login/tenant"
              className="bg-indigo-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Tenant Login
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 text-white">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-semibold mb-2">Automated Billing</h3>
              <p className="text-indigo-100">
                Auto-generate monthly bills with rent, electricity, and water charges calculated automatically.
              </p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 text-white">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="text-lg font-semibold mb-2">Meter OCR</h3>
              <p className="text-indigo-100">
                Capture meter readings using your phone camera. AI extracts readings automatically.
              </p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 text-white">
              <div className="text-3xl mb-4">📋</div>
              <h3 className="text-lg font-semibold mb-2">Tenant Reports</h3>
              <p className="text-indigo-100">
                Tenants can file maintenance reports and owners can track resolution status.
              </p>
            </div>
          </div>

          <div className="mt-16 text-indigo-100">
            <p className="text-sm">Secured with Jules 5-Layer Security Model</p>
          </div>
        </div>
      </div>
    </div>
  );
}
