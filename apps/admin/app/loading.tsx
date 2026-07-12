export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-surface-2" />
        <div className="absolute inset-0 rounded-full border-4 border-t-orange border-r-transparent border-b-transparent border-l-transparent animate-spin" />
      </div>
    </div>
  );
}
