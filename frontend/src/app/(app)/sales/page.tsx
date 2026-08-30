"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList, FileText, Receipt, Truck, Undo2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { quotations, salesOrders, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";

const links = [
  { href: "/sales/quotations", label: "Quotations", desc: "Price offers & validity", icon: FileText, count: quotations.length },
  { href: "/sales/orders", label: "Sales orders", desc: "Confirmed style programs", icon: ClipboardList, count: salesOrders.length },
  { href: "/sales/deliveries", label: "Delivery orders", desc: "Dispatch & DO tracking", icon: Truck, count: 4 },
  { href: "/sales/invoices", label: "Invoices", desc: "Commercial invoices & GST", icon: Receipt, count: 5 },
  { href: "/sales/returns", label: "Returns", desc: "Credit notes & RMA", icon: Undo2, count: 2 },
];

export default function SalesHubPage() {
  const { toast } = useToast();
  const openValue = salesOrders.filter((o) => o.status !== "Delivered").reduce((s, o) => s + o.value, 0);

  const kpis = [
    { id: "open", label: "Open order value", value: formatCurrency(openValue), tone: "info" as const },
    { id: "qt", label: "Active quotations", value: String(quotations.filter((q) => q.status !== "Accepted").length) },
    { id: "od", label: "Overdue", value: String(salesOrders.filter((o) => o.status === "Overdue").length), tone: "error" as const },
    { id: "del", label: "Delivered (open list)", value: String(salesOrders.filter((o) => o.status === "Delivered").length), tone: "success" as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales"
        description="From quotation to invoice for yarn, fabric, and garment programs."
        breadcrumbs={[{ label: "Commercial" }, { label: "Sales" }]}
        actions={
          <Button
            size="sm"
            onClick={() =>
              toast({ title: "New sales order", description: "SO draft wizard opened.", tone: "info" })
            }
          >
            Create SO
          </Button>
        }
      />

      <KpiGrid items={kpis} columns={4} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {links.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="zr-card group flex flex-col gap-3 p-5 transition-shadow hover:shadow-[var(--shadow-sm)]"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[var(--brand-lavender-soft)] text-[var(--brand-primary)]">
                <m.icon className="size-5" />
              </span>
              <Badge variant="outline">{m.count}</Badge>
            </div>
            <div>
              <p className="font-semibold group-hover:text-[var(--brand-primary)]">{m.label}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{m.desc}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--brand-primary)]">
              Open <ArrowRight className="size-3" />
            </span>
          </Link>
        ))}
      </div>

      <div className="zr-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="zr-label mb-0">Recent sales orders</p>
          <Link href="/sales/orders" className="text-xs text-[var(--brand-primary)] hover:underline">
            View all
          </Link>
        </div>
        <div className="space-y-2">
          {salesOrders.slice(0, 4).map((o) => (
            <Link
              key={o.id}
              href={`/sales/orders/${o.id}`}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] px-3 py-2.5 hover:bg-[var(--surface-muted)]"
            >
              <div>
                <p className="text-sm font-medium text-[var(--brand-primary)]">{o.id} · {o.product}</p>
                <p className="text-xs text-[var(--muted)]">
                  {o.customer} · {formatCurrency(o.value)}
                </p>
              </div>
              <Badge variant={statusTone(o.status)}>{o.status}</Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
