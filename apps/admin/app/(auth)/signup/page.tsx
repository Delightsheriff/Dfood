"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, Control, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, ChevronRight, Eye, EyeOff, Loader2 } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Schema Definitions

const step1Schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Invalid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Required"),
});

const step2Schema = z.object({
  restaurantName: z.string().min(1, "Required"),
  cuisineType: z.string().min(1, "Select cuisine type"),
  restaurantAddress: z.string().min(1, "Required"),
  city: z.string().min(1, "Select city"),
  deliveryFee: z.coerce.number().min(0, "Invalid fee"),
  openingTime: z.string(),
  closingTime: z.string(),
  description: z.string().max(200).optional(),
});

const step3Schema = z.object({
  agreeTerms: z.boolean().refine((val) => val === true, "Must agree to terms"),
});

// Combined schema for form type
const signupSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(
      signupSchema,
    ) as unknown as Resolver<SignupFormValues>,
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      restaurantName: "",
      cuisineType: "",
      restaurantAddress: "",
      city: "",
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
      fieldsToValidate = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "password",
        "confirmPassword",
      ];
    } else if (step === 2) {
      fieldsToValidate = [
        "restaurantName",
        "cuisineType",
        "restaurantAddress",
        "city",
        "deliveryFee",
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
    // Simulate API call
    setTimeout(() => {
      console.log("Signup Data:", data);
      setLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-black text-white flex justify-center items-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            🎉
          </div>
          <h2 className="mb-4 text-[36px] font-bebas tracking-[1px]">
            APPLICATION SENT!
          </h2>
          <p className="mb-8 text-[15px] font-light leading-relaxed text-text-muted">
            We&apos;ve received your application and will review it within 24
            hours. Check your email at{" "}
            <strong className="text-white">{getValues("email")}</strong> for
            next steps.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-orange text-white rounded-[10px] font-semibold text-[15px] hover:bg-[#e86a1e] transition-all"
          >
            Back to Home →
          </Link>
        </div>
      </main>
    );
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
        <div className="hidden md:flex relative flex-col justify-between p-12 overflow-hidden bg-surface border-r border-border h-screen  top-0">
          {/* Grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-size-[60px_60px] pointer-events-none" />

          {/* Orange glow */}
          <div className="absolute -top-25 -right-25 w-125 h-125 bg-[radial-gradient(circle,rgba(255,118,34,0.12),transparent_60%)] pointer-events-none" />

          <Link
            href="/"
            className="relative z-10 font-bebas text-[32px] tracking-[4px] text-orange no-underline"
          >
            FOOD
          </Link>

          <div className="relative z-10">
            <div className="mb-5 text-[11px] font-mono tracking-[3px] text-orange uppercase">
              — Why partner with us
            </div>
            <h2 className="mb-6 text-[64px] font-bebas leading-[0.9] tracking-[1px]">
              MORE
              <br />
              <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.2)]">
                ORDERS.
              </span>
              <br />
              LESS
              <br />
              HASSLE.
            </h2>
            <p className="max-w-100 mb-8 text-[14px] font-light leading-relaxed text-text-muted">
              Join 48+ restaurants already growing with Food. Manage orders in
              real-time, reach new customers, and get paid directly.
            </p>

            <ul className="flex flex-col gap-3">
              {[
                { icon: "₦", text: "10% commission only — no setup fees" },
                { icon: "⚡", text: "Live dashboard activated in 24 hours" },
                { icon: "📊", text: "Real-time orders, analytics, insights" },
                {
                  icon: "🔔",
                  text: "Instant order alerts — never miss a sale",
                },
                { icon: "💳", text: "Direct payouts to your bank account" },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-[14px] text-text-dim"
                >
                  <div className="w-7 h-7 bg-orange/10 border border-orange/20 rounded-lg flex items-center justify-center text-[14px] shrink-0">
                    {item.icon}
                  </div>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 text-[12px] font-mono text-text-muted">
            © {new Date().getFullYear()} FOOD · All rights reserved
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col items-center pt-16 pb-12 px-6 md:px-12 w-full">
          <div className="w-full max-w-115">
            {/* Header */}
            <div className="mb-10">
              <h1 className="mb-2 text-[42px] font-bebas tracking-[1px]">
                PARTNER UP
              </h1>
              <p className="text-sm font-light text-text-muted">
                Already a partner?{" "}
                <Link
                  href="/login"
                  className="font-medium text-orange hover:underline"
                >
                  Sign in →
                </Link>
              </p>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center mb-10">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center text-[12px] font-mono transition-all duration-300 relative z-10 ${
                      step === s
                        ? "bg-orange border-orange text-white"
                        : step > s
                          ? "bg-green-500/15 border-green-500/40 text-green-500"
                          : "bg-surface border-border text-text-muted"
                    }`}
                  >
                    {step > s ? <Check size={14} /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-15 md:w-25 h-px transition-colors duration-300 ${
                        step > s ? "bg-green-500/40" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between mb-8 mt-2 px-1">
              {["Your Info", "Restaurant", "Confirm"].map((label, i) => (
                <span
                  key={label}
                  className={`text-[11px] font-mono uppercase tracking-wider transition-colors ${
                    step === i + 1 ? "text-orange" : "text-text-muted"
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* STEP 1: Account Info */}
                <div
                  className={step === 1 ? "block animate-in fade-in" : "hidden"}
                >
                  <div className="mb-5 pb-3 border-b border-border text-[13px] font-semibold tracking-[2px] uppercase text-text-dim font-mono">
                    Your Account
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={
                        form.control as unknown as Control<SignupFormValues>
                      }
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[12px] font-semibold tracking-[1px] uppercase text-text-muted font-mono">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John"
                              {...field}
                              className="bg-surface border-border focus:border-orange/50 h-11 rounded-[10px]"
                            />
                          </FormControl>
                          <FormMessage className="text-xs font-normal" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={
                        form.control as unknown as Control<SignupFormValues>
                      }
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[12px] font-semibold tracking-[1px] uppercase text-text-muted font-mono">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Doe"
                              {...field}
                              className="bg-surface border-border focus:border-orange/50 h-11 rounded-[10px]"
                            />
                          </FormControl>
                          <FormMessage className="text-xs font-normal" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={
                      form.control as unknown as Control<SignupFormValues>
                    }
                    name="email"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel className="text-[12px] font-semibold tracking-[1px] uppercase text-text-muted font-mono">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="you@restaurant.com"
                            {...field}
                            className="bg-surface border-border focus:border-orange/50 h-11 rounded-[10px]"
                          />
                        </FormControl>
                        <FormMessage className="text-xs font-normal" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={
                      form.control as unknown as Control<SignupFormValues>
                    }
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel className="text-[12px] font-semibold tracking-[1px] uppercase text-text-muted font-mono">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+234 800 000 0000"
                            {...field}
                            className="bg-surface border-border focus:border-orange/50 h-11 rounded-[10px]"
                          />
                        </FormControl>
                        <FormMessage className="text-xs font-normal" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={
                      form.control as unknown as Control<SignupFormValues>
                    }
                    name="password"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel className="text-[12px] font-semibold tracking-[1px] uppercase text-text-muted font-mono">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Min. 8 characters"
                              {...field}
                              className="bg-surface border-border focus:border-orange/50 h-11 rounded-[10px] pr-10"
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
                        <FormDescription className="text-xs font-light mt-1.5">
                          Use a mix of letters, numbers, and symbols
                        </FormDescription>
                        <FormMessage className="text-xs font-normal" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={
                      form.control as unknown as Control<SignupFormValues>
                    }
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel className="text-[12px] font-semibold tracking-[1px] uppercase text-text-muted font-mono">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Repeat your password"
                              {...field}
                              className="bg-surface border-border focus:border-orange/50 h-11 rounded-[10px] pr-10"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute -translate-y-1/2 right-3 top-1/2 text-text-muted hover:text-white"
                            >
                              {showConfirmPassword ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs font-normal" />
                      </FormItem>
                    )}
                  />

                  <div className="mt-8">
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="w-full h-13.5 text-[15px] font-bold tracking-[0.5px] bg-orange hover:bg-[#e86a1e] rounded-[10px] flex items-center justify-center gap-2"
                    >
                      Continue <ChevronRight size={18} />
                    </Button>
                  </div>
                </div>

                {/* STEP 2: Restaurant Info */}
                <div
                  className={step === 2 ? "block animate-in fade-in" : "hidden"}
                >
                  <div className="mb-5 pb-3 border-b border-border text-[13px] font-semibold tracking-[2px] uppercase text-text-dim font-mono">
                    Your Restaurant
                  </div>

                  <FormField
                    control={
                      form.control as unknown as Control<SignupFormValues>
                    }
                    name="restaurantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[12px] font-semibold tracking-[1px] uppercase text-text-muted font-mono">
                          Restaurant Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Mama Titi's Kitchen"
                            {...field}
                            className="bg-surface border-border focus:border-orange/50 h-11 rounded-[10px]"
                          />
                        </FormControl>
                        <FormMessage className="text-xs font-normal" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={
                      form.control as unknown as Control<SignupFormValues>
                    }
                    name="cuisineType"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel className="text-[12px] font-semibold tracking-[1px] uppercase text-text-muted font-mono">
                          Cuisine Type
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-surface border-border focus:border-orange/50 h-11 rounded-[10px]">
                              <SelectValue placeholder="Select cuisine type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-surface border-border text-text">
                            {[
                              "Nigerian",
                              "Continental",
                              "Chinese",
                              "Italian",
                              "Burgers & Fast Food",
                              "Pizza",
                              "Seafood",
                              "Grills & BBQ",
                              "Healthy & Salads",
                              "Bakery & Desserts",
                              "Other",
                            ].map((type) => (
                              <SelectItem key={type} value={type.toLowerCase()}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs font-normal" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={
                      form.control as unknown as Control<SignupFormValues>
                    }
                    name="restaurantAddress"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel className="text-[12px] font-semibold tracking-[1px] uppercase text-text-muted font-mono">
                          Restaurant Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Full address including area"
                            {...field}
                            className="bg-surface border-border focus:border-orange/50 h-11 rounded-[10px]"
                          />
                        </FormControl>
                        <FormMessage className="text-xs font-normal" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={
                        form.control as unknown as Control<SignupFormValues>
                      }
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[12px] font-semibold tracking-[1px] uppercase text-text-muted font-mono">
                            City
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-surface border-border focus:border-orange/50 h-11 rounded-[10px]">
                                <SelectValue placeholder="Select City" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-surface border-border text-text">
                              {[
                                "Lagos",
                                "Abuja",
                                "Port Harcourt",
                                "Ibadan",
                                "Kano",
                              ].map((city) => (
                                <SelectItem
                                  key={city}
                                  value={city.toLowerCase()}
                                >
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs font-normal" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={
                        form.control as unknown as Control<SignupFormValues>
                      }
                      name="deliveryFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[12px] font-semibold tracking-[1px] uppercase text-text-muted font-mono">
                            Delivery Fee (₦)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g. 500"
                              {...field}
                              className="bg-surface border-border focus:border-orange/50 h-11 rounded-[10px]"
                            />
                          </FormControl>
                          <FormMessage className="text-xs font-normal" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={
                        form.control as unknown as Control<SignupFormValues>
                      }
                      name="openingTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[12px] font-semibold tracking-[1px] uppercase text-text-muted font-mono">
                            Opening Time
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                              className="bg-surface border-border focus:border-orange/50 h-11 rounded-[10px]"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={
                        form.control as unknown as Control<SignupFormValues>
                      }
                      name="closingTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[12px] font-semibold tracking-[1px] uppercase text-text-muted font-mono">
                            Closing Time
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                              className="bg-surface border-border focus:border-orange/50 h-11 rounded-[10px]"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={
                      form.control as unknown as Control<SignupFormValues>
                    }
                    name="description"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel className="text-[12px] font-semibold tracking-[1px] uppercase text-text-muted font-mono">
                          Short Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell customers what makes your food special..."
                            {...field}
                            className="bg-surface border-border focus:border-orange/50 rounded-[10px] min-h-20"
                          />
                        </FormControl>
                        <FormDescription className="text-xs font-light mt-1.5">
                          Max 200 characters
                        </FormDescription>
                        <FormMessage className="text-xs font-normal" />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1 h-13.5 border-border bg-transparent hover:bg-white/5 hover:text-white rounded-[10px]"
                    >
                      ← Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex-2 h-13.5 text-[15px] font-bold tracking-[0.5px] bg-orange hover:bg-[#e86a1e] rounded-[10px] flex items-center justify-center gap-2"
                    >
                      Continue <ChevronRight size={18} />
                    </Button>
                  </div>
                </div>

                {/* STEP 3: Confirm */}
                <div
                  className={step === 3 ? "block animate-in fade-in" : "hidden"}
                >
                  <div className="mb-5 pb-3 border-b border-border text-[13px] font-semibold tracking-[2px] uppercase text-text-dim font-mono">
                    Review & Submit
                  </div>

                  {/* Summary */}
                  <div className="bg-surface border border-border rounded-xl p-6 mb-6">
                    <div className="mb-4 pb-4 border-b border-border">
                      <div className="text-[12px] text-text-muted font-mono mb-1">
                        ACCOUNT
                      </div>
                      <div className="text-[15px] font-medium text-white">
                        {getValues("firstName")} {getValues("lastName")}
                      </div>
                      <div className="text-[14px] text-text-muted">
                        {getValues("email")}
                      </div>
                    </div>
                    <div>
                      <div className="text-[12px] text-text-muted font-mono mb-1">
                        RESTAURANT
                      </div>
                      <div className="text-[15px] font-medium text-white">
                        {getValues("restaurantName")}
                      </div>
                      <div className="text-[14px] text-text-muted">
                        {getValues("restaurantAddress")}, {getValues("city")}
                      </div>
                    </div>
                  </div>

                  {/* What happens next */}
                  <div className="bg-orange/5 border border-orange/15 rounded-xl p-5 mb-6">
                    <div className="text-[12px] text-orange font-mono tracking-[1px] mb-3">
                      WHAT HAPPENS NEXT
                    </div>
                    <div className="flex flex-col gap-2">
                      {[
                        "We review your application (within 24 hours)",
                        "You receive an email with your dashboard access",
                        "Upload your full menu and go live",
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="text-[13px] text-text-muted flex gap-2"
                        >
                          <span className="text-orange">{i + 1}.</span> {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <FormField
                    control={
                      form.control as unknown as Control<SignupFormValues>
                    }
                    name="agreeTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-6">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-border data-[state=checked]:bg-orange data-[state=checked]:border-orange mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-[13px] font-normal text-text-muted loading-relaxed cursor-pointer">
                            I agree to the{" "}
                            <Link
                              href="/terms"
                              className="text-orange hover:underline"
                            >
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                              href="/privacy"
                              className="text-orange hover:underline"
                            >
                              Privacy Policy
                            </Link>
                            . I confirm that all information provided is
                            accurate.
                          </FormLabel>
                          <FormMessage className="text-xs font-normal pt-1" />
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1 h-13.5 border-border bg-transparent hover:bg-white/5 hover:text-white rounded-[10px]"
                    >
                      ← Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-2 h-13.5 text-[15px] font-bold tracking-[0.5px] bg-orange hover:bg-[#e86a1e] rounded-[10px]"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
}
