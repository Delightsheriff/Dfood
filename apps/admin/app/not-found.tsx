import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-muted text-destructive mb-8">
        <AlertTriangle className="h-12 w-12" />
        <div className="absolute inset-0 rounded-full border border-destructive/20 animate-pulse" />
      </div>
      <h2 className="text-4xl font-bold tracking-tight mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-sm">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link
        href="/dashboard"
        className="rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-105 hover:opacity-90"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
