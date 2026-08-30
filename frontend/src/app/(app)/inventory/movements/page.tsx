"use client";

import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { statusTone } from "@/mock/data";
import { formatNumber } from "@/lib/utils";
import { Plus } from "lucide-react";

const movements = [
  { id: "MV-401", date: "2026-08-29 14:22", type: "Transfer", from: "KHI-WIP-01", to: "DYE-01", sku: "FAB-OMBRE-BLUSH", qty: 4500, unit: "MTR", status: "Completed", user: "Hira Nadeem" },
  { id: "MV-402", date: "2026-08-29 11:05", type: "Issue", from: "KHI-ACC-01", to: "SEW-LINE-01", sku: "ACC-TAG-CCN", qty: 4200, unit: "PCS", status: "Reserved", user: "Sanaullah Khan" },
  { id: "MV-403", date: "2026-08-28 16:40", type: "Receipt", from: "GRN-8802", to: "KHI-RM-01", sku: "CHM-OMBRE-BLUSH", qty: 720, unit: "MTR", status: "Completed", user: "Warehouse Ops" },
  { id: "MV-404", date: "2026-08-28 09:15", type: "Production", from: "SEW-LINE-01", to: "KHI-FG-01", sku: "CCN-KAFT-PRISM", qty: 800, unit: "PCS", status: "Completed", user: "Nazia Bibi" },
  { id: "MV-405", date: "2026-08-27 13:50", type: "Transfer", from: "KHI-RM-01", to: "WEAVE-BAY", sku: "FAB-LAWN-60", qty: 2200, unit: "MTR", status: "In Transit", user: "Hira Nadeem" },
  { id: "MV-406", date: "2026-08-26 10:00", type: "Adjustment", from: "Cycle Count", to: "KHI-RM-01", sku: "FAB-LAWN-60", qty: -120, unit: "MTR", status: "Pending", user: "Omar Farooq" },
];

export default function MovementsPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Movements"
        description="Transfers, issues, receipts, production receipts and adjustments."
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Movements" },
        ]}
        actions={
          <Button
            onClick={() =>
              toast({
                title: "Transfer created",
                description: "MV-407 · KHI-WIP-01 → DYE-01.",
                tone: "success",
              })
            }
          >
            <Plus className="size-4" /> New transfer
          </Button>
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "today", label: "Today's movements", value: "4", tone: "info" },
          { id: "transit", label: "In transit", value: "1", tone: "warning" },
          { id: "pend", label: "Pending approval", value: "1", tone: "error" },
          { id: "done", label: "Completed (7d)", value: "38", tone: "success" },
        ]}
      />

      <DataTable
        data={movements as unknown as Record<string, unknown>[]}
        searchKeys={["id", "type", "sku", "from", "to", "status", "user"]}
        searchPlaceholder="Search movements..."
        statusKey="status"
        columns={[
          { key: "id", label: "Movement" },
          { key: "date", label: "When" },
          {
            key: "type",
            label: "Type",
            render: (row) => <Badge variant="outline">{String(row.type)}</Badge>,
          },
          { key: "sku", label: "SKU" },
          {
            key: "qty",
            label: "Qty",
            render: (row) => `${formatNumber(Number(row.qty))} ${String(row.unit)}`,
          },
          { key: "from", label: "From" },
          { key: "to", label: "To" },
          { key: "user", label: "By" },
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
