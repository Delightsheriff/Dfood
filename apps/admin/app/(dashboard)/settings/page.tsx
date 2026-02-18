"use client";

import { PageShell } from "@/components/dashboard/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardRole } from "@/components/dashboard/DashboardRoleContext";

export default function SettingsPage() {
  const { role } = useDashboardRole();
  const isVendor = role === "vendor";

  return (
    <PageShell title={isVendor ? "Restaurant Settings" : "Global Settings"}>
      <div className="max-w-2xl space-y-6">
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-text">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">
                Name
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-border bg-black/20 p-2 text-text"
                defaultValue={isVendor ? "John Vendor" : "Admin User"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-md border border-border bg-black/20 p-2 text-text"
                defaultValue="user@example.com"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-text">Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-2">
              <span className="text-text">Email Notifications</span>
              <div className="h-6 w-10 rounded-full bg-orange relative cursor-pointer">
                <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-text">Dark Mode</span>
              <div className="h-6 w-10 rounded-full bg-orange relative cursor-pointer">
                <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
