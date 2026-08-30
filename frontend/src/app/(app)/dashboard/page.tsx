"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  ArrowUpRight,
  Package,
  Scissors,
  Shirt,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/hooks/use-app";
import { getGreeting } from "@/lib/utils";
import {
  auditTrail,
  dashboardKpis,
  notifications,
  productionOrders,
  revenueTrend,
  salesOrders,
  statusTone,
} from "@/mock/data";

const periods = ["Today", "This week", "This month"] as const;

const heroMetrics = [
  {
    id: "rev",
    label: "Revenue",
    value: dashboardKpis.financial[0].value,
    change: dashboardKpis.financial[0].change,
    hint: "Month to date",
    icon: Wallet,
    tint: "from-[#eaf0ff] to-[#f5f7ff]",
    iconBg: "bg-[#5b7cfa]/15 text-[#5b7cfa]",
  },
  {
    id: "prod",
    label: "Production",
    value: dashboardKpis.production[0].value,
    change: dashboardKpis.production[2].value,
    hint: "Efficiency today",
    icon: Scissors,
    tint: "from-[#f3effb] to-[#faf8ff]",
    iconBg: "bg-[#b9a8ea]/25 text-[#7c6bb8]",
  },
  {
    id: "orders",
    label: "Open orders",
    value: dashboardKpis.sales[0].value,
    change: dashboardKpis.sales[4].value,
    hint: "Fulfillment rate",
    icon: Shirt,
    tint: "from-[#e8f6fc] to-[#f5fbfe]",
    iconBg: "bg-[#7eb8d8]/25 text-[#3d7a9a]",
  },
  {
    id: "stock",
    label: "Finished goods",
    value: dashboardKpis.inventory[2].value,
    change: `${dashboardKpis.inventory[3].value} low`,
    hint: "Stock value",
    icon: Package,
    tint: "from-[#e8f8f1] to-[#f5fcf8]",
    iconBg: "bg-emerald-100 text-emerald-700",
  },
];

