"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";
import { ChevronDown, Mail } from "lucide-react";
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
      a: 'Click "Partner Register" and fill out the signup form. We review applications within 24 hours. Setup is free — we only charge a 10% commission on completed orders.',
    },
    {
      q: "What happens if my order is wrong or late?",
      a: "Contact us through the app and we'll sort it out immediately. Wrong orders get refunded. Consistently late restaurants get flagged on our end.",
    },
  ];

  return (
    <section id="faq" className="px-6 py-24 border-t bg-black border-white/5 md:px-12">
      <div className="grid items-start grid-cols-1 gap-16 mx-auto w-full max-w-7xl lg:grid-cols-2">
        <Reveal>
          <div className="mb-4 text-[10px] font-bold tracking-widest text-orange uppercase">
            — FAQ
          </div>
          <h2 className="mb-6 text-3xl md:text-5xl font-bold tracking-tight text-text">
            Frequently Asked Questions
          </h2>
          <p className="text-xs leading-relaxed text-text-muted max-w-sm">
            Can&apos;t find what you&apos;re looking for? Contact support team at:
            <br />
            <a
              href="mailto:support@dfood.com"
              className="inline-flex items-center gap-1 mt-2 text-orange hover:underline font-semibold"
            >
              <Mail className="w-3.5 h-3.5" />
              support@dfood.com
            </a>
          </p>
        </Reveal>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <Reveal key={index} delay={index * 0.1}>
              <div className="overflow-hidden border rounded-xl border-white/5 bg-[#080808]">
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className={cn(
                    "flex items-center justify-between w-full p-5 text-left transition-colors hover:bg-white/5 font-semibold text-xs text-text",
                    openIndex === index && "text-orange"
                  )}
                >
                  {faq.q}
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-300 text-zinc-500",
                      openIndex === index && "rotate-180 text-orange"
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 text-xs leading-relaxed text-text-dim border-t border-white/[0.03] pt-4">
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
