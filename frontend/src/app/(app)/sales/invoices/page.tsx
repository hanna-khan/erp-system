"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

const initial = [
  { id: "INV-5488", so: "SO-1028", customer: "Boutique Collective PK", amount: 4200000, tax: 756000, total: 4956000, date: "2026-07-12", due: "2026-08-11", status: "Overdue" },
  { id: "INV-5490", so: "SO-1025", customer: "Gulf Style Trading (UAE)", amount: 9800000, tax: 0, total: 9800000, date: "2026-07-20", due: "2026-08-19", status: "Partial" },
  { id: "INV-5501", so: "SO-1026", customer: "UK Desi Wear Ltd", amount: 8700000, tax: 0, total: 8700000, date: "2026-08-15", due: "2026-09-14", status: "Paid" },
  { id: "INV-5512", so: "SO-1024", customer: "Boutique Collective PK", amount: 4450000, tax: 801000, total: 5251000, date: "2026-08-05", due: "2026-09-04", status: "Draft" },
  { id: "INV-5520", so: "SO-1025", customer: "Gulf Style Trading (UAE)", amount: 12350000, tax: 0, total: 12350000, date: "2026-08-18", due: "2026-09-17", status: "Open" },
];

type InvoiceRow = (typeof initial)[number] & Record<string, unknown>;

export default function InvoicesPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<InvoiceRow[]>(initial as InvoiceRow[]);

  return (
    <div className="space-y-6 zr-section">
      <PageHeader
        title="Sales invoices"
        description="Commercial invoices with GST for domestic and zero-rated export shipments."
        breadcrumbs={[
          { label: "Sales", href: "/sales" },
          { label: "Invoices" },
        ]}
        actions={
          <CreateRecordDialog
            triggerLabel="New invoice"
            title="Create sales invoice"
            description="Example: invoice a domestic tee shipment with 18% GST."
            successTitle="Invoice created"
            fields={[
              {
                name: "so",
                label: "Sales order",
                type: "select",
                options: ["SO-1024", "SO-1025", "SO-1026", "SO-1027", "SO-1028"],
                defaultValue: "SO-1024",
              },
              {
                name: "customer",
                label: "Customer",
                type: "select",
                options: ["Boutique Collective PK", "Gulf Style Trading (UAE)", "UK Desi Wear Ltd", "cocoon.pk Retail Customers"],
                defaultValue: "Boutique Collective PK",
              },
              { name: "amount", label: "Net amount (PKR)", type: "number", defaultValue: "4450000" },
              {
                name: "taxType",
                label: "Tax",
                type: "select",
                options: ["Domestic GST 18%", "Export zero-rated"],
                defaultValue: "Domestic GST 18%",
              },
              { name: "date", label: "Invoice date", type: "date", defaultValue: "2026-08-30" },
              { name: "due", label: "Due date", type: "date", defaultValue: "2026-09-29" },
            ]}
            onCreate={(values) => {
              const amount = Number(values.amount) || 0;
              const tax = values.taxType.includes("GST") ? Math.round(amount * 0.18) : 0;
              setRows((prev) => [
                {
                  id: `INV-${5520 + prev.length}`,
                  so: values.so,
                  customer: values.customer,
                  amount,
                  tax,
                  total: amount + tax,
                  date: values.date,
                  due: values.due,
                  status: "Draft",
                },
                ...prev,
              ]);
            }}
          />
        }
      />

      <DataTable<InvoiceRow>
        data={rows}
        searchKeys={["id", "so", "customer", "status"]}
        searchPlaceholder="Search invoices…"
        statusKey="status"
        filterKey="status"
        exportName="invoices"
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
            className="rounded-xl"
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
