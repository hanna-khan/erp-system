"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumber } from "@/lib/utils";
import { statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Truck } from "lucide-react";

const initial = [
  { id: "DO-6101", so: "SO-1025", customer: "Gulf Style Trading (UAE)", product: "Fairy Meadows 2-Piece", qty: 800, unit: "PCS", date: "2026-08-22", warehouse: "KHI-FG-01", status: "Dispatched", vehicle: "LES-8821" },
  { id: "DO-6102", so: "SO-1026", customer: "UK Desi Wear Ltd", product: "Matcha | 2-Piece", qty: 1200, unit: "PCS", date: "2026-08-18", warehouse: "ECOM-FG-01", status: "Delivered", vehicle: "KHI-4402" },
  { id: "DO-6103", so: "SO-1024", customer: "Boutique Collective PK", product: "Prism Kaftaan 2-Piece", qty: 0, unit: "PCS", date: "2026-09-25", warehouse: "KHI-FG-01", status: "Draft", vehicle: "—" },
  { id: "DO-6104", so: "SO-1027", customer: "cocoon.pk Retail Customers", product: "Honey & Daisies 2-Piece", qty: 0, unit: "PCS", date: "2026-09-18", warehouse: "ECOM-FG-01", status: "Pending", vehicle: "—" },
];

type DeliveryRow = (typeof initial)[number] & Record<string, unknown>;

export default function DeliveriesPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<DeliveryRow[]>(initial as DeliveryRow[]);

  return (
    <div className="space-y-6 zr-section">
      <PageHeader
        title="Delivery orders"
        description="Warehouse pick, load, and dispatch against confirmed sales orders."
        breadcrumbs={[
          { label: "Sales", href: "/sales" },
          { label: "Deliveries" },
        ]}
        actions={
          <CreateRecordDialog
            triggerLabel="Create DO"
            title="Create delivery order"
            description="Example: ship dyed fabric meters against an export SO."
            successTitle="Delivery order created"
            fields={[
              {
                name: "so",
                label: "Sales order",
                type: "select",
                options: ["SO-1024", "SO-1025", "SO-1026", "SO-1027"],
                defaultValue: "SO-1024",
              },
              {
                name: "customer",
                label: "Customer",
                type: "select",
                options: ["Boutique Collective PK", "Gulf Style Trading (UAE)", "UK Desi Wear Ltd", "cocoon.pk Retail Customers"],
                defaultValue: "Boutique Collective PK",
              },
              {
                name: "product",
                label: "Product",
                type: "select",
                options: ["Prism Kaftaan 2-Piece", "Matcha | 2-Piece", "Fairy Meadows 2-Piece", "Printed Lawn Fabric (60\")"],
                defaultValue: "Prism Kaftaan 2-Piece",
              },
              { name: "qty", label: "Quantity", type: "number", defaultValue: "2000" },
              {
                name: "warehouse",
                label: "Warehouse",
                type: "select",
                options: ["KHI-FG-01", "KHI-FG-01", "ECOM-FG-01"],
                defaultValue: "KHI-FG-01",
              },
              { name: "date", label: "Ship date", type: "date", defaultValue: "2026-09-25" },
            ]}
            onCreate={(values) => {
              const qty = Number(values.qty) || 0;
              const unit = values.product.includes("Fabric") ? "MTR" : "PCS";
              setRows((prev) => [
                {
                  id: `DO-${6104 + prev.length}`,
                  so: values.so,
                  customer: values.customer,
                  product: values.product,
                  qty,
                  unit,
                  date: values.date,
                  warehouse: values.warehouse,
                  status: "Draft",
                  vehicle: "—",
                },
                ...prev,
              ]);
            }}
          />
        }
      />

      <DataTable<DeliveryRow>
        data={rows}
        searchKeys={["id", "so", "customer", "product", "status"]}
        searchPlaceholder="Search delivery orders…"
        statusKey="status"
        filterKey="status"
        exportName="deliveries"
        columns={[
          { key: "id", label: "DO #" },
          {
            key: "so",
            label: "Sales order",
            render: (row) => (
              <Link href={`/sales/orders/${row.so}`} className="font-medium text-[var(--brand-primary)] hover:underline">
                {row.so}
              </Link>
            ),
          },
          { key: "customer", label: "Customer" },
          { key: "product", label: "Product" },
          {
            key: "qty",
            label: "Qty",
            render: (row) => `${formatNumber(row.qty)} ${row.unit}`,
          },
          {
            key: "date",
            label: "Ship date",
            render: (row) => formatDate(row.date),
          },
          { key: "warehouse", label: "Warehouse" },
          { key: "vehicle", label: "Vehicle" },
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
              toast({ title: "Dispatch confirmed", description: "Gate pass printed.", tone: "success" })
            }
          >
            <Truck className="size-3.5" /> Dispatch
          </Button>
        }
      />
    </div>
  );
}
