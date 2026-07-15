"use client";

import { Reveal } from "./Reveal";
import { MapPin, Utensils, RefreshCw } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: <MapPin className="w-5 h-5 text-orange" />,
      title: "Geocode locations",
      desc: "Assign custom coordinates, addresses, and delivery polygons for restaurants.",
    },
    {
      number: "02",
      icon: <Utensils className="w-5 h-5 text-orange" />,
      title: "Build the menu catalog",
      desc: "Create category headers, add specific item prices, sizes, variants, and badges.",
    },
    {
      number: "03",
      icon: <RefreshCw className="w-5 h-5 text-orange" />,
      title: "Dispatch and monitor",
      desc: "Track orders inside kanban boards, process payment verify callbacks, and log actions.",
    },
  ];

  return (
    <section id="how-it-works" className="px-6 py-24 md:px-12 bg-black">
      <div className="w-full max-w-7xl mx-auto">
        <Reveal>
          <div className="mb-4 text-[10px] font-bold tracking-widest text-orange uppercase">
            — Workflows
          </div>
          <h2 className="mb-16 text-3xl md:text-5xl font-bold tracking-tight text-text">
            Simple operational controls
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal
              key={index}
              delay={index * 0.1}
              className="relative p-8 border border-white/5 rounded-2xl bg-[#080808] hover:border-white/10 transition-all duration-300 group overflow-hidden"
            >
              <div className="absolute font-bebas text-[72px] text-white/[0.02] right-6 bottom-4 leading-none transition-colors pointer-events-none group-hover:text-orange/[0.04]">
                {step.number}
              </div>
              
              <div className="flex items-center justify-center w-10 h-10 mb-6 border border-white/5 rounded-xl bg-white/5">
                {step.icon}
              </div>
              
              <h3 className="mb-2 text-base font-bold text-text">{step.title}</h3>
              <p className="text-xs leading-relaxed text-text-muted">
                {step.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
