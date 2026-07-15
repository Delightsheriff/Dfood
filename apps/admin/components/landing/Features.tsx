"use client";

import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";
import { Zap, CreditCard, MapPin, Star, Search } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-orange" />,
      title: "Real-time updates",
      desc: "Live order statuses push to client connections immediately without manual page refreshes. Real-time logging.",
    },
    {
      icon: <CreditCard className="w-6 h-6 text-orange" />,
      title: "Secure Billing",
      desc: "Instant card processing and secure transaction options powered by certified payment gateways.",
    },
    {
      icon: <MapPin className="w-6 h-6 text-orange" />,
      title: "Geofenced Zones",
      desc: "Draw custom delivery boundaries directly on a map dashboard and assign regional costs dynamically.",
      large: true,
    },
    {
      icon: <Star className="w-6 h-6 text-orange" />,
      title: "Review moderation",
      desc: "Track user reviews, manage reports, and draft direct vendor feedback responses immediately.",
    },
    {
      icon: <Search className="w-6 h-6 text-orange" />,
      title: "Full-text indexing",
      desc: "Perform quick searches across user profiles, restaurants, menus, and transaction histories.",
    },
  ];

  return (
    <section id="features" className="px-6 py-24 border-y border-white/5 bg-[#0a0a0a] md:px-12">
      <div className="w-full max-w-7xl mx-auto">
        <Reveal>
          <div className="mb-4 text-[10px] font-bold tracking-widest text-orange uppercase">
            — Core Features
          </div>
          <h2 className="mb-16 text-3xl md:text-5xl font-bold tracking-tight text-text">
            Engineered for performance
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal
              key={index}
              delay={index * 0.1}
              className={cn(
                "relative p-8 overflow-hidden transition-all duration-300 border border-white/5 rounded-2xl bg-black hover:border-orange/20 hover:-translate-y-0.5 shadow-xl group",
                feature.large && "md:col-span-2"
              )}
            >
              <div className="absolute inset-x-0 top-0 h-px transition-opacity opacity-0 bg-gradient-to-r from-transparent via-orange to-transparent group-hover:opacity-100" />
              
              <div className="flex items-center justify-center w-12 h-12 mb-6 border border-white/5 rounded-xl bg-white/5 shadow-inner">
                {feature.icon}
              </div>

              <h3 className="mb-2 text-base font-bold text-text">
                {feature.title}
              </h3>
              <p className="text-xs leading-relaxed text-text-muted">
                {feature.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
