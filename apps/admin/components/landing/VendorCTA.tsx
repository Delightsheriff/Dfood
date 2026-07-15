"use client";

import Link from "next/link";
import { Reveal } from "./Reveal";
import { ArrowRight, Check } from "lucide-react";

export function VendorCTA() {
  return (
    <section id="partners" className="px-6 py-20 md:px-12 bg-background">
      <div className="w-full max-w-7xl mx-auto grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <Reveal>
            <div className="mb-4 text-[10px] font-bold tracking-widest text-primary uppercase">
              — For Restaurants
            </div>
            <h2 className="mb-6 text-2xl md:text-4xl font-bold tracking-tight text-foreground">
              Scale your restaurant revenue
            </h2>
          </Reveal>
          
          <Reveal delay={0.16}>
            <p className="mb-8 text-xs leading-relaxed text-muted-foreground max-w-lg">
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
                  className="flex items-center gap-3 text-xs text-muted-foreground"
                >
                  <span className="flex items-center justify-center flex-shrink-0 w-5 h-5 rounded-full text-primary bg-primary/10 border border-primary/20">
                    <Check className="w-3 h-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground rounded-lg bg-primary hover:opacity-90 transition-all duration-300 shadow-sm"
            >
              Become a Partner
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>

        <Reveal
          delay={0.08}
          className="relative flex flex-col items-center justify-center gap-8 p-10 overflow-hidden border border-border rounded-xl bg-card"
        >
          <div className="absolute -bottom-16 -right-16 w-[150px] h-[150px] rounded-full bg-primary/5 blur-2xl pointer-events-none" />

          <div className="grid w-full grid-cols-2 gap-4">
            {[
              { val: "10%", label: "Commission only" },
              { val: "24h", label: "Activation time" },
              { val: "₦0", label: "Setup fee" },
              { val: "∞", label: "Menu items" },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-6 border border-border rounded-lg bg-background"
              >
                <div className="text-xl font-bold text-primary">
                  {stat.val}
                </div>
                <div className="mt-1 text-[9px] uppercase tracking-wider text-muted-foreground font-bold">
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
