"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import { statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";

const initial = [
  { id: "RMA-701", so: "SO-1026", customer: "UK Desi Wear Ltd", reason: "Wrong size assortment", qty: 120, unit: "PCS", value: 174000, date: "2026-08-25", status: "Approved" },
  { id: "RMA-702", so: "SO-1025", customer: "Gulf Style Trading (UAE)", reason: "Shade variation lot BT-OMBRE-441", qty: 850, unit: "MTR", value: 357000, date: "2026-08-29", status: "Pending" },
];

type ReturnRow = (typeof initial)[number] & Record<string, unknown>;

export default function ReturnsPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<ReturnRow[]>(initial as ReturnRow[]);

  return (
    <div className="space-y-6 zr-section">
      <PageHeader
        title="Sales returns"
        description="RMA, credit notes, and quality-related returns from domestic & export buyers."
        breadcrumbs={[
          { label: "Sales", href: "/sales" },
          { label: "Returns" },
        ]}
        actions={
          <CreateRecordDialog
            triggerLabel="New return"
            title="Create sales return"
            description="Example: shade variation on an ombre print lot."
            successTitle="RMA created"
            fields={[
              {
                name: "so",
                label: "Sales order",
                type: "select",
                options: ["SO-1024", "SO-1025", "SO-1026", "SO-1027"],
                defaultValue: "SO-1025",
              },
              {
                name: "customer",
                label: "Customer",
                type: "select",
                options: ["Boutique Collective PK", "Gulf Style Trading (UAE)", "UK Desi Wear Ltd", "cocoon.pk Retail Customers"],
                defaultValue: "Gulf Style Trading (UAE)",
              },
              {
                name: "reason",
                label: "Reason",
                defaultValue: "Shade variation on dyed fabric",
              },
              { name: "qty", label: "Quantity", type: "number", defaultValue: "500" },
              {
                name: "unit",
                label: "Unit",
                type: "select",
                options: ["PCS", "MTR", "KG"],
                defaultValue: "MTR",
              },
              { name: "value", label: "Credit value (PKR)", type: "number", defaultValue: "210000" },
              { name: "date", label: "Date", type: "date", defaultValue: "2026-08-30" },
            ]}
            onCreate={(values) => {
              setRows((prev) => [
                {
                  id: `RMA-${702 + prev.length}`,
                  so: values.so,
                  customer: values.customer,
                  reason: values.reason,
                  qty: Number(values.qty) || 0,
                  unit: values.unit,
                  value: Number(values.value) || 0,
                  date: values.date,
                  status: "Pending",
                },
                ...prev,
              ]);
            }}
          />
        }
      />

      <DataTable<ReturnRow>
        data={rows}
        searchKeys={["id", "so", "customer", "reason", "status"]}
        searchPlaceholder="Search returns…"
        statusKey="status"
        filterKey="status"
        exportName="sales-returns"
        columns={[
          { key: "id", label: "RMA" },
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
          { key: "reason", label: "Reason" },
          {
            key: "qty",
            label: "Qty",
            render: (row) => `${formatNumber(row.qty)} ${row.unit}`,
          },
          {
            key: "value",
            label: "Credit value",
            render: (row) => formatCurrency(row.value),
          },
          {
            key: "date",
            label: "Date",
            render: (row) => formatDate(row.date),
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
              toast({ title: "Credit note posted", description: "AR adjusted.", tone: "success" })
            }
          >
            Post credit
          </Button>
        }
      />
    </div>
  );
}
