"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useApp } from "@/hooks/use-app";
import { Sidebar } from "@/components/navigation/sidebar";
import { TopBar, MobileSidebarOverlay } from "@/components/navigation/top-bar";
import Link from "next/link";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, company } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen zr-soft-gradient">
      <Sidebar />
      <MobileSidebarOverlay open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-200",
          sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-64",
        )}
      >
        <div className="border-b border-violet-100 bg-gradient-to-r from-[#e8efff] via-[#f3effb] to-[#e8f6fc] px-4 py-2 text-center text-xs text-slate-600 lg:px-6">
          <span className="font-medium">{company.shortName}</span> is on{" "}
          <span className="font-semibold text-violet-700">Enterprise trial</span> ·{" "}
          <Link href="/settings" className="text-[var(--brand-primary)] hover:underline">
            Manage subscription
          </Link>
        </div>
        <TopBar onMobileMenuToggle={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 lg:px-6">{children}</main>
      </div>
    </div>
  );
}
