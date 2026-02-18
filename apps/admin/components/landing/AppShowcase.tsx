"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function AppShowcase() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      icon: "🏠",
      title: "Home & Discovery",
      desc: "Browse restaurants by category, search for dishes, see what's nearby and open right now.",
      image: "/app-screen-1.jpeg",
    },
    {
      icon: "🍕",
      title: "Restaurant & Menu",
      desc: "Full menu with photos, descriptions, and ratings. Add to cart in one tap.",
      image: "/app-screen-2.jpeg",
    },
    {
      icon: "🛒",
      title: "Cart & Checkout",
      desc: "Review your order, pick your address and payment method, place it in seconds.",
      image: "/cart.jpeg",
    },
    {
      icon: "📦",
      title: "Order Tracking",
      desc: "Real-time push notifications at every stage — from kitchen to your door.",
      image: "/app-screen-4.jpeg",
    },
  ];

  // Auto-cycle tabs
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    }, 4000); // Slower interval for better viewing
    return () => clearInterval(interval);
  }, [tabs.length]);

  return (
    <section className="py-24 px-6 md:px-12 overflow-hidden bg-background">
      <div className="grid grid-cols-1 gap-16 items-center max-w-7xl mx-auto lg:grid-cols-[1fr_1.2fr]">
        {/* Left: Content + Tabs */}
        <div>
          <Reveal>
            <div className="mb-4 text-xs font-mono tracking-[3px] text-orange uppercase">
              — The App
            </div>
            <h2 className="mb-6 text-[clamp(40px,5vw,64px)] font-bebas leading-[0.95] tracking-[1px] text-text">
              SEE IT
              <br />
              IN ACTION
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mb-10 text-[15px] md:text-base font-light leading-relaxed text-text-muted">
              Everything you need to order food, track delivery, and manage your
              preferences — in one beautifully simple app.
            </p>
          </Reveal>

          <div className="flex flex-col gap-3">
            {tabs.map((tab, index) => (
              <Reveal key={index} delay={0.2 + index * 0.1}>
                <button
                  onClick={() => setActiveTab(index)}
                  className={cn(
                    "group flex items-start w-full gap-4 p-4 text-left transition-all duration-300 border rounded-2xl",
                    activeTab === index
                      ? "bg-surface border-orange/40 shadow-lg shadow-orange/5"
                      : "bg-transparent border-transparent hover:bg-surface/50 hover:border-border/50",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-12 h-12 text-xl transition-all border rounded-xl shrink-0",
                      activeTab === index
                        ? "bg-orange text-white border-orange shadow-md shadow-orange/20"
                        : "bg-surface text-text-muted border-border group-hover:border-orange/30 group-hover:text-orange",
                    )}
                  >
                    {tab.icon}
                  </div>
                  <div>
                    <div
                      className={cn(
                        "mb-1 text-sm font-bold transition-colors",
                        activeTab === index
                          ? "text-text"
                          : "text-text-dim group-hover:text-text",
                      )}
                    >
                      {tab.title}
                    </div>
                    <div
                      className={cn(
                        "text-xs md:text-[13px] font-light leading-relaxed",
                        activeTab === index
                          ? "text-text-muted"
                          : "text-text-subtle",
                      )}
                    >
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
          delay={0.2}
          className="relative flex items-center justify-center pt-10 lg:pt-0"
        >
          {/* Decorative Glow */}
          <div className="absolute w-[500px] h-[500px] bg-orange/5 rounded-full blur-3xl -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

          {/* Floating Badges */}
          <div className="absolute top-[10%] -right-4 md:right-0 z-30 animate-[float_5s_ease-in-out_infinite]">
            <div className="flex items-center gap-3 p-3 pl-4 bg-surface/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
              <div className="text-xl">⭐</div>
              <div>
                <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  Rating
                </div>
                <div className="text-sm font-bold text-text">4.9 / 5.0</div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-[20%] -left-8 md:-left-4 z-30 animate-[float_6s_ease-in-out_infinite] animation-delay-[1s]">
            <div className="flex items-center gap-3 p-3 pl-4 bg-surface/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
              <div className="text-xl">🚀</div>
              <div>
                <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  Speed
                </div>
                <div className="text-sm font-bold text-text">~24 mins</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 w-[280px] md:w-[320px]">
            {/* Phone Frame */}
            <div className="relative aspect-[9/19] bg-black rounded-[48px] border-[8px] border-[#1a1a1a] shadow-2xl overflow-hidden ring-1 ring-white/10">
              {/* Dynamic Island / Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-7 bg-[#1a1a1a] rounded-b-2xl z-20" />

              {/* Screen Content */}
              <div className="relative w-full h-full bg-surface-2">
                {tabs.map((tab, index) => (
                  <div
                    key={index}
                    className={cn(
                      "absolute inset-0 w-full h-full transition-all duration-500 ease-in-out transform",
                      activeTab === index
                        ? "opacity-100 translate-x-0 scale-100"
                        : "opacity-0 translate-x-8 scale-95 pointer-events-none",
                    )}
                  >
                    {/* 
                      Note: We use unoptimized images for local development if needed, 
                      or normal optimized ones. Using 'fill' and 'cover' for best fit.
                    */}
                    <div className="relative w-full h-full bg-surface-2 flex items-center justify-center text-text-muted">
                      <Image
                        src={tab.image}
                        alt={`${tab.title} Screen`}
                        fill
                        className="object-cover object-top"
                        priority={index === 0}
                      />
                      {/* Fallback text if image missing (Image component handles errors but this is for dev clarity if src is empty) */}
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
