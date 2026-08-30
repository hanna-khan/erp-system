"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid, StatPill } from "@/components/shared/kpi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { costSheet } from "@/mock/data";
import { formatCurrency } from "@/lib/utils";
import { PieChart, Table, TrendingUp } from "lucide-react";

const variance = costSheet.actual.total - costSheet.standard.total;

export default function CostingHubPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Costing"
        description="Standard vs actual cost sheets, style profitability and variance control."
        breadcrumbs={[{ label: "Manufacturing" }, { label: "Costing" }]}
        badge="Finance × Ops"
        actions={
          <Button
            onClick={() =>
              toast({
                title: "Cost rollup refreshed",
                description: "Actuals pulled from PRO-7001 & inventory issues.",
                tone: "info",
              })
            }
          >
            Refresh actuals
          </Button>
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "std", label: "Std cost · Prism Kaftaan", value: formatCurrency(costSheet.standard.total), tone: "info" },
          { id: "act", label: "Actual cost", value: formatCurrency(costSheet.actual.total), tone: "warning" },
          {
            id: "var",
            label: "Variance / pc",
            value: formatCurrency(variance),
            change: `+${((variance / costSheet.standard.total) * 100).toFixed(1)}%`,
            trend: "up",
            tone: "error",
          },
          { id: "gm", label: "Target GM", value: "32%", tone: "success" },
        ]}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { href: "/costing", label: "Dashboard", icon: PieChart },
          { href: "/costing/sheets", label: "Cost sheets", icon: Table },
          { href: "/costing/profitability", label: "Profitability", icon: TrendingUp },
        ].map((m) => (
          <Link key={m.href + m.label} href={m.href} className="zr-card flex items-center gap-3 p-4 hover:shadow-[var(--shadow-sm)]">
            <m.icon className="size-5 text-[var(--brand-primary)]" />
            <span className="text-sm font-semibold">{m.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>
              {costSheet.product} · {costSheet.style}
            </CardTitle>
            <Link href="/costing/sheets/CS-TS-27">
              <Button size="sm" variant="outline">
                Open sheet
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {(
              [
                ["Material", costSheet.standard.material, costSheet.actual.material],
                ["Labor", costSheet.standard.labor, costSheet.actual.labor],
                ["Machine", costSheet.standard.machine, costSheet.actual.machine],
                ["Utilities", costSheet.standard.utilities, costSheet.actual.utilities],
                ["Overhead", costSheet.standard.overhead, costSheet.actual.overhead],
                ["Packaging", costSheet.standard.packaging, costSheet.actual.packaging],
                ["Waste", costSheet.standard.waste, costSheet.actual.waste],
              ] as const
            ).map(([label, std, act]) => (
              <div key={label}>
                <div className="mb-1 flex justify-between text-xs">
                  <span>{label}</span>
                  <span className={act > std ? "font-semibold text-rose-600" : "text-[var(--muted)]"}>
                    {formatCurrency(std)} → {formatCurrency(act)}
                  </span>
                </div>
                <div className="flex h-2 gap-0.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                  <div className="rounded-full bg-slate-300" style={{ width: `${(std / costSheet.actual.total) * 100}%` }} />
                  <div className="rounded-full bg-[var(--brand-primary)]" style={{ width: `${(act / costSheet.actual.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <StatPill label="Linked PRO" value="PRO-7001" tone="info" />
              <StatPill label="Linked SO" value="SO-1024" />
            </div>
            <p className="text-sm text-[var(--muted)]">
              Material variance driven by fabric yield and label expedite; waste above standard on stitching.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/production/orders/PRO-7001">
                <Button size="sm" variant="outline">Production</Button>
              </Link>
              <Link href="/costing/profitability">
                <Button size="sm" variant="outline">Margin analysis</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
