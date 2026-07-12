import CountUp from "@/components/ui/CountUp";

export function StatsStrip() {
  const stats = [
    { value: 3.2, suffix: "K+", label: "Happy Customers", decimals: 1 },
    { value: 891, suffix: "", label: "Orders This Week", decimals: 0 },
    { value: 48, suffix: "+", label: "Restaurant Partners", decimals: 0 },
    { value: 4.8, suffix: "★", label: "Average Rating", decimals: 1 },
    { value: 28, suffix: "min", label: "Avg Delivery Time", decimals: 0 },
  ];

  return (
    <div className="flex justify-center px-6 py-8 md:px-12 bg-surface border-y border-border">
      <div className="w-full max-w-[1400px] flex flex-wrap items-center justify-center gap-8 md:gap-16">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="font-bebas text-[40px] text-orange tracking-[1px] leading-none flex justify-center items-center">
                <CountUp
                  to={stat.value}
                  duration={2.5}
                  className="tabular-nums"
                  startWhen={true}
                />
                {stat.suffix}
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
