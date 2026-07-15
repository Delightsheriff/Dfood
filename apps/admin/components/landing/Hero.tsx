"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Store } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-32 pb-20 overflow-hidden text-center md:px-12">
      {/* Premium radial glows */}
      <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,118,34,0.08)_0%,transparent_70%)] top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(59,130,246,0.03)_0%,transparent_70%)] top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Grid lines overlay */}
      <div
        className="absolute inset-0 bg-[size:64px_64px] pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-[11px] font-semibold uppercase tracking-widest border rounded-full border-orange/20 text-orange bg-orange/5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse" />
          DFood Network Ecosystem
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="mb-6 text-[clamp(44px,7vw,96px)] font-bold tracking-tight leading-[1.05] text-text max-w-4xl"
        >
          Streamline your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange via-orange-dim to-orange">
            Restaurant Operations
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="max-w-2xl mb-12 text-sm md:text-base font-normal leading-relaxed text-text-muted"
        >
          A high-performance management dashboard for food delivery systems. Track active orders, customize menu variants, audit financials, and configure roles from a unified minimalist dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full"
        >
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white rounded-xl bg-orange hover:bg-orange-dim transition-all duration-300 hover:shadow-lg hover:shadow-orange/15 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 group"
          >
            Enter Dashboard
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/signup"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 text-xs font-bold uppercase tracking-wider border border-white/5 rounded-xl bg-white/5 text-text hover:bg-white/10 hover:border-white/10 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-98"
          >
            <Store className="w-4 h-4 text-orange" />
            Partner Register
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
