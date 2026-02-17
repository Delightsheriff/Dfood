"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Which cities do you deliver in?",
      a: "We currently operate in Lagos and Abuja. We're expanding fast — sign up to get notified when we launch in your city.",
    },
    {
      q: "How do I track my order?",
      a: "Every order comes with real-time push notifications. You'll be updated at every stage — confirmed, being prepared, picked up, and delivered.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major debit and credit cards via Paystack, as well as cash on delivery. Your card details are encrypted and never stored on our servers.",
    },
    {
      q: "How do I become a restaurant partner?",
      a: 'Click "Partner With Us" and fill out the signup form. We review applications within 24 hours. Setup is free — we only charge a 10% commission on completed orders.',
    },
    {
      q: "What happens if my order is wrong or late?",
      a: "Contact us through the app and we'll sort it out immediately. Wrong orders get refunded. Consistently late restaurants get flagged on our end.",
    },
    {
      q: "Is the app free to download?",
      a: "Yes. The app is completely free. You only pay for the food you order plus the restaurant's delivery fee. No subscription, no hidden charges.",
    },
  ];

  return (
    <section
      id="faq"
      className="px-6 py-32 border-t bg-surface border-border md:px-12"
    >
      <div className="grid items-start grid-cols-1 gap-20 mx-auto w-full max-w-[1400px] lg:grid-cols-2">
        <Reveal>
          <div className="mb-4 text-xs font-mono tracking-[3px] text-orange uppercase">
            — FAQ
          </div>
          <h2 className="mb-6 text-[clamp(48px,6vw,80px)] font-bebas leading-[0.95] tracking-[1px]">
            GOT
            <br />
            QUESTIONS?
          </h2>
          <p className="text-[15px] font-light leading-relaxed text-text-muted">
            Can&apos;t find what you&apos;re looking for? Reach us at
            <br />
            <a
              href="mailto:support@food.com"
              className="text-orange hover:underline"
            >
              support@food.com
            </a>
          </p>
        </Reveal>

        <div className="flex flex-col gap-2">
          {faqs.map((faq, index) => (
            <Reveal key={index} delay={index * 0.1}>
              <div className="overflow-hidden border rounded-lg border-border">
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className={cn(
                    "flex items-center justify-between w-full p-5 text-left transition-colors bg-black hover:bg-surface font-medium text-[15px]",
                    openIndex === index && "text-orange",
                  )}
                >
                  {faq.q}
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 transition-transform duration-300 border rounded-full border-border p-1 box-content text-[12px]",
                      openIndex === index &&
                        "rotate-180 border-orange text-orange",
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 text-sm font-light leading-relaxed bg-black text-text-muted">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
