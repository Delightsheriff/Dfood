"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-32 pb-20 overflow-hidden text-center md:px-12 hero">
      {/* Radial glow */}
      <div className="absolute w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,118,34,0.12)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Floating grid lines */}
      <div
        className="absolute inset-0 bg-[size:80px_80px] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-[13px] border rounded-full border-orange/30 text-orange font-mono tracking-[0.5px]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange animate-[pulse_2s_ease_infinite]" />
          Now available in Lagos & Abuja
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="mb-3 text-[clamp(72px,12vw,160px)] font-bebas leading-[0.9] tracking-[2px]"
        >
          <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.15)]">
            CRAVE
          </span>
          <br />
          <span className="text-text">IT.</span>{" "}
          <span className="text-orange">GET</span>
          <br />
          <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.15)]">
            IT.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-[520px] mb-12 text-[clamp(16px,2vw,20px)] font-light leading-relaxed text-text-muted"
        >
          Order from the best restaurants near you. Real-time tracking, seamless
          payments, delivered fast.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#"
              className="flex items-center gap-3 px-6 py-3.5 no-underline transition-all duration-300 border border-border rounded-xl bg-surface text-text hover:bg-surface-2 hover:border-white/15 hover:-translate-y-1 hover:shadow-2xl min-w-[180px]"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="shrink-0"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <span className="block text-[11px] text-text-muted">
                  Download on the
                </span>
                <span className="block text-base font-semibold">App Store</span>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-6 py-3.5 no-underline transition-all duration-300 border border-border rounded-xl bg-surface text-text hover:bg-surface-2 hover:border-white/15 hover:-translate-y-1 hover:shadow-2xl min-w-[180px]"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="shrink-0"
              >
                <path d="M3.18 23.76c.3.17.64.22.98.15l12.18-12.18L12.6 8l-9.42 15.76zM20.65 10.27l-2.73-1.57-3.37 3.37 3.37 3.37 2.75-1.58c.79-.45.79-1.6-.02-2.59zM2.11.25C1.87.5 1.74.88 1.74 1.38v21.24c0 .5.13.88.37 1.13l.06.06 11.9-11.9V11.7L2.11.25zM16.37 8.37L4.19.19C3.87-.01 3.57-.06 3.3.09L15.6 12.38l.77-.77z" />
              </svg>
              <div className="text-left">
                <span className="block text-[11px] text-text-muted">
                  Get it on
                </span>
                <span className="block text-base font-semibold">
                  Google Play
                </span>
              </div>
            </a>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-[1px] text-text-muted">
            <div className="w-10 h-px bg-text-muted animate-[scrollLine_2s_ease_infinite_origin-left] origin-left scale-x-0" />
            SCROLL TO EXPLORE
            <div className="w-10 h-px bg-text-muted animate-[scrollLine_2s_ease_infinite_origin-right] origin-right scale-x-0 !animation-delay-[1s]" />
            <style jsx>{`
              @keyframes scrollLine {
                0% {
                  transform: scaleX(0);
                  transform-origin: left;
                }
                50% {
                  transform: scaleX(1);
                  transform-origin: left;
                }
                51% {
                  transform: scaleX(1);
                  transform-origin: right;
                }
                100% {
                  transform: scaleX(0);
                  transform-origin: right;
                }
              }
            `}</style>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
