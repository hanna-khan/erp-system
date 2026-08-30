"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Plus, Ship } from "lucide-react";

const shipments = [
  { id: "SH-5501", so: "SO-1025", customer: "Export Customer B", mode: "Sea FCL", origin: "Port Qasim", destination: "Jebel Ali", qty: 12000, unit: "MTR", value: 5040000, status: "In Transit", etd: "2026-08-28", eta: "2026-09-05", container: "MSCU4829910" },
  { id: "SH-5502", so: "SO-1026", customer: "Nordic Apparel AS", mode: "Air", origin: "KHI", destination: "OSL", qty: 6000, unit: "PCS", value: 8700000, status: "Delivered", etd: "2026-08-18", eta: "2026-08-20", container: "AWB-99102" },
  { id: "SH-5503", so: "SO-1024", customer: "Fashion Retailer A", mode: "Road", origin: "Lahore Plant", destination: "Lahore DC", qty: 2000, unit: "PCS", value: 1780000, status: "Ready", etd: "2026-09-02", eta: "2026-09-02", container: "—" },
  { id: "SH-5504", so: "SO-1027", customer: "Local Distributor C", mode: "Road", origin: "Faisalabad", destination: "Karachi", qty: 8000, unit: "MTR", value: 2280000, status: "Draft", etd: "2026-09-15", eta: "2026-09-16", container: "—" },
];

type ShipRow = (typeof shipments)[number] & Record<string, unknown>;

const columns: Column<ShipRow>[] = [
  { key: "id", label: "Shipment" },
  {
    key: "so",
    label: "SO",
    render: (row) => (
      <Link href={`/sales/orders/${row.so}`} className="text-[var(--brand-primary)] hover:underline">
        {row.so}
      </Link>
    ),
  },
  { key: "customer", label: "Customer" },
  { key: "mode", label: "Mode" },
  {
    key: "qty",
    label: "Qty",
    render: (row) => `${formatNumber(row.qty)} ${row.unit}`,
  },
  {
    key: "value",
    label: "Value",
    render: (row) => formatCurrency(row.value),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => <Badge variant={statusTone(row.status)}>{row.status}</Badge>,
  },
  { key: "eta", label: "ETA" },
];

export default function DispatchPage() {
  const { toast } = useToast();

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Dispatch"
        description="Domestic and export shipments with commercial documents and container tracking."
        breadcrumbs={[{ label: "Logistics" }, { label: "Dispatch" }]}
        actions={
          <Button
            onClick={() =>
              toast({ title: "Shipment created", description: "SH-5505 draft ready for packing.", tone: "success" })
            }
          >
            <Plus className="size-4" /> New Shipment
          </Button>
        }
      />

      <KpiGrid
        items={[
          { id: "ready", label: "Ready to Ship", value: "1", tone: "info" },
          { id: "transit", label: "In Transit", value: "1", tone: "warning" },
          { id: "mtd", label: "Dispatched MTD", value: "18", trend: "up", change: "+3" },
          { id: "export", label: "Export Docs Pending", value: "2", tone: "warning" },
        ]}
        columns={4}
      />

      <DataTable
        data={shipments as ShipRow[]}
        columns={columns}
        searchKeys={["id", "so", "customer", "mode", "status", "container"]}
        searchPlaceholder="Search shipments..."
        rowHref={(row) => `/dispatch/${row.id}`}
        actions={
          <Button size="sm" variant="outline" asChild>
            <Link href="/dispatch/SH-5501">
              <Ship className="size-3.5" /> Open export pack
            </Link>
          </Button>
        }
      />
    </div>
  );
}
