export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome to your admin panel. More features are coming soon.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Total Orders", value: "—", icon: "orders" },
          { label: "Total Products", value: "—", icon: "products" },
          { label: "Total Revenue", value: "—", icon: "revenue" },
          { label: "Total Customers", value: "—", icon: "customers" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-base font-medium text-gray-900">Admin Panel — Phase 1 Complete</h2>
          <p className="mt-2 text-sm text-gray-500">
            The foundation is in place. Use the sidebar to navigate. Dashboard stats and management tools will be built in subsequent phases.
          </p>
        </div>
      </div>
    </div>
  );
}
