"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  restaurantName: z.string().min(2, "Restaurant name is required"),
  restaurantAddress: z.string().min(10, "Please enter the full address"),
  deliveryFee: z.number().min(0, "Delivery fee must be 0 or more"),
  openingTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time"),
  closingTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time"),
  description: z.string().max(500).optional(),
  agreeTerms: z.boolean().refine((val) => val === true, "You must agree to the terms"),
});

type FormData = z.infer<typeof formSchema>;

const steps = [
  { number: 1, label: "Account" },
  { number: 2, label: "Restaurant" },
  { number: 3, label: "Review" },
];

const stepFields: Record<number, (keyof FormData)[]> = {
  1: ["firstName", "lastName", "email", "phone", "password"],
  2: ["restaurantName", "restaurantAddress", "deliveryFee", "openingTime", "closingTime"],
  3: ["agreeTerms"],
};

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
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

  const values = form.watch();

  async function handleContinue() {
    const fields = stepFields[step];
    const valid = await form.trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, 3));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/vendor/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        toast.success("Account created! Please sign in.");
        router.push("/login");
      } else {
        setIsSuccess(true);
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm text-center"
      >
        <div className="bg-card border border-border/50 rounded-2xl p-10 shadow-sm">
          <div className="size-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
            <svg className="size-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Account created!</h2>
          <p className="text-sm text-muted-foreground">
            Redirecting to your dashboard...
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="auth-card w-full max-w-sm">
      <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="mb-6">
            <img src="/logo.png" alt="DFOOD" className="h-12 w-auto" />
          </Link>

          <div className="flex items-center gap-0 w-full max-w-[240px] mb-6">
            {steps.map((s, i) => (
              <div key={s.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`size-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                      s.number < step
                        ? "bg-primary text-primary-foreground"
                        : s.number === step
                          ? "border-2 border-primary text-primary"
                          : "border-2 border-border text-muted-foreground"
                    }`}
                  >
                    {s.number < step ? (
                      <Check className="size-3.5" />
                    ) : (
                      s.number
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-medium leading-none ${
                      s.number <= step ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-2 mt-[-18px] ${
                      s.number < step ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight text-foreground text-balance">
              {step === 1 && "Create your account"}
              {step === 2 && "Restaurant details"}
              {step === 3 && "Review & submit"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground text-balance">
              {step === 1 && "Already registered? "}
              {step === 1 && (
                <Link href="/login" className="focus-ring font-semibold text-primary hover:underline">
                  Sign in
                </Link>
              )}
              {step === 2 && "Tell us about your restaurant"}
              {step === 3 && "Check everything looks right"}
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@restaurant.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+234 800 000 0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Min. 8 characters"
                              {...field}
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              tabIndex={-1}
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="restaurantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restaurant name</FormLabel>
                        <FormControl>
                          <Input placeholder="Chow Cafe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="restaurantAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Street, City, State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-3">
                    <FormField
                      control={form.control}
                      name="deliveryFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fee (₦)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="openingTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Opens</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="closingTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Closes</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Description{" "}
                          <span className="text-muted-foreground/60">(optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A brief description of your restaurant..."
                            rows={3}
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Account
                    </h3>
                    <div className="space-y-1.5 text-sm">
                      <p className="text-foreground">
                        {values.firstName} {values.lastName}
                      </p>
                      <p className="text-muted-foreground">{values.email}</p>
                      <p className="text-muted-foreground">{values.phone}</p>
                    </div>
                  </div>

                  <hr className="border-border/50" />

                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Restaurant
                    </h3>
                    <div className="space-y-1.5 text-sm">
                      <p className="text-foreground">{values.restaurantName}</p>
                      <p className="text-muted-foreground">{values.restaurantAddress}</p>
                      <p className="text-muted-foreground">
                        ₦{values.deliveryFee} fee &middot; {values.openingTime} &ndash;{" "}
                        {values.closingTime}
                      </p>
                      {values.description && (
                        <p className="text-muted-foreground text-xs leading-relaxed mt-2">
                          {values.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="agreeTerms"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-start gap-2.5">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-xs text-muted-foreground leading-relaxed font-normal cursor-pointer">
                            I agree to the{" "}
                            <Link href="/terms" className="font-medium text-primary hover:underline">
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="font-medium text-primary hover:underline">
                              Privacy Policy
                            </Link>
                          </FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6">
              {step === 1 ? (
                <Button
                  type="button"
                  onClick={handleContinue}
                  className="w-full"
                >
                  Continue
                </Button>
              ) : (
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={loading}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  {step === 2 ? (
                    <Button
                      type="button"
                      onClick={handleContinue}
                      className="flex-1"
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1"
                    >
                      {loading ? <Loader2 className="size-4 animate-spin" /> : "Create account"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </form>
        </Form>
      </div>

      <div className="mt-6 flex flex-col items-center gap-2">
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
