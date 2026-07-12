import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { StatsStrip } from "@/components/landing/StatsStrip";
import { AppShowcase } from "@/components/landing/AppShowcase";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { VendorCTA } from "@/components/landing/VendorCTA";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-orange selection:text-white">
      <Navbar />
      <Hero />
      <StatsStrip />
      <AppShowcase />
      <HowItWorks />
      <Features />
      <VendorCTA />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
