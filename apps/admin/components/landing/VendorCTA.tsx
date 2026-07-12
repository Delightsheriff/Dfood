"use client";

import Link from "next/link";
import { Reveal } from "./Reveal";

export function VendorCTA() {
  return (
    <section id="partners" className="px-6 py-32 md:px-12">
      <div className="w-full max-w-[1400px] mx-auto grid items-stretch grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-0">
        <div className="pr-0 mb-10 lg:pr-20 lg:mb-0">
          <Reveal>
            <div className="mb-4 text-xs font-mono tracking-[3px] text-orange uppercase">
              — For Restaurants
            </div>
            <h2 className="mb-6 text-[clamp(48px,6vw,80px)] font-bebas leading-[0.95] tracking-[1px]">
              GROW
              <br />
              YOUR
              <br />
              REVENUE
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mb-8 text-base font-light leading-relaxed text-text-muted">
              Join 48+ restaurants already using Food to reach more customers,
              manage orders smarter, and grow their delivery business.
            </p>
            <ul className="mb-10 space-y-5 list-none">
              {[
                "Sign up and submit your restaurant details. Takes less than 10 minutes.",
                "We review and activate your account within 24 hours.",
                "Upload your menu, set your hours, go live immediately.",
                "Manage orders from your dashboard. Get paid directly.",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 text-[15px] leading-relaxed text-text-dim"
                >
                  <span className="flex items-center justify-center flex-shrink-0 w-6 h-6 mt-px text-xs border rounded-full font-mono text-orange bg-orange/10 border-orange/30">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2.5 px-8 py-4 text-base font-semibold text-white rounded-lg bg-orange hover:bg-orange-dim hover:-translate-y-0.5 shadow-lg shadow-orange/25 transition-all"
            >
              Become a Partner →
            </Link>
          </Reveal>
        </div>

        <Reveal
          delay={0.1}
          className="relative flex flex-col items-center justify-center gap-6 p-12 overflow-hidden border rounded-2xl bg-surface border-border"
        >
          <div className="absolute -bottom-16 -right-16 w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,rgba(255,118,34,0.15),transparent)]" />

          <div className="mb-6 text-center">
            <div className="text-5xl mb-2">🏪</div>
            <div className="text-sm text-text-muted">Your dashboard awaits</div>
          </div>

          <div className="grid w-full grid-cols-2 gap-4">
            {[
              { val: "10%", label: "Commission only" },
              { val: "24h", label: "Activation time" },
              { val: "₦0", label: "Setup fee" },
              { val: "∞", label: "Menu items" },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-5 border rounded-xl bg-black border-border"
              >
                <div className="font-bebas text-[32px] text-orange">
                  {stat.val}
                </div>
                <div className="mt-0.5 text-xs text-text-muted">
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
