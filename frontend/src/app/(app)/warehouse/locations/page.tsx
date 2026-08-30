"use client";

import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { statusTone } from "@/mock/data";
import { formatNumber } from "@/lib/utils";
import { Plus } from "lucide-react";

const locations = [
  { id: "KHI-RM-01", warehouse: "Karachi RM", zone: "Fiber", rack: "A-01", bin: "B1", sku: "RM-CTN-A", qty: 62400, capacity: 80000, status: "OK" },
  { id: "FSD-RM-02", warehouse: "Faisalabad RM", zone: "Yarn", rack: "Y-04", bin: "C3", sku: "YRN-CTN-30S", qty: 84200, capacity: 100000, status: "OK" },
  { id: "FSD-WIP-01", warehouse: "Faisalabad WIP", zone: "Grey", rack: "G-02", bin: "A4", sku: "FAB-GREY-180", qty: 38500, capacity: 50000, status: "OK" },
  { id: "FSD-CHM-01", warehouse: "Faisalabad Chem", zone: "Dyes", rack: "D-01", bin: "A-02-B", sku: "CHM-DYE-NVY", qty: 480, capacity: 2000, status: "Low" },
  { id: "LHR-FG-01", warehouse: "Lahore FG", zone: "Garments", rack: "F-08", bin: "R2", sku: "GAR-TSH-MENS", qty: 28400, capacity: 60000, status: "OK" },
  { id: "LHR-ACC-01", warehouse: "Lahore Acc", zone: "Trims", rack: "T-03", bin: "A11", sku: "ACC-LABEL", qty: 1250, capacity: 20000, status: "Critical" },
];

const zoneSummary = [
  { zone: "Fiber", bins: 24, utilization: 78 },
  { zone: "Yarn", bins: 18, utilization: 84 },
  { zone: "Grey / WIP", bins: 32, utilization: 71 },
  { zone: "Chemicals", bins: 12, utilization: 55 },
  { zone: "Garments FG", bins: 40, utilization: 64 },
  { zone: "Accessories", bins: 16, utilization: 42 },
];

export default function WarehouseLocationsPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Warehouse Locations"
        description="Zone → rack → bin hierarchy for put-away and directed picking."
        breadcrumbs={[
          { label: "Warehouse", href: "/warehouse" },
          { label: "Locations" },
        ]}
        actions={
          <Button
            onClick={() =>
              toast({
                title: "Bin created",
                description: "LHR-FG F-09 / R3 added.",
                tone: "success",
              })
            }
          >
            <Plus className="size-4" /> Add bin
          </Button>
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "bins", label: "Active bins", value: "142" },
          { id: "occ", label: "Occupied", value: "118", tone: "info" },
          { id: "empty", label: "Empty", value: "24", tone: "success" },
          { id: "crit", label: "Critical locations", value: "1", tone: "error" },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Zones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {zoneSummary.map((z) => (
              <div key={z.zone}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{z.zone}</span>
                  <span className="text-xs text-[var(--muted)]">{z.bins} bins · {z.utilization}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                  <div
                    className="h-full rounded-full bg-[var(--brand-primary)]"
                    style={{ width: `${z.utilization}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="xl:col-span-2">
          <DataTable
            data={locations as unknown as Record<string, unknown>[]}
            searchKeys={["id", "warehouse", "zone", "rack", "bin", "sku", "status"]}
            searchPlaceholder="Search locations..."
            statusKey="status"
            columns={[
              { key: "id", label: "Warehouse" },
              { key: "zone", label: "Zone" },
              { key: "rack", label: "Rack" },
              { key: "bin", label: "Bin" },
              { key: "sku", label: "SKU" },
              {
                key: "qty",
                label: "Qty",
                render: (row) => formatNumber(Number(row.qty)),
              },
              {
                key: "capacity",
                label: "Util %",
                render: (row) =>
                  `${Math.round((Number(row.qty) / Number(row.capacity)) * 100)}%`,
              },
              {
                key: "status",
                label: "Status",
                render: (row) => <Badge variant={statusTone(String(row.status))}>{String(row.status)}</Badge>,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
