"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";
import { Compass, UtensilsCrossed, ShoppingCart, Truck, Star, ShieldCheck } from "lucide-react";

export function AppShowcase() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      icon: <Compass className="w-5 h-5" />,
      title: "Discovery Home",
      desc: "Browse local cuisines, view recommendations, and see open restaurants nearby.",
      image: "/app-screen-1.jpeg",
    },
    {
      icon: <UtensilsCrossed className="w-5 h-5" />,
      title: "Menu Catalogs",
      desc: "Detailed menu items complete with calories, visual images, ratings, and variants.",
      image: "/app-screen-2.jpeg",
    },
    {
      icon: <ShoppingCart className="w-5 h-5" />,
      title: "Sleek Checkout",
      desc: "Confirm order pricing, select delivery address, and pay securely in seconds.",
      image: "/cart.jpeg",
    },
    {
      icon: <Truck className="w-5 h-5" />,
      title: "Live Order Tracking",
      desc: "Receive real-time push updates as the order prepares and heads to the destination.",
      image: "/app-screen-4.jpeg",
    },
  ];

  // Auto-cycle tabs
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [tabs.length]);

  return (
    <section className="py-24 px-6 md:px-12 overflow-hidden bg-[#080808]">
      <div className="grid grid-cols-1 gap-16 items-center max-w-7xl mx-auto lg:grid-cols-[1fr_1.2fr]">
        {/* Left: Content + Tabs */}
        <div>
          <Reveal>
            <div className="mb-4 text-[10px] font-bold tracking-widest text-orange uppercase">
              — Consumer App
            </div>
            <h2 className="mb-6 text-3xl md:text-5xl font-bold tracking-tight text-text">
              The customer interface
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mb-10 text-xs leading-relaxed text-text-muted max-w-md">
              A beautifully simple experience for users to browse menus, manage their profiles, and track delivery progress.
            </p>
          </Reveal>

          <div className="flex flex-col gap-3">
            {tabs.map((tab, index) => (
              <Reveal key={index} delay={0.2 + index * 0.05}>
                <button
                  onClick={() => setActiveTab(index)}
                  className={cn(
                    "group flex items-start w-full gap-4 p-4 text-left transition-all duration-300 border rounded-2xl",
                    activeTab === index
                      ? "bg-black border-white/10 shadow-xl"
                      : "bg-transparent border-transparent hover:bg-white/5"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 border rounded-xl shrink-0 transition-all duration-300",
                      activeTab === index
                        ? "bg-orange text-white border-orange shadow-md shadow-orange/15"
                        : "bg-white/5 text-zinc-500 border-white/5 group-hover:border-orange/20 group-hover:text-orange"
                    )}
                  >
                    {tab.icon}
                  </div>
                  <div>
                    <div
                      className={cn(
                        "mb-1 text-xs font-bold transition-colors",
                        activeTab === index ? "text-text" : "text-text-dim group-hover:text-text"
                      )}
                    >
                      {tab.title}
                    </div>
                    <div
                      className={cn(
                        "text-[11px] leading-relaxed transition-colors",
                        activeTab === index ? "text-text-muted" : "text-text-dim"
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
          <div className="absolute w-[450px] h-[450px] bg-orange/5 rounded-full blur-3xl -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          {/* Floating Badges */}
          <div className="absolute top-[12%] right-2 md:right-8 z-30 animate-pulse">
            <div className="flex items-center gap-2.5 p-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
              <Star className="w-4 h-4 fill-orange text-orange" />
              <div>
                <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider">
                  Store Rating
                </div>
                <div className="text-xs font-bold text-text">4.9 Stars</div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-[20%] left-2 md:left-8 z-30 animate-pulse">
            <div className="flex items-center gap-2.5 p-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
              <ShieldCheck className="w-4 h-4 text-orange" />
              <div>
                <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider">
                  Payments
                </div>
                <div className="text-xs font-bold text-text">Secure SSL</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 w-[260px] md:w-[280px]">
            {/* Phone Frame */}
            <div className="relative aspect-[9/19] bg-black rounded-[40px] border-[6px] border-[#161616] shadow-2xl overflow-hidden ring-1 ring-white/10">
              {/* Screen Content */}
              <div className="relative w-full h-full bg-[#0a0a0a]">
                {tabs.map((tab, index) => (
                  <div
                    key={index}
                    className={cn(
                      "absolute inset-0 w-full h-full transition-all duration-500 ease-in-out transform",
                      activeTab === index
                        ? "opacity-100 translate-x-0 scale-100"
                        : "opacity-0 translate-x-4 scale-98 pointer-events-none"
                    )}
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image
                        src={tab.image}
                        alt={`${tab.title} Screen`}
                        fill
                        className="object-cover object-top"
                        priority={index === 0}
                      />
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
