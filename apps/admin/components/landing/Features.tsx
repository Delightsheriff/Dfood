"use client";

import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function Features() {
  const features = [
    {
      emoji: "⚡",
      title: "Real-time everything",
      desc: "Order status updates push to your phone the moment anything changes. No refreshing. No guessing. Just instant info.",
    },
    {
      emoji: "💳",
      title: "Pay your way",
      desc: "Cash on delivery, saved cards, instant Paystack checkout. Your payment info is encrypted and never stored on our servers.",
    },
    {
      emoji: "📍",
      title: "Smart address management",
      desc: "Save multiple delivery addresses — home, office, wherever. Pick from the map or drop a pin. We remember everything so you don't have to type your address every single time.",
      large: true,
      visual: "🗺️",
    },
    {
      emoji: "⭐",
      title: "Favorites & history",
      desc: "Save dishes you love. Reorder your last meal in two taps. Your whole food history in one place.",
    },
    {
      emoji: "🔍",
      title: "Search that actually works",
      desc: "Search by dish name, restaurant, or cuisine. Results update as you type. Find exactly what you want, fast.",
    },
  ];

  return (
    <section
      id="features"
      className="px-6 py-32 border-y border-border bg-surface md:px-12"
    >
      <div className="w-full max-w-[1400px] mx-auto">
        <Reveal>
          <div className="mb-4 text-xs font-mono tracking-[3px] text-orange uppercase">
            — Features
          </div>
          <h2 className="mb-20 text-[clamp(48px,6vw,80px)] font-bebas leading-[0.95] tracking-[1px]">
            BUILT
            <br />
            DIFFERENT
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <Reveal
              key={index}
              delay={index * 0.1}
              className={cn(
                "relative p-10 overflow-hidden transition-all duration-300 border rounded-2xl bg-black border-border hover:border-orange/20 hover:-translate-y-1 hover:shadow-2xl group",
                feature.large &&
                  "md:col-span-2 grid md:grid-cols-2 gap-12 items-center",
              )}
            >
              <div className="absolute inset-x-0 top-0 h-px transition-opacity opacity-0 bg-gradient-to-r from-transparent via-orange to-transparent group-hover:opacity-100" />

              <div>
                <div className="mb-5 text-4xl">{feature.emoji}</div>
                <h3 className="mb-3 text-[22px] font-semibold">
                  {feature.title}
                </h3>
                <p className="text-[15px] font-light leading-relaxed text-text-muted">
                  {feature.desc}
                </p>
              </div>

              {feature.large && (
                <div className="flex items-center justify-center h-[200px] text-6xl border rounded-xl bg-surface border-border">
                  {feature.visual}
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
