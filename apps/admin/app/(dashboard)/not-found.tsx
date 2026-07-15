import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function DashboardNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Page not found</h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        This dashboard page doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
