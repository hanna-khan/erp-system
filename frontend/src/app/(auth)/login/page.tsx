"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("salman@cocoon.pk");
  const [password, setPassword] = useState("demo1234");
  const [show, setShow] = useState(false);
  const [mfa, setMfa] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    if (!mfa) {
      setMfa(true);
      toast({ title: "MFA required", description: "Enter the 6-digit code sent to your device.", tone: "info" });
      return;
    }
    if (otp.length < 6) {
      toast({ title: "Invalid code", description: "Please enter a valid OTP.", tone: "error" });
      return;
    }
    toast({ title: "Welcome back", description: "Signed in to Cocoon Clothing.", tone: "success" });
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-[48%] overflow-hidden bg-gradient-to-br from-[#6b8cff] via-[#8b7fd6] to-[#a8d4f0] lg:block">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 0, transparent 40%), radial-gradient(circle at 80% 60%, white 0, transparent 35%)" }} />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-white/20 text-xl font-bold backdrop-blur">Z</div>
            <h1 className="mt-8 text-4xl font-semibold tracking-tight">Zendrock ERP</h1>
            <p className="mt-3 max-w-md text-white/85">
              The textile manufacturing platform connecting orders, production, quality, warehouse and finance in one premium workspace.
            </p>
          </div>
          <div className="space-y-3 text-sm text-white/80">
            <p>✓ Configurable spinning, weaving, dyeing & garment processes</p>
            <p>✓ MRP, MES floor, batch traceability & costing</p>
            <p>✓ Built for Pakistani textile mills — PKR, NTN, STRN ready</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-[var(--background)] p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6b8cff] to-[#b8a9e8] font-bold text-white">Z</div>
            <h1 className="mt-4 text-2xl font-semibold">Zendrock ERP</h1>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">{mfa ? "Verify identity" : "Sign in"}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {mfa ? "Multi-factor authentication for your tenant." : "Access your textile operations workspace."}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {!mfa ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Work email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-xs text-[var(--brand-primary)] hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={show ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      onClick={() => setShow((v) => !v)}
                    >
                      {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="otp">Authentication code</Label>
                <Input
                  id="otp"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                />
                <p className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                  <ShieldCheck className="size-3.5 text-emerald-500" /> Demo: enter any 6 digits
                </p>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : mfa ? "Verify & continue" : "Continue"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            New tenant?{" "}
            <Link href="/onboarding" className="font-medium text-[var(--brand-primary)] hover:underline">
              Start company setup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
