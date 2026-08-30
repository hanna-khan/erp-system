"use client";

import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { formatNumber, formatPercent } from "@/lib/utils";

const capacityRows = [
  { center: "SEW-LINE-01", plant: "Lahore", planned: 10000, available: 9600, actual: 4200, uom: "pcs", load: 104 },
  { center: "CUT-LINE-01", plant: "Lahore", planned: 10000, available: 12000, actual: 10000, uom: "pcs", load: 83 },
  { center: "DYE-01", plant: "Faisalabad", planned: 45000, available: 42000, actual: 28000, uom: "mtr", load: 107 },
  { center: "Loom bay", plant: "Faisalabad", planned: 25000, available: 30000, actual: 0, uom: "mtr", load: 83 },
  { center: "Spinning", plant: "Karachi", planned: 0, available: 35000, actual: 30000, uom: "kg", load: 0 },
];

export default function CapacityPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Capacity Planning"
        description="Planned load vs available hours/output vs actual achievement by work center."
        breadcrumbs={[
          { label: "Planning", href: "/planning" },
          { label: "Capacity" },
        ]}
        actions={
          <Button
            onClick={() =>
              toast({
                title: "Capacity plan saved",
                description: "Overload alerts sent to production managers.",
                tone: "warning",
              })
            }
          >
            Save plan
          </Button>
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "ov", label: "Overloaded centers", value: String(capacityRows.filter((c) => c.load > 100).length), tone: "error" },
          { id: "ok", label: "Within capacity", value: String(capacityRows.filter((c) => c.load > 0 && c.load <= 100).length), tone: "success" },
          { id: "idle", label: "Idle / free", value: String(capacityRows.filter((c) => c.load === 0).length), tone: "info" },
          { id: "avg", label: "Avg load", value: formatPercent(capacityRows.reduce((s, c) => s + c.load, 0) / capacityRows.length, 0) },
        ]}
      />

      <div className="grid gap-4">
        {capacityRows.map((row) => {
          const plannedPct = Math.min(100, (row.planned / Math.max(row.available, 1)) * 100);
          const actualPct = Math.min(100, (row.actual / Math.max(row.available, 1)) * 100);
          return (
            <Card key={row.center}>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <div>
                  <CardTitle className="text-base">{row.center}</CardTitle>
                  <p className="text-xs text-[var(--muted)]">{row.plant} Plant</p>
                </div>
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                    row.load > 100
                      ? "bg-rose-50 text-rose-600"
                      : row.load === 0
                        ? "bg-sky-50 text-sky-600"
                        : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  Load {row.load}%
                </span>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-2 text-xs sm:grid-cols-3">
                  <p>
                    <span className="text-[var(--muted)]">Planned </span>
                    <span className="font-semibold">{formatNumber(row.planned)} {row.uom}</span>
                  </p>
                  <p>
                    <span className="text-[var(--muted)]">Available </span>
                    <span className="font-semibold">{formatNumber(row.available)} {row.uom}</span>
                  </p>
                  <p>
                    <span className="text-[var(--muted)]">Actual </span>
                    <span className="font-semibold">{formatNumber(row.actual)} {row.uom}</span>
                  </p>
                </div>
                <div className="space-y-1.5">
                  <div className="relative h-3 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-violet-200"
                      style={{ width: `${plannedPct}%` }}
                      title="Planned"
                    />
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-[var(--brand-primary)]"
                      style={{ width: `${actualPct}%` }}
                      title="Actual"
                    />
                  </div>
                  <div className="flex gap-4 text-[10px] text-[var(--muted)]">
                    <span className="inline-flex items-center gap-1">
                      <span className="size-2 rounded-full bg-violet-200" /> Planned vs available
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="size-2 rounded-full bg-[var(--brand-primary)]" /> Actual
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
