"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Calendar,
  Factory,
  Package,
  ShoppingCart,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid, StatPill } from "@/components/shared/kpi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/hooks/use-app";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, getGreeting } from "@/lib/utils";
import {
  auditTrail,
  dashboardKpis,
  notifications,
  plants,
  revenueTrend,
  salesOrders,
  statusTone,
} from "@/mock/data";

const dateRanges = ["MTD", "QTD", "YTD", "Last 30 days"] as const;

export default function DashboardPage() {
  const { user, company, plant, setPlantId, fiscalYear } = useApp();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<(typeof dateRanges)[number]>("MTD");
  const [plantFilter, setPlantFilter] = useState(plant.id);

  const alerts = useMemo(
    () => notifications.filter((n) => n.unread || n.type === "alert"),
    [],
  );

  const overdueOrders = salesOrders.filter((o) => o.status === "Overdue");

  return (
    <div className="space-y-6">
      <PageHeader
        title={getGreeting(user.name.split(" ")[0])}
        description={`${company.shortName} · ${fiscalYear} · Executive operations overview`}
        badge="Live"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast({
                  title: "Report queued",
                  description: "Executive pack will be emailed shortly.",
                  tone: "info",
                })
              }
            >
              <Calendar className="size-3.5" /> Export pack
            </Button>
            <Button asChild size="sm">
              <Link href="/sales/orders/SO-1024">
                Open SO-1024 <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </>
        }
      />

      <div className="zr-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="zr-label">Period</span>
          {dateRanges.map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => {
                setDateRange(range);
                toast({ title: `Filtered to ${range}`, tone: "info" });
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                dateRange === range
                  ? "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]"
                  : "bg-[var(--surface-muted)] text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="zr-label">Plant</span>
          <select
            value={plantFilter}
            onChange={(e) => {
              setPlantFilter(e.target.value);
              setPlantId(e.target.value);
              toast({
                title: "Plant switched",
                description: plants.find((p) => p.id === e.target.value)?.name,
                tone: "success",
              });
            }}
            className="h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
          >
            {plants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">Financial</h2>
          <Link href="/finance" className="text-xs font-medium text-[var(--brand-primary)] hover:underline">
            View finance
          </Link>
        </div>
        <KpiGrid items={dashboardKpis.financial} columns={6} />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">Production</h2>
          <Link href="/production" className="text-xs font-medium text-[var(--brand-primary)] hover:underline">
            Production dashboard
          </Link>
        </div>
        <KpiGrid items={dashboardKpis.production} columns={6} />
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Machines</h2>
          <KpiGrid items={dashboardKpis.machines} columns={5} />
        </section>
        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Inventory</h2>
          <KpiGrid items={dashboardKpis.inventory} columns={5} />
        </section>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Sales fulfillment</h2>
          <Link href="/sales/orders" className="text-xs font-medium text-[var(--brand-primary)] hover:underline">
            All orders
          </Link>
        </div>
        <KpiGrid items={dashboardKpis.sales} columns={5} />
      </section>

      <div className="grid gap-4 xl:grid-cols-5">
        <div className="zr-card p-5 xl:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="zr-label">Revenue trend</p>
              <p className="mt-1 text-sm text-[var(--muted)]">PKR millions · {dateRange}</p>
            </div>
            <Badge variant="info">Area</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6b8cff" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6b8cff" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 8px 24px rgba(107,140,255,0.08)",
                  }}
                />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6b8cff" fill="url(#revFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="zr-card p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="zr-label">Production vs sales</p>
              <p className="mt-1 text-sm text-[var(--muted)]">Index · last 6 months</p>
            </div>
            <Badge variant="outline">Bar</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Bar dataKey="production" name="Production" fill="#b8a9e8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="sales" name="Sales" fill="#6b8cff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="zr-card p-5 lg:col-span-1">
          <div className="mb-4 flex items-center gap-2">
            <Bell className="size-4 text-[var(--brand-primary)]" />
            <p className="zr-label mb-0">Alerts & notifications</p>
          </div>
          <div className="space-y-3">
            {alerts.slice(0, 5).map((n) => (
              <div key={n.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{n.title}</p>
                  {n.unread ? <Badge variant="error">New</Badge> : null}
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">{n.body}</p>
                <p className="mt-2 text-[11px] text-[var(--muted-foreground)]">{n.time}</p>
              </div>
            ))}
          </div>
          <Button asChild variant="outline" size="sm" className="mt-4 w-full">
            <Link href="/notifications">View all notifications</Link>
          </Button>
        </div>

        <div className="zr-card p-5 lg:col-span-1">
          <div className="mb-4 flex items-center gap-2">
            <Package className="size-4 text-[var(--brand-primary)]" />
            <p className="zr-label mb-0">Quick links</p>
          </div>
          <div className="grid gap-2">
            {[
              { href: "/sales/orders/SO-1024", label: "SO-1024 T-Shirt workflow", icon: ShoppingCart },
              { href: "/production/orders/PRO-7001", label: "PRO-7001 Production", icon: Factory },
              { href: "/workflows", label: "End-to-end demo workflows", icon: ArrowRight },
              { href: "/planning/mrp", label: "MRP shortages", icon: AlertTriangle },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl border border-[var(--border)] px-3 py-3 text-sm font-medium transition-colors hover:bg-[var(--sidebar-hover)]"
              >
                <item.icon className="size-4 text-[var(--brand-primary)]" />
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <StatPill label="Overdue SOs" value={overdueOrders.length} tone="error" />
            <StatPill label="Open value" value={formatCurrency(salesOrders.filter((o) => o.status !== "Delivered").reduce((s, o) => s + o.value, 0))} tone="info" />
          </div>
        </div>

        <div className="zr-card p-5 lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="zr-label mb-0">Recent activity</p>
            <Link href="/admin/audit" className="text-xs text-[var(--brand-primary)] hover:underline">
              Audit log
            </Link>
          </div>
          <div className="space-y-4">
            {auditTrail.map((event) => (
              <div key={event.id} className="border-l-2 border-[var(--brand-primary-soft)] pl-3">
                <p className="text-sm font-medium">{event.action}</p>
                <p className="text-xs text-[var(--muted)]">
                  {event.user} · {event.timestamp}
                </p>
                {event.newValue ? (
                  <p className="mt-0.5 text-[11px] text-[var(--muted-foreground)]">→ {event.newValue}</p>
                ) : null}
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <p className="zr-label">Hot orders</p>
            {salesOrders.slice(0, 3).map((o) => (
              <Link
                key={o.id}
                href={`/sales/orders/${o.id}`}
                className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-[var(--surface-muted)]"
              >
                <span className="font-medium text-[var(--brand-primary)]">{o.id}</span>
                <Badge variant={statusTone(o.status)}>{o.status}</Badge>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
