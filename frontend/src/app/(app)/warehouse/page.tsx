"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid, StatPill } from "@/components/shared/kpi";
import { WorkflowStepper, Timeline } from "@/components/shared/workflow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { WorkflowStep } from "@/types";
import { ListChecks, MapPin, ScanBarcode } from "lucide-react";

const warehouseFlow: WorkflowStep[] = [
  { id: "1", label: "Receiving", status: "completed", href: "/procurement/receipts", meta: "GRN-8802" },
  { id: "2", label: "QC Hold", status: "completed", href: "/quality/inspections", meta: "Released" },
  { id: "3", label: "Put-away", status: "current", href: "/warehouse/locations", meta: "KHI-RM-01" },
  { id: "4", label: "Picking", status: "upcoming", href: "/warehouse/picking", meta: "Pick lists" },
  { id: "5", label: "Packing", status: "upcoming", href: "/warehouse", meta: "Cartons" },
  { id: "6", label: "Dispatch", status: "upcoming", href: "/dispatch", meta: "DO queue" },
];

export default function WarehouseDashboardPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Warehouse"
        description="Receiving through dispatch for RM, WIP, chemicals and finished goods."
        breadcrumbs={[{ label: "Supply Chain" }, { label: "Warehouse" }]}
        badge="WMS"
        actions={
          <>
            <Button variant="outline" onClick={() => toast({ title: "Put-away task created", description: "Task WH-221 for KHI-RM-01.", tone: "info" })}>
              New put-away
            </Button>
            <Button onClick={() => toast({ title: "Pick wave released", description: "Wave W-88 for SO-1025.", tone: "success" })}>
              Release pick wave
            </Button>
          </>
        }
      />

      <KpiGrid
        columns={5}
        items={[
          { id: "recv", label: "Receiving today", value: "3 GRNs", tone: "info" },
          { id: "put", label: "Put-away open", value: "7", tone: "warning" },
          { id: "pick", label: "Open pick lists", value: "5" },
          { id: "acc", label: "Pick accuracy", value: "98.4%", tone: "success", change: "+0.3%", trend: "up" },
          { id: "util", label: "Space util.", value: "76%", hint: "All warehouses" },
        ]}
      />

      <WorkflowStepper title="Receiving → Dispatch" steps={warehouseFlow} />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { href: "/warehouse/locations", label: "Locations", desc: "Zones, racks and bins", icon: MapPin },
          { href: "/warehouse/picking", label: "Pick lists", desc: "Wave picking for orders", icon: ListChecks },
          { href: "/warehouse/scan", label: "Barcode scan", desc: "Lookup SKU / batch / bin", icon: ScanBarcode },
        ].map((m) => (
          <Link key={m.href} href={m.href} className="zr-card p-5 transition-shadow hover:shadow-[var(--shadow-sm)]">
            <m.icon className="mb-3 size-5 text-[var(--brand-primary)]" />
            <p className="font-semibold">{m.label}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">{m.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Warehouse KPIs by site</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <StatPill label="Karachi RM" value="82% full" tone="warning" />
            <StatPill label="Karachi WIP" value="71% full" tone="info" />
            <StatPill label="Karachi FG" value="64% full" tone="success" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Today's floor activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline
              events={[
                { id: "1", title: "GRN-8802 put-away complete", meta: "Reactive Dye → FSD-CHM A-02-B", time: "11:20" },
                { id: "2", title: "Pick list PL-220 started", meta: "SO-1025 · Navy fabric", time: "13:05" },
                { id: "3", title: "Scan mismatch flagged", meta: "ACC-TAG-CCN bin LHR-A-11", time: "14:42" },
                { id: "4", title: "FG receipt from PRO-7001", meta: "800 pcs → KHI-FG-01", time: "15:10" },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
