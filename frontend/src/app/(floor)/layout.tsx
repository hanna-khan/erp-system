"use client";

import Link from "next/link";
import { Factory } from "lucide-react";

export default function FloorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef3ff] via-[#f7f5fb] to-[#eaf7f4]">
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
              <Factory className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">Production Floor · MES</p>
              <p className="text-[11px] text-[var(--muted)]">Tablet-optimized · soft colors · large targets</p>
            </div>
          </div>
          <Link href="/dashboard" className="text-sm font-medium text-[var(--brand-primary)] hover:underline">
            Exit to ERP
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
