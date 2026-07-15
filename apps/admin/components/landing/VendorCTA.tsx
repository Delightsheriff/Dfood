"use client";

import Link from "next/link";
import { Reveal } from "./Reveal";
import { ArrowRight, Check } from "lucide-react";

export function VendorCTA() {
  return (
    <section id="partners" className="px-6 py-24 md:px-12 bg-black">
      <div className="w-full max-w-7xl mx-auto grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <Reveal>
            <div className="mb-4 text-[10px] font-bold tracking-widest text-orange uppercase">
              — For Restaurants
            </div>
            <h2 className="mb-6 text-3xl md:text-5xl font-bold tracking-tight text-text">
              Scale your restaurant revenue
            </h2>
          </Reveal>
          
          <Reveal delay={0.2}>
            <p className="mb-8 text-xs leading-relaxed text-text-muted max-w-lg">
              Partner with DFood to accept orders, manage your menus, structure delivery prices, and view detailed financial breakdowns.
            </p>
            <ul className="mb-10 space-y-4 list-none p-0">
              {[
                "Fill out the restaurant details signup form.",
                "Verify location details and set business hours.",
                "Upload menu catalog items with custom size variants.",
                "Receive instant notifications for pending orders.",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-xs text-text-dim"
                >
                  <span className="flex items-center justify-center flex-shrink-0 w-5 h-5 rounded-full text-orange bg-orange/10 border border-orange/20">
                    <Check className="w-3 h-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white rounded-xl bg-orange hover:bg-orange-dim hover:-translate-y-0.5 shadow-lg shadow-orange/10 transition-all duration-300"
            >
              Become a Partner
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>

        <Reveal
          delay={0.1}
          className="relative flex flex-col items-center justify-center gap-8 p-10 overflow-hidden border border-white/5 rounded-2xl bg-[#080808]"
        >
          <div className="absolute -bottom-16 -right-16 w-[150px] h-[150px] rounded-full bg-[radial-gradient(circle,rgba(255,118,34,0.1),transparent)] pointer-events-none" />

          <div className="grid w-full grid-cols-2 gap-4">
            {[
              { val: "10%", label: "Commission only" },
              { val: "24h", label: "Activation time" },
              { val: "₦0", label: "Setup fee" },
              { val: "∞", label: "Menu items" },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-6 border border-white/5 rounded-xl bg-black"
              >
                <div className="text-2xl font-bold text-orange">
                  {stat.val}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-wider text-text-muted font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
