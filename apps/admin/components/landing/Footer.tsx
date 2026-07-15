import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export function Footer() {
  return (
    <footer className="px-6 pt-20 pb-10 border-t bg-background border-border/40 md:px-12">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-12 mb-16 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <UtensilsCrossed className="size-4" />
              </div>
              <span className="font-bebas text-2xl tracking-[2px] text-foreground">
                DFOOD
              </span>
            </Link>
            <p className="max-w-[280px] text-xs leading-relaxed text-muted-foreground">
              The premier marketplace and operations hub connecting quality vendors with users. Simple, fast, and secure.
            </p>
          </div>

          <div>
            <div className="mb-6 text-[9px] font-bold tracking-widest uppercase text-muted-foreground">
              Product
            </div>
            <ul className="space-y-3 list-none p-0 m-0">
              {["How it works", "Features", "For Restaurants", "Download App"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-6 text-[9px] font-bold tracking-widest uppercase text-muted-foreground">
              Company
            </div>
            <ul className="space-y-3 list-none p-0 m-0">
              {["About", "Blog", "Careers", "Press"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-6 text-[9px] font-bold tracking-widest uppercase text-muted-foreground">
              Legal
            </div>
            <ul className="space-y-3 list-none p-0 m-0">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between pt-8 border-t border-border/40 md:flex-row gap-4">
          <div className="text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} DFood Network. All rights reserved.
          </div>
          <div className="flex gap-3">
            {["𝕏", "LinkedIn", "Instagram"].map((social) => (
              <a
                key={social}
                href="#"
                className="flex items-center justify-center px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-all duration-300 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
