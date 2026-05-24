import LogoutButton from "@/components/auth/logout-button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      
      {/* Sidebar */}
      <aside className="w-64 border-r p-4">
        <h2 className="mb-6 text-xl font-bold">
          TechAssets
        </h2>

        <nav className="space-y-2">
          <a href="/dashboard">Dashboard</a>
          <a href="/assets">Activos</a>
          <a href="/categories">Categorías</a>
        </nav>

        <div className="mt-10">
          <LogoutButton />
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}