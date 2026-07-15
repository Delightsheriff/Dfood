"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Control, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, ChevronRight, Eye, EyeOff, Loader2, ArrowLeft, UtensilsCrossed } from "lucide-react";
import { signIn } from "next-auth/react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { SpotlightCard } from "@/components/ui/custom/SpotlightCard";
import { ShinyText } from "@/components/ui/custom/ShinyText";
import { StaggerText } from "@/components/ui/custom/StaggerText";

// Schema Definitions
const step1Schema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const step2Schema = z.object({
  restaurantName: z.string().min(2, "Restaurant name required").max(100),
  restaurantAddress: z.string().min(10, "Full address required"),
  deliveryFee: z.coerce.number().min(0, "Delivery fee must be 0 or more"),
  openingTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  closingTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  description: z.string().max(500).optional(),
});

const step3Schema = z.object({
  agreeTerms: z.boolean().refine((val) => val === true, "Must agree to terms"),
});

const signupSchema = step1Schema.merge(step2Schema).merge(step3Schema);

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema) as unknown as Resolver<SignupFormValues>,
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      restaurantName: "",
      restaurantAddress: "",
      deliveryFee: 0,
      openingTime: "09:00",
      closingTime: "22:00",
      description: "",
      agreeTerms: false,
    },
  });

  const { trigger, getValues } = form;

  const nextStep = async () => {
    let fieldsToValidate: (keyof SignupFormValues)[] = [];
    if (step === 1) {
      fieldsToValidate = ["firstName", "lastName", "email", "phone", "password"];
    } else if (step === 2) {
      fieldsToValidate = [
        "restaurantName",
        "restaurantAddress",
        "deliveryFee",
        "openingTime",
        "closingTime",
      ];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/vendor/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            password: data.password,
            restaurantName: data.restaurantName,
            restaurantAddress: data.restaurantAddress,
            deliveryFee: data.deliveryFee,
            openingTime: data.openingTime,
            closingTime: data.closingTime,
            description: data.description || undefined,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create account");
      }

      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.success("Account Created", {
          description: "Please sign in with your credentials.",
        });
        router.push("/login");
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred. Please try again.";
      toast.error("Signup Failed", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-background text-foreground flex justify-center items-center p-6">
        <SpotlightCard className="w-full max-w-md text-center p-12 border border-border bg-card shadow-lg">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
            🎉
          </div>
          <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-foreground">
            Account Created!
          </h2>
          <p className="mb-8 text-xs leading-relaxed text-muted-foreground">
            Your vendor account has been created successfully. Redirecting you to the dashboard...
          </p>
          <div className="flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        </SpotlightCard>
      </main>
    );
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
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[radial-gradient(circle,rgba(255,118,34,0.08),transparent_60%)] pointer-events-none" />

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
              — Onboarding Program
            </div>
            <h2 className="mb-6 text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-foreground">
              Partner with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange">
                DFood Network.
              </span>
            </h2>
            <p className="mb-8 text-xs leading-relaxed text-muted-foreground">
              Join local partners currently managing operations, updating delivery routes, and collecting payouts on the DFood dashboard.
            </p>

            <ul className="flex flex-col gap-3 p-0 list-none">
              {[
                { icon: "₦", text: "10% commission only — zero setup fees" },
                { icon: "⚡", text: "Store dashboard activated in 24 hours" },
                { icon: "📊", text: "Full analytical reports & customer insights" },
                { icon: "🔔", text: "Instant order sound alerts — never miss a sale" },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="w-6 h-6 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center text-[10px] shrink-0 font-bold text-primary">
                    {item.icon}
                  </div>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 text-[10px] font-mono text-muted-foreground">
            © {new Date().getFullYear()} DFood Network · Operational Portal
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col items-center pt-24 pb-12 px-6 md:px-16 bg-background overflow-y-auto">
          <div className="w-full max-w-[420px]">
            {/* Header */}
            <div className="mb-8">
              <h1 className="mb-2 text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                <StaggerText text="Partner Up" />
              </h1>
              <p className="text-xs text-muted-foreground">
                Already registered?{" "}
                <Link href="/login" className="font-bold text-primary hover:underline">
                  Sign in here →
                </Link>
              </p>
            </div>

            {/* Step Indicator */}
            <div className="mb-8">
              <div className="relative flex items-center justify-between mb-2">
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex pointer-events-none">
                  <div
                    className={`flex-1 h-px transition-colors duration-300 ${
                      step > 1 ? "bg-primary/50" : "bg-border"
                    }`}
                  />
                  <div
                    className={`flex-1 h-px transition-colors duration-300 ${
                      step > 2 ? "bg-primary/50" : "bg-border"
                    }`}
                  />
                </div>
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`relative z-10 w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-mono transition-all duration-300 ${
                      step === s
                        ? "bg-primary border-primary text-primary-foreground font-bold"
                        : step > s
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold"
                        : "bg-muted border-border text-muted-foreground"
                    }`}
                  >
                    {step > s ? <Check size={12} /> : s}
                  </div>
                ))}
              </div>

              <div className="flex justify-between px-1">
                {["Contact", "Restaurant", "Review"].map((label, i) => (
                  <span
                    key={label}
                    className={`text-[9px] font-bold tracking-wider uppercase transition-colors ${
                      step === i + 1 ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <SpotlightCard className="p-8 border border-border shadow-md bg-card" spotlightColor="rgba(255, 118, 34, 0.04)">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* STEP 1: Account Info */}
                  <div className={step === 1 ? "block animate-in fade-in" : "hidden"}>
                    <div className="mb-4 pb-2 border-b border-border/40 text-[10px] font-bold tracking-wider uppercase text-muted-foreground font-mono">
                      Your Details
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control as unknown as Control<SignupFormValues>}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">
                              First Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John"
                                {...field}
                                className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs"
                              />
                            </FormControl>
                            <FormMessage className="text-[11px] text-red-500" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control as unknown as Control<SignupFormValues>}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">
                              Last Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Doe"
                                {...field}
                                className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs"
                              />
                            </FormControl>
                            <FormMessage className="text-[11px] text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control as unknown as Control<SignupFormValues>}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="mt-3">
                          <FormLabel className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="operator@restaurant.com"
                              type="email"
                              {...field}
                              className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs"
                            />
                          </FormControl>
                          <FormMessage className="text-[11px] text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control as unknown as Control<SignupFormValues>}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="mt-3">
                          <FormLabel className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+234..."
                              type="tel"
                              {...field}
                              className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs"
                            />
                          </FormControl>
                          <FormMessage className="text-[11px] text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control as unknown as Control<SignupFormValues>}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="mt-3">
                          <FormLabel className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">
                            Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Min. 8 characters"
                                {...field}
                                className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute -translate-y-1/2 right-3 top-1/2 text-muted-foreground hover:text-foreground"
                              >
                                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-[11px] text-red-500" />
                        </FormItem>
                      )}
                    />

                    <div className="mt-6">
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="w-full h-11 text-xs font-bold tracking-wider uppercase bg-primary text-primary-foreground hover:opacity-90 rounded-lg flex items-center justify-center gap-1 shadow-sm"
                      >
                        Continue <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>

                  {/* STEP 2: Restaurant Info */}
                  <div className={step === 2 ? "block animate-in fade-in" : "hidden"}>
                    <div className="mb-4 pb-2 border-b border-border/40 text-[10px] font-bold tracking-wider uppercase text-muted-foreground font-mono">
                      Restaurant Details
                    </div>

                    <FormField
                      control={form.control as unknown as Control<SignupFormValues>}
                      name="restaurantName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">
                            Restaurant Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Chow Cafe"
                              {...field}
                              className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs"
                            />
                          </FormControl>
                          <FormMessage className="text-[11px] text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control as unknown as Control<SignupFormValues>}
                      name="restaurantAddress"
                      render={({ field }) => (
                        <FormItem className="mt-3">
                          <FormLabel className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">
                            Full Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Street, City, State"
                              {...field}
                              className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs"
                            />
                          </FormControl>
                          <FormMessage className="text-[11px] text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control as unknown as Control<SignupFormValues>}
                      name="deliveryFee"
                      render={({ field }) => (
                        <FormItem className="mt-3">
                          <FormLabel className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">
                            Base Delivery Fee (₦)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              {...field}
                              className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs"
                            />
                          </FormControl>
                          <FormMessage className="text-[11px] text-red-500" />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <FormField
                        control={form.control as unknown as Control<SignupFormValues>}
                        name="openingTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">
                              Opening Time
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="time"
                                {...field}
                                className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs cursor-pointer"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control as unknown as Control<SignupFormValues>}
                        name="closingTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">
                              Closing Time
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="time"
                                {...field}
                                className="bg-background border-border focus:ring-primary/20 h-10 rounded-lg text-xs cursor-pointer"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control as unknown as Control<SignupFormValues>}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="mt-3">
                          <FormLabel className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">
                            Short Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief description for menus..."
                              {...field}
                              className="bg-background border-border focus:ring-primary/20 rounded-lg text-xs min-h-16"
                            />
                          </FormControl>
                          <FormMessage className="text-[11px] text-red-500" />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-3 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="flex-1 h-11 border-border bg-transparent hover:bg-muted text-xs font-semibold rounded-lg"
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="flex-[2] h-11 text-xs font-bold tracking-wider uppercase bg-primary text-primary-foreground hover:opacity-90 rounded-lg flex items-center justify-center gap-1 shadow-sm"
                      >
                        Continue <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>

                  {/* STEP 3: Confirm */}
                  <div className={step === 3 ? "block animate-in fade-in" : "hidden"}>
                    <div className="mb-4 pb-2 border-b border-border/40 text-[10px] font-bold tracking-wider uppercase text-muted-foreground font-mono">
                      Review details
                    </div>

                    <div className="bg-background border border-border rounded-lg p-5 mb-5 space-y-4">
                      <div>
                        <div className="text-[8px] font-bold text-muted-foreground uppercase font-mono tracking-wider">
                          Store Representative
                        </div>
                        <div className="text-[11px] font-bold text-foreground mt-0.5">
                          {getValues("firstName")} {getValues("lastName")}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {getValues("email")}
                        </div>
                      </div>
                      <div>
                        <div className="text-[8px] font-bold text-muted-foreground uppercase font-mono tracking-wider">
                          Restaurant Store
                        </div>
                        <div className="text-[11px] font-bold text-foreground mt-0.5">
                          {getValues("restaurantName")}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {getValues("restaurantAddress")}
                        </div>
                      </div>
                    </div>

                    <FormField
                      control={form.control as unknown as Control<SignupFormValues>}
                      name="agreeTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-2.5 space-y-0 mb-5">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-0.5"
                            />
                          </FormControl>
                          <div className="leading-tight">
                            <FormLabel className="text-[10px] font-semibold text-muted-foreground cursor-pointer leading-normal">
                              I agree to the{" "}
                              <Link href="/terms" className="text-primary hover:underline">
                                Terms of Service
                              </Link>{" "}
                              and{" "}
                              <Link href="/privacy" className="text-primary hover:underline">
                                Privacy Policy
                              </Link>
                              .
                            </FormLabel>
                            <FormMessage className="text-[11px] text-red-500 pt-1" />
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={loading}
                        className="flex-1 h-11 border-border bg-transparent hover:bg-muted text-xs font-semibold rounded-lg"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex-[2] h-11 text-xs font-bold tracking-wider uppercase bg-primary text-primary-foreground hover:opacity-90 rounded-lg shadow-sm"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ShinyText text="SUBMIT APPLICATION" className="text-primary-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </main>
  );
}
