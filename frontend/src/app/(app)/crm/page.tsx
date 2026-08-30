"use client";

import Link from "next/link";
import { Building2, Phone, Target, UserPlus, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid, StatPill } from "@/components/shared/kpi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { customers, leads, opportunities, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";

const modules = [
  { href: "/crm/leads", label: "Leads", desc: "Qualify inbound textile buyers", icon: UserPlus, count: leads.length },
  { href: "/crm/opportunities", label: "Opportunities", desc: "Pipeline by stage & close date", icon: Target, count: opportunities.length },
  { href: "/crm/customers", label: "Customers", desc: "Domestic & export accounts", icon: Building2, count: customers.length },
  { href: "/crm/activities", label: "Activities", desc: "Calls, meetings & follow-ups", icon: Phone, count: 6 },
];

export default function CrmHubPage() {
  const { toast } = useToast();
  const pipelineValue = opportunities.reduce((s, o) => s + o.revenue, 0);
  const outstanding = customers.reduce((s, c) => s + c.outstanding, 0);

  const kpis = [
    { id: "leads", label: "Open leads", value: String(leads.length), change: "+2 this week", trend: "up" as const },
    { id: "opp", label: "Pipeline value", value: formatCurrency(pipelineValue), change: "3 deals", trend: "up" as const, tone: "info" as const },
    { id: "cust", label: "Active customers", value: String(customers.filter((c) => c.status === "Active").length), tone: "success" as const },
    { id: "ar", label: "AR outstanding", value: formatCurrency(outstanding), tone: "warning" as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="CRM"
        description="Manage textile buyers from lead to repeat order across domestic and export channels."
        breadcrumbs={[{ label: "Commercial" }, { label: "CRM" }]}
        actions={
          <Button
            size="sm"
            onClick={() =>
              toast({ title: "Lead form opened", description: "Create a new lead from exhibition or referral.", tone: "info" })
            }
          >
            <UserPlus className="size-3.5" /> New lead
          </Button>
        }
      />

      <KpiGrid items={kpis} columns={4} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="zr-card group flex flex-col gap-3 p-5 transition-shadow hover:shadow-[var(--shadow-sm)]"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
                <m.icon className="size-5" />
              </span>
              <Badge variant="outline">{m.count}</Badge>
            </div>
            <div>
              <p className="font-semibold text-[var(--foreground)] group-hover:text-[var(--brand-primary)]">{m.label}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{m.desc}</p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-[var(--brand-primary)]">
              Open <ArrowRight className="size-3" />
            </span>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="zr-card p-5">
          <p className="zr-label mb-3">Top opportunities</p>
          <div className="space-y-3">
            {opportunities.map((o) => (
              <div key={o.id} className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] px-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{o.name}</p>
                  <p className="text-xs text-[var(--muted)]">{o.customer} · {formatCurrency(o.revenue)}</p>
                </div>
                <Badge variant={statusTone(o.stage)}>{o.stage}</Badge>
              </div>
            ))}
          </div>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/crm/opportunities">Pipeline board</Link>
          </Button>
        </div>
        <div className="zr-card p-5">
          <p className="zr-label mb-3">Customer health</p>
          <div className="mb-4 grid grid-cols-2 gap-2">
            <StatPill label="Export accounts" value={customers.filter((c) => c.type === "Export").length} tone="info" />
            <StatPill label="On hold" value={customers.filter((c) => c.status === "On Hold").length} tone="warning" />
          </div>
          <div className="space-y-2">
            {customers.slice(0, 4).map((c) => (
              <Link
                key={c.id}
                href={`/crm/customers/${c.id}`}
                className="flex items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-[var(--surface-muted)]"
              >
                <span className="font-medium text-[var(--brand-primary)]">{c.name}</span>
                <span className="text-xs text-[var(--muted)]">{formatCurrency(c.outstanding)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
