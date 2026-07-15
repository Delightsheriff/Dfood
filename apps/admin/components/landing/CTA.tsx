import Link from "next/link";
import { ArrowDown } from "lucide-react";

export function CTA() {
  return (
    <div className="relative px-6 py-20 overflow-hidden text-center bg-orange md:px-12">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] font-bold leading-none text-black/[0.03] tracking-widest whitespace-nowrap pointer-events-none select-none">
        DFOOD
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <h2 className="mb-6 text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
          Ready to order? Download now.
        </h2>
        <p className="mb-10 text-xs text-white/85 max-w-sm mx-auto">
          Get the mobile app and start ordering from the top local restaurants near you.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            href="#"
            className="flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-orange bg-white rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <ArrowDown className="w-4 h-4" />
            App Store
          </a>
          <a
            href="#"
            className="flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-transparent border border-white/30 rounded-xl hover:bg-white/10 hover:border-white transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <ArrowDown className="w-4 h-4" />
            Google Play
          </a>
        </div>
      </div>
    </div>
  );
}
