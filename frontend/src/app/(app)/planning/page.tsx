"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { productionOrders, salesOrders, statusTone } from "@/mock/data";
import { formatNumber } from "@/lib/utils";
import { Activity, Calculator, CalendarDays } from "lucide-react";

const mpsRows = salesOrders
  .filter((s) => s.status !== "Delivered")
  .map((s) => {
    const pro = productionOrders.find((p) => p.so === s.id);
    return {
      id: s.id,
      product: s.product,
      style: s.style,
      demand: s.qty,
      scheduled: pro?.qty ?? 0,
      completed: pro?.completed ?? 0,
      plant: s.plant,
      week: s.deliveryDate.slice(0, 7),
      status: pro?.status ?? s.status,
      pro: pro?.id ?? "—",
    };
  });

export default function PlanningMpsPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Production Schedule"
        description="Align sales demand with plant capacity for yarn, fabric and garments."
        breadcrumbs={[{ label: "Manufacturing" }, { label: "Planning" }]}
        badge="MPS"
        actions={
          <Button
            onClick={() =>
              toast({
                title: "MPS published",
                description: "Week 36 schedule locked for all plants.",
                tone: "success",
              })
            }
          >
            Publish MPS
          </Button>
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "dem", label: "Open demand", value: formatNumber(mpsRows.reduce((s, r) => s + r.demand, 0)), tone: "info" },
          { id: "sch", label: "Scheduled", value: formatNumber(mpsRows.reduce((s, r) => s + r.scheduled, 0)) },
          { id: "gap", label: "Uncovered", value: formatNumber(mpsRows.reduce((s, r) => s + Math.max(0, r.demand - r.scheduled), 0)), tone: "warning" },
          { id: "plants", label: "Active plants", value: "3", tone: "success" },
        ]}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { href: "/planning/mrp", label: "MRP / shortages", icon: Calculator },
          { href: "/planning/capacity", label: "Capacity plan", icon: Activity },
          { href: "/planning/calendar", label: "Planning calendar", icon: CalendarDays },
        ].map((m) => (
          <Link key={m.href} href={m.href} className="zr-card flex items-center gap-3 p-4 hover:shadow-[var(--shadow-sm)]">
            <m.icon className="size-5 text-[var(--brand-primary)]" />
            <span className="text-sm font-semibold">{m.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DataTable
            data={mpsRows as unknown as Record<string, unknown>[]}
            searchKeys={["id", "product", "style", "plant", "status", "pro"]}
            searchPlaceholder="Search MPS rows..."
            statusKey="status"
            columns={[
              { key: "id", label: "SO" },
              { key: "product", label: "Product" },
              { key: "style", label: "Style" },
              {
                key: "demand",
                label: "Demand",
                render: (row) => formatNumber(Number(row.demand)),
              },
              {
                key: "scheduled",
                label: "Scheduled",
                render: (row) => formatNumber(Number(row.scheduled)),
              },
              {
                key: "pro",
                label: "PRO",
                render: (row) =>
                  String(row.pro) !== "—" ? (
                    <Link
                      href={`/production/orders/${row.pro}`}
                      className="font-medium text-[var(--brand-primary)] hover:underline"
                    >
                      {String(row.pro)}
                    </Link>
                  ) : (
                    "—"
                  ),
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
        <Card>
          <CardHeader>
            <CardTitle>Planning notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[var(--muted)]">
            <p>SO-1028 is overdue — recommend overtime on Lahore stitching or split lot.</p>
            <p>Fabric for SO-1025 dyeing is 62% complete; protect capacity on DYE-01.</p>
            <p>
              Labels shortage for PRO-7001 covered by{" "}
              <Link href="/procurement/orders/PO-4404" className="text-[var(--brand-primary)] hover:underline">
                PO-4404
              </Link>
              .
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                toast({
                  title: "MRP run queued",
                  description: "Netting against stock + open POs.",
                  tone: "info",
                })
              }
            >
              Run MRP
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
