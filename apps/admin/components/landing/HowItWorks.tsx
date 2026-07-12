"use client";

import { Reveal } from "./Reveal";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-32 md:px-12">
      <div className="w-full max-w-[1400px] mx-auto">
        <Reveal>
          <div className="mb-4 text-xs font-mono tracking-[3px] text-orange uppercase">
            — Process
          </div>
          <h2 className="mb-20 text-[clamp(48px,6vw,80px)] font-bebas leading-[0.95] tracking-[1px]">
            HOW IT
            <br />
            WORKS
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-px overflow-hidden border rounded-2xl md:grid-cols-3 bg-border border-border">
          {[
            {
              number: "01",
              icon: "📍",
              title: "Set your location",
              desc: "Drop your pin or let us detect where you are. We'll show you the best restaurants delivering to your area right now.",
            },
            {
              number: "02",
              icon: "🍽️",
              title: "Pick what you want",
              desc: "Browse menus, save your favorites, build your cart. Filter by cuisine, rating, delivery time, or what's on your mind.",
            },
            {
              number: "03",
              icon: "🚀",
              title: "Track it live",
              desc: "Place your order and watch it move. From kitchen to your door — you'll know exactly what's happening every step of the way.",
            },
          ].map((step, index) => (
            <Reveal
              key={index}
              delay={index * 0.1}
              className="relative p-10 transition-colors bg-black hover:bg-surface group"
            >
              <div className="absolute font-bebas text-[80px] text-orange/5 right-8 top-6 leading-none transition-colors pointer-events-none group-hover:text-orange/15">
                {step.number}
              </div>
              <div className="flex items-center justify-center w-12 h-12 mb-6 text-xl border rounded-xl bg-orange/10 border-orange/20">
                {step.icon}
              </div>
              <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
              <p className="text-[15px] font-light leading-relaxed text-text-muted lg:max-w-[90%]">
                {step.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
