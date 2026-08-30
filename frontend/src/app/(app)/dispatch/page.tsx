"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable, type Column } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusTone } from "@/mock/data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Ship } from "lucide-react";

const initialShipments = [
  { id: "SH-5501", so: "SO-1025", customer: "Gulf Style Trading (UAE)", mode: "Sea FCL", origin: "Port Qasim", destination: "Jebel Ali", qty: 12000, unit: "MTR", value: 5040000, status: "In Transit", etd: "2026-08-28", eta: "2026-09-05", container: "MSCU4829910" },
  { id: "SH-5502", so: "SO-1026", customer: "UK Desi Wear Ltd", mode: "Air", origin: "KHI", destination: "LHR", qty: 6000, unit: "PCS", value: 8700000, status: "Delivered", etd: "2026-08-18", eta: "2026-08-20", container: "AWB-99102" },
  { id: "SH-5503", so: "SO-1024", customer: "Boutique Collective PK", mode: "Road", origin: "Karachi FG Warehouse", destination: "Karachi DC", qty: 2000, unit: "PCS", value: 1780000, status: "Ready", etd: "2026-09-02", eta: "2026-09-02", container: "—" },
  { id: "SH-5504", so: "SO-1027", customer: "cocoon.pk Retail Customers", mode: "Road", origin: "Karachi SITE", destination: "Karachi", qty: 8000, unit: "MTR", value: 2280000, status: "Draft", etd: "2026-09-15", eta: "2026-09-16", container: "—" },
];

type ShipRow = (typeof initialShipments)[number] & Record<string, unknown>;

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
  const [rows, setRows] = useState<ShipRow[]>(initialShipments as ShipRow[]);

  return (
    <div className="animate-fade-in space-y-6 zr-section">
      <PageHeader
        title="Dispatch"
        description="Domestic and export shipments with commercial documents and container tracking."
        breadcrumbs={[{ label: "Logistics" }, { label: "Dispatch" }]}
        actions={
          <CreateRecordDialog
            triggerLabel="New Shipment"
            title="Create shipment"
            description="Example: sea FCL of dyed fabric to Jebel Ali."
            successTitle="Shipment created"
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
                name: "mode",
                label: "Mode",
                type: "select",
                options: ["Sea FCL", "Air", "Road"],
                defaultValue: "Sea FCL",
              },
              { name: "qty", label: "Quantity", type: "number", defaultValue: "10000" },
              {
                name: "unit",
                label: "Unit",
                type: "select",
                options: ["MTR", "PCS", "KG"],
                defaultValue: "MTR",
              },
              { name: "value", label: "Value (PKR)", type: "number", defaultValue: "4200000" },
              { name: "etd", label: "ETD", type: "date", defaultValue: "2026-09-05" },
              { name: "eta", label: "ETA", type: "date", defaultValue: "2026-09-15" },
            ]}
            onCreate={(values) => {
              setRows((prev) => [
                {
                  id: `SH-${5504 + prev.length}`,
                  so: values.so,
                  customer: values.customer,
                  mode: values.mode,
                  origin: values.mode === "Road" ? "Karachi FG Warehouse" : "Port Qasim",
                  destination: values.mode === "Sea FCL" ? "Jebel Ali" : values.mode === "Air" ? "OSL" : "Karachi DC",
                  qty: Number(values.qty) || 0,
                  unit: values.unit,
                  value: Number(values.value) || 0,
                  status: "Draft",
                  etd: values.etd,
                  eta: values.eta,
                  container: "—",
                },
                ...prev,
              ]);
            }}
          />
        }
      />

      <KpiGrid
        items={[
          { id: "ready", label: "Ready to Ship", value: String(rows.filter((r) => r.status === "Ready").length), tone: "info" },
          { id: "transit", label: "In Transit", value: String(rows.filter((r) => r.status === "In Transit").length), tone: "warning" },
          { id: "mtd", label: "Dispatched MTD", value: "18", trend: "up", change: "+3" },
          { id: "export", label: "Export Docs Pending", value: "2", tone: "warning" },
        ]}
        columns={4}
      />

      <DataTable
        data={rows}
        columns={columns}
        searchKeys={["id", "so", "customer", "mode", "status", "container"]}
        searchPlaceholder="Search shipments..."
        rowHref={(row) => `/dispatch/${row.id}`}
        statusKey="status"
        filterKey="status"
        exportName="dispatch"
        actions={
          <Button size="sm" variant="outline" asChild className="rounded-xl">
            <Link href="/dispatch/SH-5501">
              <Ship className="size-3.5" /> Open export pack
            </Link>
          </Button>
        }
      />
    </div>
  );
}
