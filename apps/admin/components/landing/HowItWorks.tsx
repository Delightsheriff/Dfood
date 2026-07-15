import { MapPin, Utensils, RefreshCw } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: <MapPin className="w-5 h-5 text-primary" />,
      title: "Geocode locations",
      desc: "Assign custom coordinates, addresses, and delivery polygons for restaurants.",
    },
    {
      number: "02",
      icon: <Utensils className="w-5 h-5 text-primary" />,
      title: "Build the menu catalog",
      desc: "Create category headers, add specific item prices, sizes, variants, and badges.",
    },
    {
      number: "03",
      icon: <RefreshCw className="w-5 h-5 text-primary" />,
      title: "Dispatch and monitor",
      desc: "Track orders inside kanban boards, process payment verify callbacks, and log actions.",
    },
  ];

  return (
    <section id="how-it-works" className="px-6 py-20 md:px-12 bg-background">
      <div className="w-full max-w-7xl mx-auto">
        <div data-reveal="fade-up">
          <div className="mb-4 text-[10px] font-bold tracking-widest text-primary uppercase">
            — Workflows
          </div>
          <h2 className="mb-12 text-2xl md:text-4xl font-bold tracking-tight text-foreground">
            Simple operational controls
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              data-reveal="fade-up"
              style={{ "--reveal-delay": `${index * 0.08}s` } as React.CSSProperties}
              className="relative p-8 border border-border rounded-xl bg-card overflow-hidden"
            >
              <div className="absolute font-bebas text-[72px] text-foreground/[0.02] right-6 bottom-4 leading-none pointer-events-none">
                {step.number}
              </div>

              <div className="flex items-center justify-center w-10 h-10 mb-6 border border-border rounded-lg bg-muted">
                {step.icon}
              </div>

              <h3 className="mb-2 text-sm font-bold text-foreground">{step.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
