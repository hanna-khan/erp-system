"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { salesOrders, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

type OrderRow = (typeof salesOrders)[number] & Record<string, unknown>;

export default function SalesOrdersPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales orders"
        description="Confirmed textile orders with style, color, GSM, and delivery commitments."
        breadcrumbs={[
          { label: "Sales", href: "/sales" },
          { label: "Sales orders" },
        ]}
        actions={
          <Button
            size="sm"
            onClick={() =>
              toast({ title: "Create sales order", description: "SO entry screen opened.", tone: "info" })
            }
          >
            <Plus className="size-3.5" /> New order
          </Button>
        }
      />

      <DataTable<OrderRow>
        data={salesOrders as OrderRow[]}
        searchKeys={["id", "customer", "product", "style", "status", "plant"]}
        searchPlaceholder="Search orders, styles, customers…"
        statusKey="status"
        rowHref={(row) => `/sales/orders/${row.id}`}
        columns={[
          { key: "id", label: "Order" },
          { key: "customer", label: "Customer" },
          { key: "product", label: "Product" },
          { key: "style", label: "Style" },
          {
            key: "qty",
            label: "Qty",
            render: (row) => `${row.qty.toLocaleString()} ${row.unit}`,
          },
          {
            key: "delivered",
            label: "Delivered",
            render: (row) => row.delivered.toLocaleString(),
          },
          {
            key: "value",
            label: "Value",
            render: (row) => formatCurrency(row.value),
          },
          {
            key: "deliveryDate",
            label: "Delivery",
            render: (row) => formatDate(row.deliveryDate),
          },
          { key: "plant", label: "Plant" },
          {
            key: "status",
            label: "Status",
            render: (row) => <Badge variant={statusTone(row.status)}>{row.status}</Badge>,
          },
        ]}
      />
    </div>
  );
}
