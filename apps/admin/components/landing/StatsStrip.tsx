export function StatsStrip() {
  const stats = [
    { number: "3.2K+", label: "Happy Customers" },
    { number: "891", label: "Orders This Week" },
    { number: "48+", label: "Restaurant Partners" },
    { number: "4.8★", label: "Average Rating" },
    { number: "28min", label: "Avg Delivery Time" },
  ];

  return (
    <div className="flex justify-center px-6 py-8 md:px-12 bg-surface border-y border-border">
      <div className="w-full max-w-[1400px] flex flex-wrap items-center justify-center gap-8 md:gap-16">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="font-bebas text-[40px] text-orange tracking-[1px] leading-none">
                {stat.number}
              </div>
              <div className="mt-1 text-[13px] text-text-muted">
                {stat.label}
              </div>
            </div>
            {index < stats.length - 1 && (
              <div className="hidden w-px h-10 bg-border md:block" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
