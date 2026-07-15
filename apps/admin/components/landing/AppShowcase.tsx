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
      icon: <Compass className="w-4 h-4" />,
      title: "Discovery Home",
      desc: "Browse local cuisines, view recommendations, and see open restaurants nearby.",
      image: "/app-screen-1.jpeg",
    },
    {
      icon: <UtensilsCrossed className="w-4 h-4" />,
      title: "Menu Catalogs",
      desc: "Detailed menu items complete with calories, visual images, ratings, and variants.",
      image: "/app-screen-2.jpeg",
    },
    {
      icon: <ShoppingCart className="w-4 h-4" />,
      title: "Sleek Checkout",
      desc: "Confirm order pricing, select delivery address, and pay securely in seconds.",
      image: "/cart.jpeg",
    },
    {
      icon: <Truck className="w-4 h-4" />,
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
    <section className="py-20 px-6 md:px-12 overflow-hidden bg-background">
      <div className="grid grid-cols-1 gap-16 items-center max-w-7xl mx-auto lg:grid-cols-[1fr_1.2fr]">
        {/* Left: Content + Tabs */}
        <div>
          <Reveal>
            <div className="mb-4 text-[10px] font-bold tracking-widest text-primary uppercase">
              — Consumer App
            </div>
            <h2 className="mb-6 text-2xl md:text-4xl font-bold tracking-tight text-foreground">
              The customer interface
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mb-8 text-xs leading-relaxed text-muted-foreground max-w-md">
              A beautifully simple experience for users to browse menus, manage their profiles, and track delivery progress.
            </p>
          </Reveal>

          <div className="flex flex-col gap-3">
            {tabs.map((tab, index) => (
              <Reveal key={index} delay={0.2 + index * 0.05}>
                <button
                  onClick={() => setActiveTab(index)}
                  className={cn(
                    "group flex items-start w-full gap-4 p-4 text-left transition-all duration-300 border rounded-xl",
                    activeTab === index
                      ? "bg-card border-border/80 shadow-sm"
                      : "bg-transparent border-transparent hover:bg-muted/50"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-9 h-9 border rounded-lg shrink-0 transition-all duration-300",
                      activeTab === index
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-muted text-muted-foreground border-border group-hover:border-primary/20 group-hover:text-primary"
                    )}
                  >
                    {tab.icon}
                  </div>
                  <div>
                    <div
                      className={cn(
                        "mb-1 text-xs font-bold transition-colors",
                        activeTab === index ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      {tab.title}
                    </div>
                    <div
                      className={cn(
                        "text-[11px] leading-relaxed transition-colors",
                        activeTab === index ? "text-muted-foreground" : "text-muted-foreground/60"
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
          <div className="absolute w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          {/* Floating Badges */}
          <div className="absolute top-[12%] right-2 md:right-8 z-30 animate-pulse">
            <div className="flex items-center gap-2 p-2.5 bg-card/90 backdrop-blur-md border border-border rounded-xl shadow-md">
              <Star className="w-3.5 h-3.5 fill-primary text-primary" />
              <div>
                <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">
                  Store Rating
                </div>
                <div className="text-[10px] font-bold text-foreground">4.9 Stars</div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-[20%] left-2 md:left-8 z-30 animate-pulse">
            <div className="flex items-center gap-2 p-2.5 bg-card/90 backdrop-blur-md border border-border rounded-xl shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <div>
                <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">
                  Payments
                </div>
                <div className="text-[10px] font-bold text-foreground">Secure SSL</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 w-[240px] md:w-[260px]">
            {/* Phone Frame */}
            <div className="relative aspect-[9/19] bg-card rounded-[32px] border-[5px] border-muted shadow-xl overflow-hidden ring-1 ring-border">
              {/* Screen Content */}
              <div className="relative w-full h-full bg-background">
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
