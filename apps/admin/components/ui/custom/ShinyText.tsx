"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ShinyTextProps {
  text: string;
  className?: string;
  speed?: number; // in seconds
}

export function ShinyText({ text, className, speed = 4 }: ShinyTextProps) {
  return (
    <>
      <style>{`
        @keyframes shine-anim {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .shiny-text-effect {
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0) 30%,
            rgba(255, 255, 255, 0.8) 50%,
            rgba(255, 255, 255, 0) 70%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
        }
        .dark .shiny-text-effect {
          background: linear-gradient(
            120deg,
            rgba(255, 118, 34, 0) 30%,
            rgba(255, 118, 34, 0.9) 50%,
            rgba(255, 118, 34, 0) 70%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
      <span
        className={cn("shiny-text-effect font-bold", className)}
        style={{
          animation: `shine-anim ${speed}s linear infinite`,
        }}
      >
        {text}
      </span>
    </>
  );
}
