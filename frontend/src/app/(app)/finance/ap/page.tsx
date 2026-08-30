"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

const bills = [
  { id: "BILL-3301", supplier: "Cotton Supplier A", po: "PO-4401", date: "2026-08-25", due: "2026-09-24", amount: 18500000, paid: 0, status: "Open" },
  { id: "BILL-3302", supplier: "Chemical Supplier C", po: "PO-4402", date: "2026-08-20", due: "2026-09-04", amount: 3600000, paid: 1800000, status: "Partial" },
  { id: "BILL-3303", supplier: "Yarn Supplier B", po: "PO-4403", date: "2026-08-10", due: "2026-08-25", amount: 9300000, paid: 9300000, status: "Paid" },
  { id: "BILL-3304", supplier: "Accessories Hub", po: "PO-4404", date: "2026-08-29", due: "2026-09-28", amount: 875000, paid: 0, status: "Pending Approval" },
];

type BillRow = (typeof bills)[number] & Record<string, unknown>;

const columns: Column<BillRow>[] = [
  { key: "id", label: "Bill" },
  { key: "supplier", label: "Supplier" },
  {
    key: "po",
    label: "PO",
    render: (r) => (
      <Link href={`/procurement/orders/${r.po}`} className="text-[var(--brand-primary)] hover:underline">
        {r.po}
      </Link>
    ),
  },
  { key: "due", label: "Due" },
  { key: "amount", label: "Amount", render: (r) => formatCurrency(r.amount) },
  { key: "paid", label: "Paid", render: (r) => formatCurrency(r.paid) },
  {
    key: "status",
    label: "Status",
    render: (r) => <Badge variant={statusTone(r.status)}>{r.status}</Badge>,
  },
];

export default function ApPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState(bills as BillRow[]);
  const payable = rows.reduce((s, r) => s + (r.amount - r.paid), 0);

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Accounts Payable"
        description="Supplier bills, payment runs and aging."
        breadcrumbs={[
          { label: "Finance", href: "/finance" },
          { label: "AP" },
        ]}
        actions={
          <Button
            onClick={() => {
              setRows((prev) =>
                prev.map((r) =>
                  r.id === "BILL-3304" ? { ...r, status: "Open" } : r,
                ),
              );
              toast({ title: "Bill approved", description: "BILL-3304 released for payment.", tone: "success" });
            }}
          >
            Approve selected
          </Button>
        }
      />

      <KpiGrid
        items={[
          { id: "pay", label: "Payables", value: formatCurrency(payable), tone: "warning" },
          { id: "due7", label: "Due in 7 days", value: "PKR 1.8M", tone: "error" },
          { id: "paid", label: "Paid MTD", value: "PKR 12.1M", tone: "success" },
          { id: "vendors", label: "Open Vendors", value: "3", tone: "info" },
        ]}
        columns={4}
      />

      <DataTable
        data={rows}
        columns={columns}
        searchKeys={["id", "supplier", "po", "status"]}
        searchPlaceholder="Search AP bills..."
      />
    </div>
  );
}
