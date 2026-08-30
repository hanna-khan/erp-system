"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Plus, Send } from "lucide-react";

const invoices = [
  { id: "INV-5488", so: "SO-1028", customer: "Fashion Retailer A", amount: 4200000, tax: 756000, total: 4956000, date: "2026-07-12", due: "2026-08-11", status: "Overdue" },
  { id: "INV-5490", so: "SO-1025", customer: "Export Customer B", amount: 9800000, tax: 0, total: 9800000, date: "2026-07-20", due: "2026-08-19", status: "Partial" },
  { id: "INV-5501", so: "SO-1026", customer: "Nordic Apparel AS", amount: 8700000, tax: 0, total: 8700000, date: "2026-08-15", due: "2026-09-14", status: "Paid" },
  { id: "INV-5512", so: "SO-1024", customer: "Fashion Retailer A", amount: 4450000, tax: 801000, total: 5251000, date: "2026-08-05", due: "2026-09-04", status: "Draft" },
  { id: "INV-5520", so: "SO-1025", customer: "Export Customer B", amount: 12350000, tax: 0, total: 12350000, date: "2026-08-18", due: "2026-09-17", status: "Open" },
];

type InvoiceRow = (typeof invoices)[number] & Record<string, unknown>;

export default function InvoicesPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales invoices"
        description="Commercial invoices with GST for domestic and zero-rated export shipments."
        breadcrumbs={[
          { label: "Sales", href: "/sales" },
          { label: "Invoices" },
        ]}
        actions={
          <Button
            size="sm"
            onClick={() =>
              toast({ title: "Invoice draft", description: "Created from delivery order.", tone: "info" })
            }
          >
            <Plus className="size-3.5" /> New invoice
          </Button>
        }
      />

      <DataTable<InvoiceRow>
        data={invoices as InvoiceRow[]}
        searchKeys={["id", "so", "customer", "status"]}
        searchPlaceholder="Search invoices…"
        statusKey="status"
        columns={[
          { key: "id", label: "Invoice" },
          {
            key: "so",
            label: "SO",
            render: (row) => (
              <Link href={`/sales/orders/${row.so}`} className="font-medium text-[var(--brand-primary)] hover:underline">
                {row.so}
              </Link>
            ),
          },
          { key: "customer", label: "Customer" },
          {
            key: "amount",
            label: "Net",
            render: (row) => formatCurrency(row.amount),
          },
          {
            key: "tax",
            label: "GST",
            render: (row) => formatCurrency(row.tax),
          },
          {
            key: "total",
            label: "Total",
            render: (row) => formatCurrency(row.total),
          },
          {
            key: "date",
            label: "Date",
            render: (row) => formatDate(row.date),
          },
          {
            key: "due",
            label: "Due",
            render: (row) => formatDate(row.due),
          },
          {
            key: "status",
            label: "Status",
            render: (row) => <Badge variant={statusTone(row.status)}>{row.status}</Badge>,
          },
        ]}
        actions={
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              toast({ title: "Invoice emailed", description: "FBR e-invoice payload queued.", tone: "success" })
            }
          >
            <Send className="size-3.5" /> Send
          </Button>
        }
      />
    </div>
  );
}
