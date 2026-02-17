"use client";

import { useState, useEffect } from "react";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function AppShowcase() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      icon: "🏠",
      title: "Home & Discovery",
      desc: "Browse restaurants by category, search for dishes, see what's nearby and open right now.",
    },
    {
      icon: "🍕",
      title: "Restaurant & Menu",
      desc: "Full menu with photos, descriptions, and ratings. Add to cart in one tap.",
    },
    {
      icon: "🛒",
      title: "Cart & Checkout",
      desc: "Review your order, pick your address and payment method, place it in seconds.",
    },
    {
      icon: "📦",
      title: "Order Tracking",
      desc: "Real-time push notifications at every stage — from kitchen to your door.",
    },
  ];

  // Auto-cycle tabs
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [tabs.length]);

  return (
    <section className="py-32 px-12 overflow-hidden">
      <div className="grid grid-cols-1 gap-20 items-center max-w-7xl mx-auto lg:grid-cols-[1fr_1.4fr]">
        {/* Left: Content + Tabs */}
        <div>
          <Reveal>
            <div className="mb-4 text-xs font-mono tracking-[3px] text-orange uppercase">
              — The App
            </div>
            <h2 className="mb-2 text-[clamp(48px,6vw,80px)] font-bebas leading-[0.95] tracking-[1px]">
              SEE IT
              <br />
              IN ACTION
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mb-10 text-[15px] font-light leading-relaxed text-text-muted">
              Everything you need to order food, track delivery, and manage your
              preferences — in one beautifully simple app.
            </p>
          </Reveal>

          <div className="flex flex-col gap-1 mt-10">
            {tabs.map((tab, index) => (
              <Reveal key={index} delay={0.2 + index * 0.1}>
                <button
                  onClick={() => setActiveTab(index)}
                  className={cn(
                    "flex items-start w-full gap-4 p-5 text-left transition-all duration-300 border border-transparent rounded-xl bg-transparent hover:bg-surface hover:border-border",
                    activeTab === index && "bg-surface border-orange/25",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 text-lg transition-all border rounded-lg shrink-0",
                      activeTab === index
                        ? "bg-orange/15 border-orange/35"
                        : "bg-orange/10 border-orange/20",
                    )}
                  >
                    {tab.icon}
                  </div>
                  <div>
                    <div
                      className={cn(
                        "mb-1 text-[13px] font-semibold transition-colors",
                        activeTab === index ? "text-text" : "text-text-dim",
                      )}
                    >
                      {tab.title}
                    </div>
                    <div className="text-[13px] font-light leading-snug text-text-muted">
                      {tab.desc}
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Right: Phone Mockup */}
        <Reveal
          delay={0.1}
          className="relative flex items-center justify-center"
        >
          {/* Glow behind phone */}
          <div className="absolute w-[340px] h-[340px] bg-[radial-gradient(circle,rgba(255,118,34,0.18),transparent_65%)] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          {/* Floating Badges */}
          <div className="absolute top-[15%] -right-5 z-20 flex items-center gap-2 p-3.5 bg-surface border border-border rounded-xl shadow-2xl animate-[float_4s_ease-in-out_infinite]">
            <div className="text-lg">⭐</div>
            <div>
              <div className="text-[10px] font-mono text-text-muted uppercase tracking-[0.5px]">
                Avg Rating
              </div>
              <div className="text-[13px] font-semibold text-text">
                4.8 / 5.0
              </div>
            </div>
          </div>
          <div className="absolute bottom-[25%] -left-6 z-20 flex items-center gap-2 p-3.5 bg-surface border border-border rounded-xl shadow-2xl animate-[float_4s_ease-in-out_infinite] animation-delay-[1.5s]">
            <div className="text-lg">🚀</div>
            <div>
              <div className="text-[10px] font-mono text-text-muted uppercase tracking-[0.5px]">
                Avg Delivery
              </div>
              <div className="text-[13px] font-semibold text-text">28 mins</div>
            </div>
          </div>
          <div className="absolute bottom-[10%] -right-4 z-20 flex items-center gap-2 p-3.5 bg-surface border border-border rounded-xl shadow-2xl animate-[float_4s_ease-in-out_infinite] animation-delay-[0.8s]">
            <div className="text-lg">✅</div>
            <div>
              <div className="text-[10px] font-mono text-text-muted uppercase tracking-[0.5px]">
                Orders Today
              </div>
              <div className="text-[13px] font-semibold text-text">142</div>
            </div>
          </div>

          <div className="relative z-10 w-[280px]">
            {/* Phone Frame */}
            <div className="relative p-3 bg-[#141414] border-2 border-[#2a2a2a] rounded-[44px] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_40px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]">
              {/* Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-[#141414] rounded-b-2xl z-20 border border-t-0 border-[#1f1f1f]" />

              {/* Screen */}
              <div className="relative overflow-hidden aspect-[9/19.5] bg-surface-2 rounded-[34px]">
                {tabs.map((tab, index) => (
                  <div
                    key={index}
                    className={cn(
                      "absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 transition-opacity duration-350",
                      activeTab === index
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none",
                    )}
                  >
                    {/* Placeholder for screenshot */}
                    <div className="text-[40px]">{tab.icon}</div>
                    <div className="px-2.5 py-1 text-[11px] font-mono text-orange bg-orange/10 border border-orange/20 rounded-full tracking-[0.5px]">
                      SCREENSHOT {index + 1}
                    </div>
                    <div className="text-[13px] font-light text-center text-text-muted leading-relaxed">
                      {tab.title} Screen
                      <br />
                      <span className="text-[11px] opacity-60">
                        Replace with app screenshot
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
