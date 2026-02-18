"use client";

interface PageShellProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function PageShell({ title, children, action }: PageShellProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-text">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}
