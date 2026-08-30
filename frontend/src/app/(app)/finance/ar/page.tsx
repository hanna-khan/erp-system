"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { customers, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

const invoices = [
  { id: "INV-5501", customer: "UK Desi Wear Ltd", date: "2026-08-20", due: "2026-09-19", amount: 8700000, paid: 8700000, status: "Paid", so: "SO-1026" },
  { id: "INV-5502", customer: "Gulf Style Trading (UAE)", date: "2026-08-28", due: "2026-09-27", amount: 5040000, paid: 0, status: "Open", so: "SO-1025" },
  { id: "INV-5503", customer: "Boutique Collective PK", date: "2026-08-01", due: "2026-08-18", amount: 8450000, paid: 0, status: "Overdue", so: "SO-1024" },
  { id: "INV-5504", customer: "cocoon.pk Retail Customers", date: "2026-08-15", due: "2026-09-14", amount: 2100000, paid: 800000, status: "Partial", so: "SO-1027" },
];

type InvRow = (typeof invoices)[number] & Record<string, unknown>;

const columns: Column<InvRow>[] = [
  { key: "id", label: "Invoice" },
  {
    key: "customer",
    label: "Customer",
    render: (r) => {
      const c = customers.find((x) => x.name === r.customer);
      return c ? (
        <Link href={`/crm/customers/${c.id}`} className="text-[var(--brand-primary)] hover:underline">
          {r.customer}
        </Link>
      ) : (
        r.customer
      );
    },
  },
  { key: "date", label: "Invoice Date" },
  { key: "due", label: "Due" },
  { key: "amount", label: "Amount", render: (r) => formatCurrency(r.amount) },
  { key: "paid", label: "Paid", render: (r) => formatCurrency(r.paid) },
  {
    key: "status",
    label: "Status",
    render: (r) => <Badge variant={statusTone(r.status)}>{r.status}</Badge>,
  },
];

export default function ArPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState(invoices as InvRow[]);
  const outstanding = rows.reduce((s, r) => s + (r.amount - r.paid), 0);

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Accounts Receivable"
        description="Customer invoices, collections and aging."
        breadcrumbs={[
          { label: "Finance", href: "/finance" },
          { label: "AR" },
        ]}
        actions={
          <Button
            onClick={() => {
              setRows((prev) =>
                prev.map((r) =>
                  r.id === "INV-5503" ? { ...r, paid: r.amount, status: "Paid" } : r,
                ),
              );
              toast({ title: "Receipt posted", description: "INV-5503 marked paid.", tone: "success" });
            }}
          >
            Record receipt
          </Button>
        }
      />

      <KpiGrid
        items={[
          { id: "out", label: "Outstanding", value: formatCurrency(outstanding), tone: "warning" },
          { id: "over", label: "Overdue", value: formatCurrency(rows.filter((r) => r.status === "Overdue").reduce((s, r) => s + r.amount - r.paid, 0)), tone: "error" },
          { id: "mtd", label: "Collected MTD", value: "PKR 18.4M", tone: "success" },
          { id: "dso", label: "DSO", value: "42 days", tone: "info" },
        ]}
        columns={4}
      />

      <DataTable
        data={rows}
        columns={columns}
        searchKeys={["id", "customer", "status", "so"]}
        searchPlaceholder="Search AR invoices..."
      />
    </div>
  );
}
