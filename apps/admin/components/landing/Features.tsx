"use client";

import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";
import { Zap, CreditCard, MapPin, Star, Search } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <Zap className="w-5 h-5 text-primary" />,
      title: "Real-time updates",
      desc: "Live order statuses push to client connections immediately without manual page refreshes. Real-time logging.",
    },
    {
      icon: <CreditCard className="w-5 h-5 text-primary" />,
      title: "Secure Billing",
      desc: "Instant card processing and secure transaction options powered by certified payment gateways.",
    },
    {
      icon: <MapPin className="w-5 h-5 text-primary" />,
      title: "Geofenced Zones",
      desc: "Draw custom delivery boundaries directly on a map dashboard and assign regional costs dynamically.",
      large: true,
    },
    {
      icon: <Star className="w-5 h-5 text-primary" />,
      title: "Review moderation",
      desc: "Track user reviews, manage reports, and draft direct vendor feedback responses immediately.",
    },
    {
      icon: <Search className="w-5 h-5 text-primary" />,
      title: "Full-text indexing",
      desc: "Perform quick searches across user profiles, restaurants, menus, and transaction histories.",
    },
  ];

  return (
    <section id="features" className="px-6 py-20 border-y border-border/40 bg-muted/30 md:px-12">
      <div className="w-full max-w-7xl mx-auto">
        <Reveal>
          <div className="mb-4 text-[10px] font-bold tracking-widest text-primary uppercase">
            — Core Features
          </div>
          <h2 className="mb-12 text-2xl md:text-4xl font-bold tracking-tight text-foreground">
            Engineered for performance
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal
              key={index}
              delay={index * 0.08}
              className={cn(
                "relative p-8 overflow-hidden transition-all duration-300 border border-border rounded-xl bg-card hover:border-primary/20 hover:-translate-y-0.5 shadow-sm hover:shadow group",
                feature.large && "md:col-span-2"
              )}
            >
              <div className="absolute inset-x-0 top-0 h-px transition-opacity opacity-0 bg-gradient-to-r from-transparent via-primary to-transparent group-hover:opacity-100" />
              
              <div className="flex items-center justify-center w-10 h-10 mb-6 border border-border rounded-lg bg-muted shadow-inner">
                {feature.icon}
              </div>

              <h3 className="mb-2 text-sm font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {feature.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
