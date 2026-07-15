"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { UtensilsCrossed } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex justify-center px-6 py-5 transition-all duration-500 md:px-12",
        scrolled
          ? "bg-black/40 backdrop-blur-md border-b border-white/5 py-4"
          : "bg-transparent py-6"
      )}
    >
      <div className="flex items-center justify-between w-full max-w-7xl">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex size-9 items-center justify-center rounded-xl bg-orange text-white shadow-lg shadow-orange/20 transition-transform duration-300 group-hover:scale-105">
            <UtensilsCrossed className="size-4" />
          </div>
          <span className="font-bebas text-2xl tracking-[2px] text-text group-hover:text-orange transition-colors duration-300">
            DFOOD
          </span>
        </Link>

        <ul className="hidden gap-8 list-none md:flex">
          {["How it works", "Features", "For Restaurants", "FAQ"].map((item) => (
            <li key={item}>
              <Link
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-xs font-semibold uppercase tracking-wider text-text-dim hover:text-orange transition-colors duration-300"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-text hover:text-orange transition-colors duration-300"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white rounded-xl bg-orange hover:bg-orange-dim transition-all duration-300 hover:shadow-lg hover:shadow-orange/10 active:scale-95"
          >
            Join Network
          </Link>
        </div>
      </div>
    </nav>
  );
}
