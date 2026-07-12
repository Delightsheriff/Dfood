import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-text p-4">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-surface-2 text-orange mb-8">
        <AlertTriangle className="h-12 w-12" />
        <div className="absolute inset-0 rounded-full border border-orange/20 animate-pulse" />
      </div>
      <h2 className="text-4xl font-bold tracking-tight mb-2">Page Not Found</h2>
      <p className="text-text-muted mb-8 text-center max-w-sm">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link
        href="/dashboard"
        className="rounded-full bg-orange px-8 py-3 text-sm font-bold text-white transition-transform hover:scale-105 hover:bg-orange-dim"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
