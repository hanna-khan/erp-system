"use client";

import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { tenants, statusTone } from "@/mock/data";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const invoices = tenants.map((t, i) => ({
  id: "INV-SA-" + (8800 + i),
  tenant: t.name,
  amount: t.mrr || 45000,
  status: t.status === "Past Due" ? "Overdue" : t.trial ? "Trial" : "Paid",
  period: "Aug 2026",
}));

type Row = (typeof invoices)[number] & Record<string, unknown>;

const columns: Column<Row>[] = [
  { key: "id", label: "Invoice" },
  { key: "tenant", label: "Tenant" },
  { key: "period", label: "Period" },
  { key: "amount", label: "Amount", render: (r) => formatCurrency(r.amount) },
  { key: "status", label: "Status", render: (r) => <Badge variant={statusTone(r.status)}>{r.status}</Badge> },
];

export default function BillingPage() {
  const { toast } = useToast();
  const mrr = tenants.reduce((s, t) => s + t.mrr, 0);
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Billing"
        description="Platform invoices and recurring revenue."
        breadcrumbs={[{ label: "Super Admin", href: "/super-admin" }, { label: "Billing" }]}
        actions={<Button onClick={() => toast({ title: "Dunning run", description: "Past-due reminders queued.", tone: "info" })}>Run dunning</Button>}
      />
      <KpiGrid columns={3} items={[
        { id: "mrr", label: "MRR", value: formatCurrency(mrr), tone: "success" },
        { id: "arr", label: "ARR", value: formatCurrency(mrr * 12), tone: "info" },
        { id: "od", label: "Overdue invoices", value: String(invoices.filter((i) => i.status === "Overdue").length), tone: "error" },
      ]} />
      <DataTable data={invoices as Row[]} columns={columns} searchKeys={["id", "tenant", "status"]} searchPlaceholder="Search invoices..." />
    </div>
  );
}
