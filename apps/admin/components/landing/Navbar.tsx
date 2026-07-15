"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { UtensilsCrossed } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex justify-center px-6 py-5 transition-all duration-300 md:px-12",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/40 py-3.5"
          : "bg-transparent py-5"
      )}
    >
      <div className="flex items-center justify-between w-full max-w-7xl">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-105">
            <UtensilsCrossed className="size-4" />
          </div>
          <span className="font-bebas text-2xl tracking-[2px] text-foreground group-hover:text-primary transition-colors duration-300">
            DFOOD
          </span>
        </Link>

        <ul className="hidden gap-8 list-none md:flex items-center m-0 p-0">
          {["How it works", "Features", "For Restaurants", "FAQ"].map((item) => (
            <li key={item}>
              <Link
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-foreground hover:text-primary transition-colors duration-300"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground rounded-lg bg-primary hover:opacity-90 transition-all duration-300 shadow-sm hover:shadow active:scale-95"
          >
            Join Network
          </Link>
        </div>
      </div>
    </nav>
  );
}