export default function DashboardPage() {
  const { user, company, plant } = useApp();
  const [period, setPeriod] = useState<(typeof periods)[number]>("This month");
  const alerts = notifications.filter((n) => n.unread).slice(0, 4);
  const hotOrders = salesOrders.slice(0, 4);
  const activeProd = productionOrders.filter((p) => p.status === "In Progress").slice(0, 3);

  return (
    <div className="mx-auto max-w-[1400px] space-y-8">
      {/* Greeting — light, no heavy card */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-slate-400">{company.shortName} · {plant.name}</p>
          <h1 className="mt-1 text-[1.75rem] font-semibold tracking-tight text-slate-900">
            {getGreeting(user.name.split(" ")[0])}
          </h1>
          <p className="mt-1 max-w-lg text-sm text-slate-500">
            A calm view of Cocoon today — sales, stitching, and stock that need your eye.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-100">
            {periods.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  period === p
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <Button asChild size="sm" className="rounded-full px-4">
            <Link href="/workflows">
              <Sparkles className="size-3.5" /> Demo tour
            </Link>
          </Button>
        </div>
      </div>

      {/* 4 hero metrics — not 25 KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {heroMetrics.map((m) => (
          <div
            key={m.id}
            className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${m.tint} p-5 ring-1 ring-white/60`}
          >
            <div className="flex items-start justify-between">
              <div className={`flex size-10 items-center justify-center rounded-2xl ${m.iconBg}`}>
                <m.icon className="size-5" />
              </div>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                <ArrowUpRight className="size-3" />
                {m.change}
              </span>
            </div>
            <p className="mt-5 text-xs font-medium uppercase tracking-wider text-slate-500">
              {m.label}
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{m.value}</p>
            <p className="mt-1 text-xs text-slate-400">{m.hint}</p>
          </div>
        ))}
      </div>

      {/* Main chart + focus panel */}
      <div className="grid gap-5 xl:grid-cols-5">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 xl:col-span-3">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Revenue</h2>
              <p className="mt-0.5 text-sm text-slate-400">PKR millions · last 6 months</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              <TrendingUp className="size-3.5 text-[#5b7cfa]" />
              +12.1%
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="dashRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5b7cfa" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#5b7cfa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#eef1f6" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 16,
                    border: "none",
                    boxShadow: "0 12px 40px rgba(15,23,42,0.08)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#5b7cfa"
                  fill="url(#dashRev)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-5 xl:col-span-2">
          {/* Spotlight card */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white">
            <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-[#5b7cfa]/30 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 left-10 size-32 rounded-full bg-[#b9a8ea]/25 blur-2xl" />
            <p className="text-xs font-medium uppercase tracking-wider text-white/50">Focus order</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight">Prism Kaftaan</h3>
            <p className="mt-1 text-sm text-white/60">SO-1024 · 10,000 pcs · Boutique Collective</p>
            <div className="mt-5">
              <div className="mb-1.5 flex justify-between text-xs text-white/60">
                <span>Production</span>
                <span>42%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-[#5b7cfa] to-[#b9a8ea]" />
              </div>
            </div>
            <Button
              asChild
              size="sm"
              className="mt-5 rounded-full bg-white text-slate-900 hover:bg-white/90"
            >
              <Link href="/sales/orders/SO-1024">
                Open order <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>

          {/* Active production */}
          <div className="flex-1 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">On the floor</h2>
              <Link href="/production" className="text-xs font-medium text-[#5b7cfa] hover:underline">
                All
              </Link>
            </div>
            <div className="space-y-3">
              {activeProd.map((p) => {
                const pct = Math.round((p.completed / p.qty) * 100);
                return (
                  <Link
                    key={p.id}
                    href={`/production/orders/${p.id}`}
                    className="block rounded-2xl bg-slate-50 p-3 transition-colors hover:bg-[var(--brand-primary-soft)]/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-slate-800">{p.product}</p>
                      <span className="text-xs font-semibold text-[#5b7cfa]">{pct}%</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {p.id} · {p.completed.toLocaleString()} / {p.qty.toLocaleString()}
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-[#5b7cfa]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: alerts + orders + activity — 3 calm columns */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Needs attention</h2>
            <Link href="/notifications" className="text-xs font-medium text-[#5b7cfa] hover:underline">
              All
            </Link>
          </div>
          <div className="space-y-1">
            {alerts.map((n) => (
              <div
                key={n.id}
                className="rounded-2xl px-3 py-3 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-start gap-2.5">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#5b7cfa]" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800">{n.title}</p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">{n.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Recent orders</h2>
            <Link href="/sales/orders" className="text-xs font-medium text-[#5b7cfa] hover:underline">
              All
            </Link>
          </div>
          <div className="space-y-2">
            {hotOrders.map((o) => (
              <Link
                key={o.id}
                href={`/sales/orders/${o.id}`}
                className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{o.product}</p>
                  <p className="text-[11px] text-slate-400">
                    {o.id} · {o.customer}
                  </p>
                </div>
                <Badge variant={statusTone(o.status)} className="shrink-0 rounded-full">
                  {o.status}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Activity</h2>
            <Link href="/admin/audit" className="text-xs font-medium text-[#5b7cfa] hover:underline">
              Log
            </Link>
          </div>
          <div className="relative space-y-4 pl-3">
            <div className="absolute bottom-1 left-[7px] top-1 w-px bg-slate-100" />
            {auditTrail.slice(0, 5).map((event) => (
              <div key={event.id} className="relative pl-5">
                <span className="absolute left-0 top-1.5 size-2 rounded-full bg-[#b9a8ea] ring-4 ring-white" />
                <p className="text-sm font-medium text-slate-800">{event.action}</p>
                <p className="text-[11px] text-slate-400">
                  {event.user} · {event.timestamp}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
