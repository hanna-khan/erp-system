"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { salesOrders, statusTone } from "@/mock/data";

type OrderRow = {
  id: string;
  customer: string;
  product: string;
  style: string;
  qty: number;
  delivered: number;
  unit: string;
  value: number;
  deliveryDate: string;
  status: string;
  plant: string;
  color: string;
  gsm: number | null;
} & Record<string, unknown>;

export default function SalesOrdersPage() {
  const [rows, setRows] = useState<OrderRow[]>(salesOrders as OrderRow[]);

  return (
    <div className="space-y-6 zr-section">
      <PageHeader
        title="Sales orders"
        description="Confirmed customer orders. Click an order ID to see full details, production link, and timeline."
        breadcrumbs={[
          { label: "Sales", href: "/sales" },
          { label: "Sales orders" },
        ]}
        actions={
          <CreateRecordDialog
            triggerLabel="New order"
            title="Create sales order"
            description="Example: Boutique Collective PK orders 10,000 Prism Kaftaan 2-Pieces."
            successTitle="Sales order created"
            fields={[
              {
                name: "customer",
                label: "Customer",
                type: "select",
                options: ["Boutique Collective PK", "Gulf Style Trading (UAE)", "cocoon.pk Retail Customers", "UK Desi Wear Ltd"],
                defaultValue: "Boutique Collective PK",
              },
              {
                name: "product",
                label: "Product",
                type: "select",
                options: ["Prism Kaftaan 2-Piece", "Matcha | 2-Piece", "Printed Lawn Fabric (60\")", "Fairy Meadows 2-Piece"],
                defaultValue: "Prism Kaftaan 2-Piece",
              },
              { name: "style", label: "Style", defaultValue: "CCN-KAFT-PRISM" },
              { name: "qty", label: "Quantity", type: "number", defaultValue: "5000" },
              { name: "color", label: "Color / shade", defaultValue: "Black/White" },
              { name: "deliveryDate", label: "Delivery date", type: "date", defaultValue: "2026-10-01" },
              {
                name: "plant",
                label: "Plant",
                type: "select",
                options: ["SITE Karachi Plant", "Karachi FG Warehouse", "Online Fulfillment Hub"],
                defaultValue: "SITE Karachi Plant",
              },
            ]}
            onCreate={(values) => {
              const qty = Number(values.qty) || 0;
              setRows((prev) => [
                {
                  id: `SO-${1029 + prev.length}`,
                  customer: values.customer,
                  product: values.product,
                  style: values.style,
                  qty,
                  delivered: 0,
                  unit: values.product.includes("Fabric") ? "MTR" : "PCS",
                  value: qty * (values.product.includes("Polo") ? 1450 : 890),
                  deliveryDate: values.deliveryDate,
                  status: "Draft",
                  plant: values.plant,
                  color: values.color,
                  gsm: 180,
                },
                ...prev,
              ]);
            }}
          />
        }
      />

      <DataTable<OrderRow>
        data={rows}
        searchKeys={["id", "customer", "product", "style", "status", "plant"]}
        searchPlaceholder="Search orders, styles, customers…"
        statusKey="status"
        filterKey="status"
        exportName="sales-orders"
        rowHref={(row) => `/sales/orders/${row.id}`}
        columns={[
          { key: "id", label: "Order" },
          { key: "customer", label: "Customer" },
          { key: "product", label: "Product" },
          { key: "style", label: "Style" },
          {
            key: "qty",
            label: "Qty",
            render: (row) => `${Number(row.qty).toLocaleString()} ${row.unit}`,
          },
          {
            key: "delivered",
            label: "Delivered",
            render: (row) => Number(row.delivered).toLocaleString(),
          },
          {
            key: "value",
            label: "Value",
            render: (row) => formatCurrency(Number(row.value)),
          },
          {
            key: "deliveryDate",
            label: "Delivery",
            render: (row) => formatDate(String(row.deliveryDate)),
          },
          { key: "plant", label: "Plant" },
          {
            key: "status",
            label: "Status",
            render: (row) => <Badge variant={statusTone(String(row.status))}>{String(row.status)}</Badge>,
          },
        ]}
      />
    </div>
  );
}
