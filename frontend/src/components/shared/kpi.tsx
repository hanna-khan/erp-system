"use client";

import { cn, formatNumber } from "@/lib/utils";
import type { KpiCard as KpiCardType } from "@/types";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

export function KpiCard({ kpi }: { kpi: KpiCardType }) {
  const TrendIcon =
    kpi.trend === "up" ? ArrowUpRight : kpi.trend === "down" ? ArrowDownRight : Minus;

  return (
    <div className="zr-card p-4 transition-shadow hover:shadow-[var(--shadow-sm)]">
      <p className="zr-label">{kpi.label}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          {kpi.value}
        </p>
        {kpi.change ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold",
              kpi.trend === "up" && "bg-emerald-50 text-emerald-600",
              kpi.trend === "down" && "bg-rose-50 text-rose-600",
              (!kpi.trend || kpi.trend === "neutral") && "bg-slate-50 text-slate-500",
            )}
          >
            <TrendIcon className="size-3" />
            {kpi.change}
          </span>
        ) : null}
      </div>
      {kpi.hint ? <p className="mt-1 text-xs text-[var(--muted)]">{kpi.hint}</p> : null}
    </div>
  );
}

export function KpiGrid({ items, columns = 3 }: { items: KpiCardType[]; columns?: 2 | 3 | 4 | 5 | 6 }) {
  const colClass =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 4
        ? "sm:grid-cols-2 xl:grid-cols-4"
        : columns === 5
          ? "sm:grid-cols-2 xl:grid-cols-5"
          : columns === 6
            ? "sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6"
            : "sm:grid-cols-2 xl:grid-cols-3";

  return (
    <div className={cn("grid gap-3", colClass)}>
      {items.map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
}

export function StatPill({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string | number;
  tone?: "default" | "success" | "warning" | "error" | "info";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2",
        tone === "success" && "border-emerald-100 bg-emerald-50/60",
        tone === "warning" && "border-amber-100 bg-amber-50/60",
        tone === "error" && "border-rose-100 bg-rose-50/60",
        tone === "info" && "border-sky-100 bg-sky-50/60",
        tone === "default" && "border-[var(--border)] bg-[var(--surface)]",
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold text-[var(--foreground)]">
        {typeof value === "number" ? formatNumber(value) : value}
      </p>
    </div>
  );
}
