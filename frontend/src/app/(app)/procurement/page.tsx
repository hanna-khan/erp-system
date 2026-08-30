"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid, StatPill } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { WorkflowStepper } from "@/components/shared/workflow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  purchaseOrders,
  requisitions,
  suppliers,
  statusTone,
  tshirtWorkflow,
} from "@/mock/data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  ClipboardCheck,
  Factory,
  FilePlus,
  MessagesSquare,
  PackageCheck,
  Plus,
} from "lucide-react";

const kpis = [
  { id: "open", label: "Open POs", value: String(purchaseOrders.filter((p) => p.status === "Open" || p.status === "Approved").length), tone: "info" as const },
  { id: "spend", label: "Open PO Value", value: formatCurrency(purchaseOrders.filter((p) => p.status !== "Received").reduce((s, p) => s + p.value, 0)), change: "MTD", trend: "up" as const },
  { id: "pr", label: "Pending Requisitions", value: String(requisitions.filter((r) => r.status === "Pending").length), tone: "warning" as const },
  { id: "sup", label: "Active Suppliers", value: String(suppliers.length), tone: "success" as const },
];

const modules = [
  { href: "/procurement/suppliers", label: "Suppliers", desc: "Ratings, lead times & quality scores", icon: Factory },
  { href: "/procurement/requisitions", label: "Requisitions", desc: "Department material requests", icon: FilePlus },
  { href: "/procurement/rfqs", label: "RFQs", desc: "Quote comparison & awards", icon: MessagesSquare },
  { href: "/procurement/orders", label: "Purchase Orders", desc: "Issue, track & receive POs", icon: ClipboardCheck },
  { href: "/procurement/receipts", label: "Goods Receipts", desc: "GRN against open POs", icon: PackageCheck },
];

export default function ProcurementHubPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Procurement"
        description="Source lawn fabric, print jobs, embroidery and hang tags with supplier scorecards and PO control."
        breadcrumbs={[{ label: "Supply Chain" }, { label: "Procurement" }]}
        badge="Textile sourcing"
        actions={
          <>
            <Button variant="outline" onClick={() => toast({ title: "RFQ draft created", description: "RFQ-5505 saved as draft.", tone: "info" })}>
              New RFQ
            </Button>
            <Button onClick={() => toast({ title: "Purchase order drafted", description: "PO-4405 opened for review.", tone: "success" })}>
              <Plus className="size-4" /> New PO
            </Button>
          </>
        }
      />

      <KpiGrid items={kpis} columns={4} />

      <WorkflowStepper
        title="Prism Kaftaan · sourcing chain"
        steps={tshirtWorkflow.slice(3, 7)}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {modules.map((m) => (
          <Link key={m.href} href={m.href} className="zr-card group p-4 transition-shadow hover:shadow-[var(--shadow-sm)]">
            <m.icon className="mb-3 size-5 text-[var(--brand-primary)]" />
            <p className="text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--brand-primary)]">{m.label}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">{m.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DataTable
            data={purchaseOrders as unknown as Record<string, unknown>[]}
            searchKeys={["id", "supplier", "item", "status"]}
            searchPlaceholder="Search purchase orders..."
            statusKey="status"
            rowHref={(row) => `/procurement/orders/${row.id}`}
            columns={[
              { key: "id", label: "PO #" },
              { key: "supplier", label: "Supplier" },
              { key: "item", label: "Item" },
              {
                key: "qty",
                label: "Qty",
                render: (row) => `${formatNumber(Number(row.qty))} ${String(row.unit)}`,
              },
              {
                key: "value",
                label: "Value",
                render: (row) => formatCurrency(Number(row.value)),
              },
              { key: "eta", label: "ETA" },
              { key: "status", label: "Status" },
            ]}
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Requisition queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {requisitions.map((r) => (
              <Link
                key={r.id}
                href="/procurement/requisitions"
                className="flex items-start justify-between gap-2 rounded-xl border border-[var(--border)] p-3 hover:bg-[var(--sidebar-hover)]"
              >
                <div>
                  <p className="text-sm font-medium">{r.id}</p>
                  <p className="text-xs text-[var(--muted)]">{r.item} · {formatNumber(r.qty)} {r.unit}</p>
                  <p className="mt-1 text-[11px] text-[var(--muted)]">{r.department} · {r.requester}</p>
                </div>
                <Badge variant={statusTone(r.status)}>{r.status}</Badge>
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <StatPill label="Preferred suppliers" value={suppliers.filter((s) => s.status === "Preferred").length} tone="success" />
              <StatPill label="Avg lead days" value={Math.round(suppliers.reduce((s, x) => s + x.leadDays, 0) / suppliers.length)} tone="info" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
