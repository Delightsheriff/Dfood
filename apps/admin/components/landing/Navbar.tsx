"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
        "fixed top-0 left-0 right-0 z-50 flex justify-center px-6 py-5 transition-all duration-300 border-b border-transparent md:px-12",
        scrolled && "bg-black/90 backdrop-blur-3xl border-border",
      )}
    >
      <div className="flex items-center justify-between w-full max-w-[1400px]">
        <Link
          href="/"
          className="font-bebas text-[28px] tracking-[3px] text-orange no-underline"
        >
          FOOD
        </Link>
        <ul className="hidden gap-10 list-none md:flex">
          {["How it works", "Features", "For Restaurants", "FAQ"].map(
            (item) => (
              <li key={item}>
                <Link
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm font-normal tracking-[0.5px] text-text-dim hover:text-text transition-colors"
                >
                  {item === "For Restaurants" ? "For Restaurants" : item}
                </Link>
              </li>
            ),
          )}
        </ul>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2.5 text-sm font-medium border rounded-lg border-border text-text bg-transparent hover:bg-surface hover:border-white/20 transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 text-sm font-semibold text-white border-none rounded-lg bg-orange hover:bg-orange-dim hover:-translate-y-px transition-all"
          >
            Partner With Us
          </Link>
        </div>
      </div>
    </nav>
  );
}
