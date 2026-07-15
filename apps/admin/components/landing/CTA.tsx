import { ArrowDown } from "lucide-react";

export function CTA() {
  return (
    <div className="relative px-6 py-20 overflow-hidden text-center bg-primary md:px-12 rounded-2xl max-w-7xl mx-auto mb-20 shadow-sm border border-primary/20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] font-bold leading-none text-primary-foreground/[0.03] tracking-widest whitespace-nowrap pointer-events-none select-none">
        DFOOD
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto">
        <h2 className="mb-6 text-2xl md:text-4xl font-bold tracking-tight text-primary-foreground leading-tight">
          Ready to order? Download now.
        </h2>
        <p className="mb-10 text-xs text-primary-foreground/80 max-w-sm mx-auto">
          Get the mobile app and start ordering from the top local restaurants near you.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            href="#"
            className="flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary bg-primary-foreground rounded-lg hover:opacity-90 transition-all duration-300 w-full sm:w-auto justify-center shadow-sm"
          >
            <ArrowDown className="w-4 h-4" />
            App Store
          </a>
          <a
            href="#"
            className="flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground bg-transparent border border-primary-foreground/30 rounded-lg hover:bg-primary-foreground/10 hover:border-primary-foreground transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <ArrowDown className="w-4 h-4" />
            Google Play
          </a>
        </div>
      </div>
    </div>
  );
}
