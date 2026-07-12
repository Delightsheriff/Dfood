"use client";

import { PageShell } from "@/components/dashboard/PageShell";
import { useDashboardRole } from "@/components/dashboard/DashboardRoleContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/dashboard/ProfileSettings";
import { RestaurantSettings } from "@/components/dashboard/RestaurantSettings";

export default function SettingsPage() {
  const { role } = useDashboardRole();
  const isVendor = role === "vendor";

  return (
    <PageShell title={isVendor ? "Restaurant Settings" : "Global Settings"}>
      <Tabs defaultValue="profile" className="w-full max-w-4xl">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mb-8 bg-surface border border-border">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-orange data-[state=active]:text-white text-text-muted"
          >
            Profile
          </TabsTrigger>
          {isVendor && (
            <TabsTrigger
              value="restaurant"
              className="data-[state=active]:bg-orange data-[state=active]:text-white text-text-muted"
            >
              Restaurant
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings />
        </TabsContent>

        {isVendor && (
          <TabsContent value="restaurant">
            <RestaurantSettings />
          </TabsContent>
        )}
      </Tabs>
    </PageShell>
  );
}
