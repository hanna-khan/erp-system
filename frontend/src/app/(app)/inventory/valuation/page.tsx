"use client";

import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid, StatPill } from "@/components/shared/kpi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { stockItems } from "@/mock/data";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function ValuationPage() {
  const { toast } = useToast();
  const byCategory = Object.entries(
    stockItems.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + item.value;
      return acc;
    }, {}),
  );
  const total = stockItems.reduce((s, i) => s + i.value, 0);
  const max = Math.max(...byCategory.map(([, v]) => v));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Valuation"
        description="Weighted average valuation by category for finance and costing handoff."
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Valuation" },
        ]}
        actions={
          <Button
            onClick={() =>
              toast({
                title: "Valuation snapshot posted",
                description: "Month-end inventory value locked for GL.",
                tone: "success",
              })
            }
          >
            Post to GL
          </Button>
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "tot", label: "Total stock value", value: formatCurrency(total), tone: "info" },
          {
            id: "rm",
            label: "Raw materials",
            value: formatCurrency(byCategory.find(([k]) => k === "Raw Materials")?.[1] ?? 0),
          },
          {
            id: "wip",
            label: "WIP",
            value: formatCurrency(byCategory.find(([k]) => k === "WIP")?.[1] ?? 0),
            tone: "warning",
          },
          {
            id: "fg",
            label: "Finished goods",
            value: formatCurrency(byCategory.find(([k]) => k === "Finished Goods")?.[1] ?? 0),
            tone: "success",
          },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Value by category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {byCategory.map(([cat, value]) => (
              <div key={cat}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{cat}</span>
                  <span className="font-semibold">{formatCurrency(value)}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                  <div
                    className="h-full rounded-full bg-[var(--brand-primary)]"
                    style={{ width: `${(value / max) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-[var(--muted)]">
                  {((value / total) * 100).toFixed(1)}% of inventory
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SKU contribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[...stockItems]
              .sort((a, b) => b.value - a.value)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {formatNumber(item.qty)} {item.unit} · {item.warehouse}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">{formatCurrency(item.value)}</p>
                </div>
              ))}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <StatPill label="Method" value="Weighted avg" tone="info" />
              <StatPill label="As of" value="30 Aug 2026" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
