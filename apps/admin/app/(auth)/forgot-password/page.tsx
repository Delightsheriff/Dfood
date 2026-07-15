"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowLeft, CheckCircle2, UtensilsCrossed } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/custom/SpotlightCard";
import { ShinyText } from "@/components/ui/custom/ShinyText";
import { StaggerText } from "@/components/ui/custom/StaggerText";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type FormData = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
    } catch {
      // swallow
    } finally {
      setLoading(false);
      setSent(true);
    }
  }

  return (
    <div className="auth-card w-full max-w-sm space-y-6">
      <SpotlightCard className="p-8 border border-border shadow-md bg-card" spotlightColor="rgba(255, 118, 34, 0.04)">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 group mb-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <UtensilsCrossed className="size-4" />
            </div>
            <span className="font-bebas text-2xl tracking-[2px] text-foreground">
              DFOOD
            </span>
          </Link>
        </div>

        {sent ? (
          <div className="text-center animate-in fade-in duration-300">
            <CheckCircle2 className="size-10 text-emerald-500 mx-auto mb-4" />
            <h1 className="text-lg font-bold text-foreground text-balance mb-2">
              Check your email
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed text-balance mb-6">
              If an account exists with that email, we&apos;ve sent instructions to reset your password.
            </p>
            <Link
              href="/login"
              className="focus-ring inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:underline"
            >
              <ArrowLeft className="size-3.5" />
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold tracking-tight text-foreground text-balance">
                <StaggerText text="Reset Password" />
              </h1>
              <p className="mt-2 text-xs text-muted-foreground text-balance leading-relaxed">
                Enter your email address and we&apos;ll send you a password reset link.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@restaurant.com"
                          {...field}
                          className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs"
                        />
                      </FormControl>
                      <FormMessage className="text-[11px] text-red-500 font-normal" />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={loading} className="w-full h-11 text-xs font-bold tracking-wider uppercase bg-primary text-primary-foreground hover:opacity-90 rounded-lg shadow-sm">
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ShinyText text="SEND RESET LINK" className="text-primary-foreground" />
                  )}
                </Button>
              </form>
            </Form>

            <p className="mt-6 text-center">
              <Link
                href="/login"
                className="focus-ring inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                Back to sign in
              </Link>
            </p>
          </>
        )}
      </SpotlightCard>

      <div className="flex flex-col items-center gap-2">
        <Link href="/" className="focus-ring text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">
          &larr; Back to home
        </Link>
        <p className="text-xs text-muted-foreground/60">
          &copy; {new Date().getFullYear()} DFood Network
        </p>
      </div>
    </div>
  );
}
