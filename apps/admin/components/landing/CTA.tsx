export function CTA() {
  return (
    <div className="relative px-6 py-20 overflow-hidden text-center bg-orange md:px-12">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[300px] font-bebas leading-none text-black/5 tracking-[20px] whitespace-nowrap pointer-events-none select-none">
        FOOD
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto">
        <h2 className="mb-6 text-[clamp(48px,7vw,96px)] font-bebas text-white leading-[0.95]">
          HUNGRY?
          <br />
          DOWNLOAD NOW.
        </h2>
        <p className="mb-10 text-lg font-light text-white/75">
          Join 3,200+ people already ordering with Food.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#"
            className="px-7 py-3.5 text-[15px] font-bold text-orange bg-white rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all"
          >
            ⬇ App Store
          </a>
          <a
            href="#"
            className="px-7 py-3.5 text-[15px] font-semibold text-white bg-transparent border-2 border-white/40 rounded-xl hover:bg-white/10 hover:border-white transition-all"
          >
            ⬇ Google Play
          </a>
        </div>
      </div>
    </div>
  );
}
