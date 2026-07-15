"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2, ArrowLeft, UtensilsCrossed } from "lucide-react";
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
import { SpotlightCard } from "@/components/ui/custom/SpotlightCard";
import { ShinyText } from "@/components/ui/custom/ShinyText";
import { StaggerText } from "@/components/ui/custom/StaggerText";

const formSchema = z.object({
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
    <main className="min-h-screen bg-background text-foreground flex justify-center items-stretch relative">
      <Link
        href="/"
        className="fixed top-6 right-8 z-50 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-all duration-300 bg-background/50 backdrop-blur-md px-3 py-1.5 border border-border rounded-full"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Home
      </Link>

      <div className="w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-[1fr_1.1fr] min-h-screen">
        {/* LEFT PANEL */}
        <div className="hidden md:flex relative flex-col justify-between p-16 overflow-hidden border-r border-border bg-muted/20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,118,34,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,118,34,0.015)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[radial-gradient(circle,rgba(255,118,34,0.08),transparent_60%)] pointer-events-none" />

          <Link href="/" className="relative z-10 flex items-center gap-2 group">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <UtensilsCrossed className="size-4" />
            </div>
            <span className="font-bebas text-2xl tracking-[2px] text-foreground">
              DFOOD
            </span>
          </Link>

          <div className="relative z-10 max-w-lg">
            <div className="mb-4 text-[10px] font-bold tracking-widest text-primary uppercase">
              — Partner Management Portal
            </div>
            <h2 className="mb-6 text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-foreground">
              Your store operations <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange">
                unified.
              </span>
            </h2>
            <p className="mb-10 text-xs leading-relaxed text-muted-foreground">
              Manage your menus, coordinate incoming order statuses, and track your daily delivery payouts in real-time.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 48, label: "Active partners", suffix: "+", decimals: 0 },
                { value: 891, label: "Orders this week", suffix: "", decimals: 0 },
                { value: 4.3, label: "Weekly GMV", prefix: "₦", suffix: "M", decimals: 1 },
                { value: 4.8, label: "Avg rating", suffix: "★", decimals: 1 },
              ].map((stat, i) => (
                <SpotlightCard
                  key={i}
                  className="p-5 border border-border/80 bg-card"
                  spotlightColor="rgba(255, 118, 34, 0.05)"
                >
                  <div className="text-2xl font-bold text-primary flex items-center gap-0.5">
                    {stat.prefix}
                    <CountUp to={stat.value} duration={2} className="tabular-nums" />
                    {stat.suffix}
                  </div>
                  <div className="mt-1 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                    {stat.label}
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>

          <div className="relative z-10 text-[10px] font-mono text-muted-foreground">
            © {new Date().getFullYear()} DFood Network · Operational Portal
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col items-center justify-center p-6 md:p-16 bg-background">
          <div className="w-full max-w-[400px]">
            <div className="mb-8">
              <h1 className="mb-2 text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                <StaggerText text="Sign In" />
              </h1>
              <p className="text-xs text-muted-foreground">
                Don&apos;t have an account yet?{" "}
                <Link
                  href="/signup"
                  className="font-bold text-primary hover:underline"
                >
                  Register partner store →
                </Link>
              </p>
            </div>

            <SpotlightCard className="p-8 border border-border shadow-md bg-card" spotlightColor="rgba(255, 118, 34, 0.04)">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="operator@restaurant.com"
                            {...field}
                            className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs"
                          />
                        </FormControl>
                        <FormMessage className="text-[11px] text-red-500 font-normal" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              {...field}
                              className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute -translate-y-1/2 right-3 top-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff size={14} />
                              ) : (
                                <Eye size={14} />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-[11px] text-red-500 font-normal" />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between pt-1">
                    <FormField
                      control={form.control}
                      name="remember"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                          </FormControl>
                          <FormLabel className="text-xs font-semibold cursor-pointer text-muted-foreground">
                            Remember session
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Forgot?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 text-xs font-bold tracking-wider uppercase bg-primary text-primary-foreground hover:opacity-90 transition-all duration-300 rounded-lg shadow-sm"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShinyText text="SIGN IN" className="text-primary-foreground" />
                    )}
                  </Button>
                </form>
              </Form>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </main>
  );
}
