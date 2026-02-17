import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar placeholder - this would likely be dynamic based on role */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4 font-bold text-xl">Dashboard</div>
        <nav className="mt-4">
          <ul className="space-y-2 p-4">
            <li>
              <a href="#" className="block hover:bg-gray-100 p-2 rounded">
                Overview
              </a>
            </li>
            {/* Links would be conditional based on role */}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
