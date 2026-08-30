"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [sent, setSent] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-6 zr-soft-gradient">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-white p-8 shadow-[var(--shadow-md)]">
        <h1 className="text-2xl font-semibold">Reset password</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          We will email a secure reset link to your work account.
        </p>
        {sent ? (
          <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
            Reset link sent. Check your inbox (mock success state).
          </div>
        ) : (
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              toast({ title: "Email sent", description: "Password reset link queued.", tone: "success" });
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" defaultValue="imran@abctextiles.pk" required />
            </div>
            <Button type="submit" className="w-full">
              Send reset link
            </Button>
          </form>
        )}
        <Link href="/login" className="mt-6 block text-center text-sm text-[var(--brand-primary)] hover:underline">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
