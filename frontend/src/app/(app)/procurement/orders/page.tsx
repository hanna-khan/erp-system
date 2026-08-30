"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { purchaseOrders } from "@/mock/data";
import { formatCurrency, formatNumber } from "@/lib/utils";

type PoRow = (typeof purchaseOrders)[number] & Record<string, unknown>;

export default function PurchaseOrdersPage() {
  const [rows, setRows] = useState<PoRow[]>(purchaseOrders as PoRow[]);
  const openValue = rows
    .filter((p) => p.status !== "Received")
    .reduce((s, p) => s + Number(p.value), 0);

  return (
    <div className="space-y-6 zr-section">
      <PageHeader
        title="Purchase Orders"
        description="Issue and track material POs across SITE Karachi, FG Warehouse and Online Hub."
        breadcrumbs={[
          { label: "Procurement", href: "/procurement" },
          { label: "Purchase Orders" },
        ]}
        actions={
          <CreateRecordDialog
            triggerLabel="New purchase order"
            title="Create purchase order"
            description="Example: buy Ombre Print Job — Blush for SITE print house."
            successTitle="Purchase order created"
            fields={[
              {
                name: "supplier",
                label: "Supplier",
                type: "select",
                options: ["Faisalabad Lawn Mills", "Karachi Embroidery House", "SITE Dye & Print Works", "Label & Packaging Hub"],
                defaultValue: "Chemical Supplier C",
              },
              {
                name: "item",
                label: "Item",
                type: "select",
                options: ["Printed Lawn Fabric (60\")", "Printed Lawn Fabric (60\")", "Ombre Print Job — Blush", "Cocoon Hang Tags + Polybags"],
                defaultValue: "Ombre Print Job — Blush",
              },
              { name: "qty", label: "Quantity", type: "number", defaultValue: "500" },
              {
                name: "unit",
                label: "Unit",
                type: "select",
                options: ["KG", "PCS", "MTR"],
                defaultValue: "KG",
              },
              { name: "value", label: "Value (PKR)", type: "number", defaultValue: "1500000" },
              {
                name: "plant",
                label: "Plant",
                type: "select",
                options: ["SITE Karachi Plant", "Karachi FG Warehouse", "Online Fulfillment Hub"],
                defaultValue: "Online Fulfillment Hub",
              },
              { name: "eta", label: "ETA", type: "date", defaultValue: "2026-09-15" },
            ]}
            onCreate={(values) => {
              setRows((prev) => [
                {
                  id: `PO-${4404 + prev.length}`,
                  supplier: values.supplier,
                  item: values.item,
                  qty: Number(values.qty) || 0,
                  unit: values.unit,
                  value: Number(values.value) || 0,
                  status: "Open",
                  eta: values.eta,
                  plant: values.plant,
                },
                ...prev,
              ]);
            }}
          />
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "cnt", label: "Total POs", value: String(rows.length) },
          {
            id: "open",
            label: "Open / partial",
            value: String(rows.filter((p) => ["Open", "Partial", "Approved"].includes(String(p.status))).length),
            tone: "warning",
          },
          { id: "val", label: "Open value", value: formatCurrency(openValue), tone: "info" },
          {
            id: "recv",
            label: "Fully received",
            value: String(rows.filter((p) => p.status === "Received").length),
            tone: "success",
          },
        ]}
      />

      <DataTable
        data={rows as unknown as Record<string, unknown>[]}
        searchKeys={["id", "supplier", "item", "plant", "status"]}
        searchPlaceholder="Search purchase orders..."
        statusKey="status"
        filterKey="status"
        exportName="purchase-orders"
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
