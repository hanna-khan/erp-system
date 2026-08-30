"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import { statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

const returns = [
  { id: "RMA-701", so: "SO-1026", customer: "Nordic Apparel AS", reason: "Wrong size assortment", qty: 120, unit: "PCS", value: 174000, date: "2026-08-25", status: "Approved" },
  { id: "RMA-702", so: "SO-1025", customer: "Export Customer B", reason: "Shade variation lot BT-DYE-441", qty: 850, unit: "MTR", value: 357000, date: "2026-08-29", status: "Pending" },
];

type ReturnRow = (typeof returns)[number] & Record<string, unknown>;

export default function ReturnsPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales returns"
        description="RMA, credit notes, and quality-related returns from domestic & export buyers."
        breadcrumbs={[
          { label: "Sales", href: "/sales" },
          { label: "Returns" },
        ]}
        actions={
          <Button
            size="sm"
            onClick={() =>
              toast({ title: "RMA created", description: "Awaiting QC disposition.", tone: "info" })
            }
          >
            <Plus className="size-3.5" /> New return
          </Button>
        }
      />

      <DataTable<ReturnRow>
        data={returns as ReturnRow[]}
        searchKeys={["id", "so", "customer", "reason", "status"]}
        searchPlaceholder="Search returns…"
        statusKey="status"
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
