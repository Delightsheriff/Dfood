"use client";

import { Reveal } from "./Reveal";
import { Star, User } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      text: '"Finally a dashboard system that doesn\'t lie about delivery times. Menu updates are instantly synced to our systems."',
      name: "Emeka O.",
      role: "Restaurant Partner · Lagos",
    },
    {
      text: '"Our online orders doubled in the first month. The operations catalog controls are clean, and role routing is seamless."',
      name: "Amaka C.",
      role: "Cafe Owner · Abuja",
    },
    {
      text: '"The automated financials dashboard is super neat. I can export clean CSV reports of active coupons in seconds."',
      name: "Dayo A.",
      role: "Operations Lead · Lagos",
    },
  ];

  return (
    <section className="px-6 py-24 bg-black md:px-12">
      <div className="w-full max-w-7xl mx-auto">
        <Reveal>
          <div className="mb-4 text-[10px] font-bold tracking-widest text-orange uppercase">
            — Feedback
          </div>
          <h2 className="mb-16 text-3xl md:text-5xl font-bold tracking-tight text-text">
            Trusted by operators
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <Reveal
              key={index}
              delay={index * 0.1}
              className="p-8 transition-all duration-300 border border-white/5 rounded-2xl bg-[#080808] hover:border-orange/20"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-orange text-orange" />
                ))}
              </div>
              
              <p className="mb-8 text-xs leading-relaxed text-text-dim italic">
                {item.text}
              </p>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 border border-white/5 rounded-full bg-white/5">
                  <User className="w-4 h-4 text-zinc-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-text">{item.name}</div>
                  <div className="text-[10px] text-text-muted">{item.role}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
