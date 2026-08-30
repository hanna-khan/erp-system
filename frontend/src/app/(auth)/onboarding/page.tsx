"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const steps = ["Company", "Plants", "Modules", "Users", "Go live"];

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [modules, setModules] = useState<string[]>([
    "Sales",
    "Inventory",
    "Production",
    "Quality",
    "Finance",
  ]);

  const toggle = (m: string) =>
    setModules((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));

  return (
    <div className="min-h-screen zr-soft-gradient px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6b8cff] to-[#b8a9e8] font-bold text-white">
            Z
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">Company setup</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Configure your textile tenant in minutes.</p>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {steps.map((label, i) => (
            <div
              key={label}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                i === step && "bg-[var(--brand-primary)] text-white",
                i < step && "bg-emerald-100 text-emerald-700",
                i > step && "bg-white text-slate-400 border border-[var(--border)]",
              )}
            >
              {i + 1}. {label}
            </div>
          ))}
        </div>

        <div className="zr-card p-6 sm:p-8">
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Company name</Label>
                <Input defaultValue="Cocoon Clothing" />
              </div>
              <div className="space-y-2">
                <Label>NTN</Label>
                <Input defaultValue="1234567-8" />
              </div>
              <div className="space-y-2">
                <Label>STRN</Label>
                <Input defaultValue="3277876123456" />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Input defaultValue="PKR" />
              </div>
              <div className="space-y-2">
                <Label>Fiscal year</Label>
                <Input defaultValue="July – June" />
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-3">
              {["SITE Karachi Plant — Garments / RTW", "Karachi FG Warehouse — Finished Goods", "Online Fulfillment Hub — E-commerce"].map(
                (p) => (
                  <label key={p} className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-4">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm font-medium">{p}</span>
                  </label>
                ),
              )}
            </div>
          )}
          {step === 2 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "CRM",
                "Sales",
                "PLM",
                "Procurement",
                "Inventory",
                "Warehouse",
                "Production",
                "Planning & MRP",
                "Quality",
                "Costing",
                "Machines",
                "Maintenance",
                "Dispatch",
                "Finance",
                "HR & Payroll",
                "AI Assistant",
              ].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggle(m)}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                    modules.includes(m)
                      ? "border-[var(--brand-primary)] bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]"
                      : "border-[var(--border)] bg-white",
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3 text-sm">
              <p className="text-[var(--muted)]">Invite your leadership team (mock).</p>
              {["CEO (Salman Sabir)", "Senior Manager (Nargis Imran)", "Sales Manager", "Accountant"].map((role) => (
                <div key={role} className="grid gap-2 rounded-xl border border-[var(--border)] p-3 sm:grid-cols-3">
                  <Input placeholder={`${role} name`} />
                  <Input placeholder="email@company.pk" />
                  <Input value={role} readOnly />
                </div>
              ))}
            </div>
          )}
          {step === 4 && (
            <div className="space-y-4 text-center">
              <p className="text-lg font-semibold">You are ready to go live</p>
              <p className="text-sm text-[var(--muted)]">
                Demo tenant Cocoon Clothing (cocoon.pk) will open with sample ready-to-wear data across all enabled modules.
              </p>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
            <Button
              onClick={() => {
                if (step < steps.length - 1) setStep((s) => s + 1);
                else {
                  toast({ title: "Tenant ready", description: "Welcome to Zendrock ERP.", tone: "success" });
                  router.push("/dashboard");
                }
              }}
            >
              {step === steps.length - 1 ? "Enter dashboard" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
