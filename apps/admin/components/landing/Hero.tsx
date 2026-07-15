"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Store } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-32 pb-20 overflow-hidden text-center md:px-12 bg-background">
      {/* Dynamic blurred radial glows using shadcn presets theme variables */}
      <div className="absolute w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      {/* Minimalist Grid overlay matching shadcn */}
      <div
        className="absolute inset-0 bg-[size:48px_48px] pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          maskImage: "radial-gradient(ellipse at center, black 50%, transparent 95%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-[10px] font-bold uppercase tracking-widest border rounded-full border-primary/20 text-primary bg-primary/5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          The Unified Operations Portal
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
          className="mb-6 text-[clamp(40px,6.5vw,80px)] font-extrabold tracking-tight leading-[1.1] text-foreground"
        >
          Manage your restaurant <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange">
            fleet in real-time
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16, ease: "easeOut" }}
          className="max-w-xl mb-12 text-sm md:text-base font-normal leading-relaxed text-muted-foreground"
        >
          A minimalist administrative hub for the DFood platform. Onboard vendor stores, moderate reviews, configure granular role clearances, and track orders instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24, ease: "easeOut" }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full"
        >
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground rounded-lg bg-primary hover:opacity-90 transition-all duration-300 shadow-sm active:scale-98 group"
          >
            Enter Dashboard
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/signup"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 text-xs font-bold uppercase tracking-wider border border-border rounded-lg bg-card text-foreground hover:bg-muted hover:border-border/80 transition-all duration-300 shadow-sm active:scale-98"
          >
            <Store className="w-4 h-4 text-primary" />
            Partner Register
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
