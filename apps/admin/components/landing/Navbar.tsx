"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex justify-center px-6 py-5 transition-all duration-300 md:px-12",
        scrolled && "bg-background/80 backdrop-blur-md border-b border-border/40 py-3.5"
      )}
    >
      <div className="flex items-center justify-between w-full max-w-7xl">
        <Link href="/">
          <img src="/logo.png" alt="DFOOD" className="h-9 w-auto" />
        </Link>

        <ul className="hidden gap-8 list-none md:flex items-center m-0 p-0">
          {["How it works", "Features", "FAQ"].map((item) => (
            <li key={item}>
              <Link
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="ink-underline text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="focus-ring px-4 py-2 text-xs font-bold uppercase tracking-wider text-foreground hover:text-primary transition-colors duration-300"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="focus-ring px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground rounded-lg bg-primary hover:opacity-90 transition-all duration-300 active:scale-95"
          >
            Join Network
          </Link>
        </div>
      </div>
    </nav>
  );
}
