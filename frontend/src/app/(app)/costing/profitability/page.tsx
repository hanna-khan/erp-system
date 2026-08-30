"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { costSheet, products, salesOrders } from "@/mock/data";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

const profitability = [
  {
    id: "P1",
    product: "Prism Kaftaan 2-Piece",
    style: "CCN-KAFT-PRISM",
    revenue: 890,
    cost: costSheet.actual.total,
    margin: 890 - costSheet.actual.total,
    marginPct: ((890 - costSheet.actual.total) / 890) * 100,
    volume: 10000,
    sheet: "CS-TS-27",
  },
  {
    id: "P2",
    product: "Matcha | 2-Piece",
    style: "CCN-RTW-MATCHA",
    revenue: 1450,
    cost: 1095,
    margin: 355,
    marginPct: (355 / 1450) * 100,
    volume: 6000,
    sheet: "CS-MATCHA-26",
  },
  {
    id: "P3",
    product: "Fairy Meadows 2-Piece",
    style: "CCN-LAWN-FAIRY",
    revenue: 420,
    cost: 412,
    margin: 8,
    marginPct: (8 / 420) * 100,
    volume: 45000,
    sheet: "CS-DF-58",
  },
  {
    id: "P4",
    product: "Printed Lawn Fabric (60\")",
    style: "LAWN-60",
    revenue: 285,
    cost: 258,
    margin: 27,
    marginPct: (27 / 285) * 100,
    volume: 25000,
    sheet: "CS-LAWN-60",
  },
  {
    id: "P5",
    product: "Printed Lawn Fabric (60\")",
    style: "FAB-LAWN-60",
    revenue: 620,
    cost: 485,
    margin: 135,
    marginPct: (135 / 620) * 100,
    volume: 30000,
    sheet: "—",
  },
];

export default function ProfitabilityPage() {
  const { toast } = useToast();
  const totalMargin = profitability.reduce((s, p) => s + p.margin * p.volume, 0);
  const totalRevenue = profitability.reduce((s, p) => s + p.revenue * p.volume, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profitability"
        description="Contribution margin by style using actual cost sheets and selling prices."
        breadcrumbs={[
          { label: "Costing", href: "/costing" },
          { label: "Profitability" },
        ]}
        actions={
          <Button
            onClick={() =>
              toast({
                title: "Margin report exported",
                description: "Excel sent to Finance controller.",
                tone: "info",
              })
            }
          >
            Export report
          </Button>
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "rev", label: "Pipeline revenue", value: formatCurrency(totalRevenue), tone: "info" },
          { id: "cm", label: "Contribution", value: formatCurrency(totalMargin), tone: "success" },
          {
            id: "gm",
            label: "Blended GM",
            value: formatPercent((totalMargin / totalRevenue) * 100),
            change: "vs 30% target",
            trend: (totalMargin / totalRevenue) * 100 >= 30 ? "up" : "down",
          },
          {
            id: "risk",
            label: "Thin-margin SKUs",
            value: String(profitability.filter((p) => p.marginPct < 10).length),
            tone: "warning",
          },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DataTable
            data={profitability as unknown as Record<string, unknown>[]}
            searchKeys={["product", "style", "sheet"]}
            searchPlaceholder="Search products..."
            columns={[
              { key: "product", label: "Product" },
              { key: "style", label: "Style" },
              {
                key: "revenue",
                label: "Price",
                render: (row) => formatCurrency(Number(row.revenue)),
              },
              {
                key: "cost",
                label: "Actual cost",
                render: (row) => formatCurrency(Number(row.cost)),
              },
              {
                key: "margin",
                label: "Margin / pc",
                render: (row) => (
                  <span className={Number(row.margin) < 50 ? "font-semibold text-amber-600" : "font-semibold text-emerald-600"}>
                    {formatCurrency(Number(row.margin))}
                  </span>
                ),
              },
              {
                key: "marginPct",
                label: "GM %",
                render: (row) => formatPercent(Number(row.marginPct)),
              },
              {
                key: "volume",
                label: "Volume",
                render: (row) => formatNumber(Number(row.volume)),
              },
              {
                key: "sheet",
                label: "Cost sheet",
                render: (row) =>
                  String(row.sheet) !== "—" ? (
                    <Link
                      href={`/costing/sheets/${row.sheet}`}
                      className="font-medium text-[var(--brand-primary)] hover:underline"
                    >
                      {String(row.sheet)}
                    </Link>
                  ) : (
                    "—"
                  ),
              },
            ]}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Margin mix</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profitability
              .slice()
              .sort((a, b) => b.marginPct - a.marginPct)
              .map((p) => (
                <div key={p.id}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="truncate pr-2">{p.product}</span>
                    <span className="font-semibold">{formatPercent(p.marginPct, 0)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                    <div
                      className={`h-full rounded-full ${p.marginPct < 10 ? "bg-amber-400" : "bg-emerald-400"}`}
                      style={{ width: `${Math.min(100, p.marginPct)}%` }}
                    />
                  </div>
                </div>
              ))}
            <p className="text-xs text-[var(--muted)]">
              Open SOs: {salesOrders.filter((s) => s.status !== "Delivered").length} · Catalog SKUs:{" "}
              {products.length}
            </p>
            <Link href="/costing/sheets/CS-TS-27">
              <Button variant="outline" size="sm" className="w-full">
                Review Prism Kaftaan variance
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
