import Link from "next/link";

export function Footer() {
  return (
    <footer className="px-6 pt-16 pb-8 border-t bg-black border-border md:px-12">
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 gap-12 mb-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-4 text-3xl font-bebas tracking-[3px] text-orange">
              FOOD
            </div>
            <p className="max-w-[260px] text-sm font-light leading-relaxed text-text-muted">
              Connecting hungry people with great restaurants. Fast delivery,
              real food, real simple.
            </p>
          </div>

          <div>
            <div className="mb-5 text-xs font-mono tracking-[2px] uppercase text-text-dim">
              Product
            </div>
            <ul className="space-y-3 list-none">
              {[
                "How it works",
                "Features",
                "For Restaurants",
                "Download App",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-text-muted hover:text-text transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-5 text-xs font-mono tracking-[2px] uppercase text-text-dim">
              Company
            </div>
            <ul className="space-y-3 list-none">
              {["About", "Blog", "Careers", "Press"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-text-muted hover:text-text transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-5 text-xs font-mono tracking-[2px] uppercase text-text-dim">
              Legal
            </div>
            <ul className="space-y-3 list-none">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
                "Contact",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-text-muted hover:text-text transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between pt-8 border-t border-border md:flex-row">
          <div className="mb-4 text-[13px] font-mono text-text-muted md:mb-0">
            © {new Date().getFullYear()} Food. All rights reserved.
          </div>
          <div className="flex gap-4">
            {["𝕏", "in", "ig"].map((icon) => (
              <a
                key={icon}
                href="#"
                className="flex items-center justify-center w-9 h-9 text-sm transition-all border rounded-lg border-border text-text-muted hover:text-text hover:bg-surface hover:border-white/20"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
