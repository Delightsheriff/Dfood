import Link from "next/link";
import { ArrowRight, Store } from "lucide-react";

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-6 pt-32 pb-20 text-center md:px-12 bg-background">
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
        <div className="hero-fade-in inline-flex items-center gap-2 px-3 py-1 mb-8 text-[10px] font-bold uppercase tracking-widest border rounded-full border-primary/20 text-primary bg-primary/5">
          The Unified Operations Portal
        </div>

        <h1 className="mb-6 text-[clamp(40px,6.5vw,72px)] font-extrabold tracking-tight leading-[1.1] text-foreground">
          <span className="hero-line-1">Manage your restaurant</span>
          <span className="hero-line-2">fleet in real-time</span>
        </h1>

        <p className="hero-fade-in max-w-xl mb-12 text-sm md:text-base font-normal leading-relaxed text-muted-foreground">
          A minimalist administrative hub for the DFood platform. Onboard vendor stores, moderate reviews, configure granular role clearances, and track orders instantly.
        </p>

        <div className="hero-fade-in flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
          <Link
            href="/dashboard"
            className="focus-ring flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground rounded-lg bg-primary hover:opacity-90 transition-all duration-300 active:scale-[0.98] group"
          >
            Enter Dashboard
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/signup"
            className="focus-ring flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 text-xs font-bold uppercase tracking-wider border border-border rounded-lg bg-card text-foreground hover:bg-muted hover:border-border/80 transition-all duration-300 active:scale-[0.98]"
          >
            <Store className="w-4 h-4 text-primary" />
            Partner Register
          </Link>
        </div>
      </div>
    </section>
  );
}
