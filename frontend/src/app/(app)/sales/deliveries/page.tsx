"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumber } from "@/lib/utils";
import { statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Plus, Truck } from "lucide-react";

const deliveries = [
  { id: "DO-6101", so: "SO-1025", customer: "Export Customer B", product: "Dyed Fabric Reactive", qty: 12000, unit: "MTR", date: "2026-08-22", warehouse: "FSD-FG-01", status: "Dispatched", vehicle: "LES-8821" },
  { id: "DO-6102", so: "SO-1026", customer: "Nordic Apparel AS", product: "Polo Shirt", qty: 6000, unit: "PCS", date: "2026-08-18", warehouse: "LHR-FG-01", status: "Delivered", vehicle: "KHI-4402" },
  { id: "DO-6103", so: "SO-1024", customer: "Fashion Retailer A", product: "Men's T-Shirt", qty: 0, unit: "PCS", date: "2026-09-25", warehouse: "LHR-FG-01", status: "Draft", vehicle: "—" },
  { id: "DO-6104", so: "SO-1027", customer: "Local Distributor C", product: "Cotton Fabric 180 GSM", qty: 0, unit: "MTR", date: "2026-09-18", warehouse: "FSD-FG-02", status: "Pending", vehicle: "—" },
];

type DeliveryRow = (typeof deliveries)[number] & Record<string, unknown>;

export default function DeliveriesPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Delivery orders"
        description="Warehouse pick, load, and dispatch against confirmed sales orders."
        breadcrumbs={[
          { label: "Sales", href: "/sales" },
          { label: "Deliveries" },
        ]}
        actions={
          <Button
            size="sm"
            onClick={() =>
              toast({ title: "Delivery order", description: "DO draft created from SO.", tone: "success" })
            }
          >
            <Plus className="size-3.5" /> Create DO
          </Button>
        }
      />

      <DataTable<DeliveryRow>
        data={deliveries as DeliveryRow[]}
        searchKeys={["id", "so", "customer", "product", "status"]}
        searchPlaceholder="Search delivery orders…"
        statusKey="status"
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
