export function StatsStrip() {
  const stats = [
    { value: "3.2K+", label: "Happy Customers" },
    { value: "891", label: "Orders This Week" },
    { value: "48+", label: "Restaurant Partners" },
    { value: "4.8★", label: "Average Rating" },
    { value: "28min", label: "Avg Delivery Time" },
  ];

  return (
    <div className="flex justify-center px-6 py-8 md:px-12 bg-card border-y border-border/40">
      <div className="w-full max-w-[1400px] flex flex-wrap items-center justify-center gap-8 md:gap-16">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="font-bebas text-[40px] text-primary tracking-tight leading-none">
                {stat.value}
              </div>
              <div className="mt-1 text-[13px] text-muted-foreground">
                {stat.label}
              </div>
            </div>
            {index < stats.length - 1 && (
              <div className="hidden w-px h-10 bg-border/40 md:block" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
