"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import CountUp from "@/components/ui/CountUp";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
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
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  role: z.enum(["vendor", "admin"]),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  remember: z.boolean(),
});

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "vendor",
      email: "",
      password: "",
      remember: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Login Failed", {
          description: "Invalid email or password. Please try again.",
        });
      } else {
        toast.success("Login Successful", {
          description: "Welcome back!",
        });

        // Redirect to dashboard
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("An error occurred", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex justify-center">
      <div className="w-full max-w-350 grid grid-cols-1 md:grid-cols-2">
        <Link
          href="/"
          className="fixed top-6 right-8 z-50 flex items-center gap-2 text-[13px] text-text-muted hover:text-white transition-colors no-underline"
        >
          ← Back to home
        </Link>

        {/* LEFT PANEL */}
        <div className="hidden md:flex relative flex-col justify-between p-12 overflow-hidden bg-surface border-r border-border">
          {/* Grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-size-[60px_60px] pointer-events-none" />

          {/* Orange glow */}
          <div className="absolute -bottom-25 -left-25 w-125 h-125 bg-[radial-gradient(circle,rgba(255,118,34,0.15),transparent_60%)] pointer-events-none" />

          <Link
            href="/"
            className="relative z-10 font-bebas text-[32px] tracking-[4px] text-orange no-underline"
          >
            FOOD
          </Link>

          <div className="relative z-10">
            <div className="mb-5 text-[11px] font-mono tracking-[3px] text-orange uppercase">
              — Partner Portal
            </div>
            <h2 className="mb-6 text-[72px] font-bebas leading-[0.9] tracking-[1px]">
              YOUR
              <br />
              <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.2)]">
                ORDERS
              </span>
              <br />
              AWAIT.
            </h2>
            <p className="max-w-85 mb-10 text-[15px] font-light leading-relaxed text-text-muted">
              Manage your restaurant, track real-time orders, and grow your
              delivery revenue — all in one dashboard.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  value: 48,
                  label: "Active partners",
                  suffix: "+",
                  decimals: 0,
                },
                {
                  value: 891,
                  label: "Orders this week",
                  suffix: "",
                  decimals: 0,
                },
                {
                  value: 4.3,
                  label: "Weekly GMV",
                  prefix: "₦",
                  suffix: "M",
                  decimals: 1,
                },
                {
                  value: 4.8,
                  label: "Avg rating",
                  suffix: "★",
                  decimals: 1,
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-4 border rounded-xl bg-white/3 border-border"
                >
                  <div className="font-bebas text-[28px] text-orange leading-none flex items-center gap-1">
                    {stat.prefix}
                    <CountUp
                      to={stat.value}
                      duration={2.5}
                      className="tabular-nums"
                    />
                    {stat.suffix}
                  </div>
                  <div className="mt-0.5 text-[12px] text-text-muted">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 text-[12px] font-mono text-text-muted">
            © {new Date().getFullYear()} FOOD · All rights reserved
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-100">
            <div className="mb-10">
              <h1 className="mb-2 text-[42px] font-bebas tracking-[1px]">
                SIGN IN
              </h1>
              <p className="text-sm font-light text-text-muted">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-orange hover:underline"
                >
                  Partner with us →
                </Link>
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] font-semibold tracking-[1.5px] uppercase text-text-dim font-mono">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="you@restaurant.com"
                          {...field}
                          className="bg-surface border-border focus:border-orange/50 focus:ring-orange/10 h-12 rounded-[10px]"
                        />
                      </FormControl>
                      <FormMessage className="text-[12px] text-red-400 font-normal" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] font-semibold tracking-[1.5px] uppercase text-text-dim font-mono">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                            className="bg-surface border-border focus:border-orange/50 focus:ring-orange/10 h-12 rounded-[10px] pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute -translate-y-1/2 right-3 top-1/2 text-text-muted hover:text-white"
                          >
                            {showPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[12px] text-red-400 font-normal" />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between mb-2">
                  <FormField
                    control={form.control}
                    name="remember"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-border data-[state=checked]:bg-orange data-[state=checked]:border-orange"
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer text-text-dim">
                          Remember me
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <Link
                    href="/forgot-password"
                    className="text-sm text-orange hover:opacity-80 transition-opacity"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-13.5 text-[15px] font-bold tracking-[0.5px] bg-orange hover:bg-[#e86a1e] hover:shadow-[0_12px_24px_rgba(255,118,34,0.25)] hover:-translate-y-0.5 transition-all duration-250 rounded-[10px]"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "SIGN IN"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-sm text-center text-text-muted">
              Want to list your restaurant?{" "}
              <Link
                href="/signup"
                className="font-semibold text-orange hover:underline"
              >
                Apply here →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
