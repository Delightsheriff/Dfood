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
    <section className="px-6 py-20 bg-background md:px-12">
      <div className="w-full max-w-7xl mx-auto">
        <Reveal>
          <div className="mb-4 text-[10px] font-bold tracking-widest text-primary uppercase">
            — Feedback
          </div>
          <h2 className="mb-12 text-2xl md:text-4xl font-bold tracking-tight text-foreground">
            Trusted by operators
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <Reveal
              key={index}
              delay={index * 0.08}
              className="p-8 transition-all duration-300 border border-border rounded-xl bg-card hover:border-primary/20 shadow-sm"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              
              <p className="mb-8 text-xs leading-relaxed text-muted-foreground italic">
                {item.text}
              </p>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 border border-border rounded-full bg-muted">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">{item.name}</div>
                  <div className="text-[10px] text-muted-foreground">{item.role}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
