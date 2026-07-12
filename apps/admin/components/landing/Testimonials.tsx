"use client";

import { Reveal } from "./Reveal";

export function Testimonials() {
  const testimonials = [
    {
      star: "★★★★★",
      text: '"Finally an app that doesn\'t lie about delivery time. Order updates are instant and the map tracking is actually accurate."',
      name: "Emeka O.",
      role: "Customer · Lagos",
      avatar: "👨🏾",
    },
    {
      star: "★★★★★",
      text: '"Our online orders doubled in the first month. The dashboard is clean and managing the menu is so much easier than what we were using before."',
      name: "Amaka C.",
      role: "Restaurant Owner · Abuja",
      avatar: "👩🏾",
    },
    {
      star: "★★★★★",
      text: '"The Paystack integration is smooth. I tap, pay, done. Never had a payment issue. Best food app I\'ve used since I moved back."',
      name: "Dayo A.",
      role: "Customer · Lagos",
      avatar: "👨🏽",
    },
  ];

  return (
    <section className="px-6 py-32 bg-black md:px-12">
      <div className="w-full max-w-[1400px] mx-auto">
        <Reveal>
          <div className="mb-4 text-xs font-mono tracking-[3px] text-orange uppercase">
            — Reviews
          </div>
          <h2 className="mb-20 text-[clamp(48px,6vw,80px)] font-bebas leading-[0.95] tracking-[1px]">
            WHAT THEY
            <br />
            SAY
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <Reveal
              key={index}
              delay={index * 0.1}
              className="p-8 transition-all duration-300 border rounded-2xl bg-surface border-border hover:border-orange/20 hover:-translate-y-1"
            >
              <div className="mb-4 text-sm tracking-widest text-orange">
                {item.star}
              </div>
              <p className="mb-6 text-[15px] font-light italic leading-relaxed text-text-dim">
                {item.text}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 text-lg border rounded-full bg-surface-2 border-border">
                  {item.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold">{item.name}</div>
                  <div className="text-xs text-text-muted">{item.role}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
