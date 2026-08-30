"use client";

import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { purchaseOrders } from "@/mock/data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function PurchaseOrdersPage() {
  const { toast } = useToast();
  const openValue = purchaseOrders
    .filter((p) => p.status !== "Received")
    .reduce((s, p) => s + p.value, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Orders"
        description="Issue and track material POs across Karachi, Lahore and Faisalabad plants."
        breadcrumbs={[
          { label: "Procurement", href: "/procurement" },
          { label: "Purchase Orders" },
        ]}
        actions={
          <Button
            onClick={() =>
              toast({
                title: "PO drafted",
                description: "PO-4405 created from requisition PR-3301.",
                tone: "success",
              })
            }
          >
            <Plus className="size-4" /> New purchase order
          </Button>
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "cnt", label: "Total POs", value: String(purchaseOrders.length) },
          {
            id: "open",
            label: "Open / partial",
            value: String(purchaseOrders.filter((p) => ["Open", "Partial", "Approved"].includes(p.status)).length),
            tone: "warning",
          },
          { id: "val", label: "Open value", value: formatCurrency(openValue), tone: "info" },
          {
            id: "recv",
            label: "Fully received",
            value: String(purchaseOrders.filter((p) => p.status === "Received").length),
            tone: "success",
          },
        ]}
      />

      <DataTable
        data={purchaseOrders as unknown as Record<string, unknown>[]}
        searchKeys={["id", "supplier", "item", "plant", "status"]}
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
          { key: "plant", label: "Plant" },
          { key: "eta", label: "ETA" },
          { key: "status", label: "Status" },
        ]}
      />
    </div>
  );
}
