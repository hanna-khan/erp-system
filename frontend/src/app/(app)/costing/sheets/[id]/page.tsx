"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { StatPill } from "@/components/shared/kpi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { costSheet } from "@/mock/data";
import { formatCurrency, formatPercent } from "@/lib/utils";

const sheetMeta: Record<string, { product: string; style: string; process: string; pro?: string }> = {
  "CS-TS-27": { product: costSheet.product, style: costSheet.style, process: "Garments", pro: "PRO-7001" },
  "CS-POLO-26": { product: "Polo Shirt", style: "POLO-CORE-26", process: "Garments" },
  "CS-DF-58": { product: "Dyed Fabric Reactive", style: "DF-REAC-58", process: "Dyeing", pro: "PRO-7002" },
  "CS-GREY-180": { product: "Cotton Fabric 180 GSM", style: "GREY-180", process: "Weaving", pro: "PRO-7003" },
};

type CostBucket = keyof typeof costSheet.standard;

const buckets: { key: CostBucket; label: string }[] = [
  { key: "material", label: "Material" },
  { key: "labor", label: "Labor" },
  { key: "machine", label: "Machine" },
  { key: "utilities", label: "Utilities" },
  { key: "overhead", label: "Overhead" },
  { key: "packaging", label: "Packaging" },
  { key: "waste", label: "Waste" },
  { key: "subcontract", label: "Subcontract" },
  { key: "total", label: "Total" },
];

function costsFor(id: string) {
  if (id === "CS-TS-27") return costSheet;
  if (id === "CS-POLO-26") {
    return {
      product: "Polo Shirt",
      style: "POLO-CORE-26",
      standard: { material: 720, labor: 140, machine: 55, utilities: 35, overhead: 70, packaging: 45, waste: 25, subcontract: 30, total: 1120 },
      actual: { material: 700, labor: 138, machine: 52, utilities: 34, overhead: 70, packaging: 45, waste: 22, subcontract: 34, total: 1095 },
    };
  }
  if (id === "CS-DF-58") {
    return {
      product: "Dyed Fabric Reactive",
      style: "DF-REAC-58",
      standard: { material: 260, labor: 28, machine: 35, utilities: 22, overhead: 20, packaging: 8, waste: 12, subcontract: 0, total: 385 },
      actual: { material: 278, labor: 30, machine: 38, utilities: 24, overhead: 20, packaging: 8, waste: 14, subcontract: 0, total: 412 },
    };
  }
  return {
    product: "Cotton Fabric 180 GSM",
    style: "GREY-180",
    standard: { material: 180, labor: 22, machine: 28, utilities: 12, overhead: 15, packaging: 3, waste: 5, subcontract: 0, total: 265 },
    actual: { material: 176, labor: 21, machine: 27, utilities: 11, overhead: 15, packaging: 3, waste: 5, subcontract: 0, total: 258 },
  };
}

export default function CostSheetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  const meta = sheetMeta[id];
  if (!meta) notFound();

  const sheet = costsFor(id);
  const variance = sheet.actual.total - sheet.standard.total;
  const varPct = (variance / sheet.standard.total) * 100;

  return (
    <div className="space-y-6">
      <PageHeader
        title={id}
        description={`${sheet.product} · ${sheet.style} · ${meta.process}`}
        badge={variance > 0 ? "Adverse" : "Favorable"}
        breadcrumbs={[
          { label: "Costing", href: "/costing" },
          { label: "Sheets", href: "/costing/sheets" },
          { label: id },
        ]}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() =>
                toast({
                  title: "Standards locked",
                  description: "Next production uses updated BOM rates.",
                  tone: "info",
                })
              }
            >
              Lock standard
            </Button>
            <Button
              onClick={() =>
                toast({
                  title: "Actuals recalculated",
                  description: "Issues + labor tickets rolled into actual.",
                  tone: "success",
                })
              }
            >
              Recalculate
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatPill label="Standard / pc" value={formatCurrency(sheet.standard.total)} tone="info" />
        <StatPill label="Actual / pc" value={formatCurrency(sheet.actual.total)} tone="warning" />
        <StatPill
          label="Variance"
          value={`${variance > 0 ? "+" : ""}${formatCurrency(variance)}`}
          tone={variance > 0 ? "error" : "success"}
        />
        <StatPill label="Variance %" value={formatPercent(varPct)} tone={variance > 0 ? "error" : "success"} />
        <StatPill label="Process" value={meta.process} />
      </div>

      <Tabs defaultValue="variance">
        <TabsList>
          <TabsTrigger value="variance">Std vs actual</TabsTrigger>
          <TabsTrigger value="waterfall">Drivers</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
        </TabsList>

        <TabsContent value="variance">
          <Card>
            <CardHeader>
              <CardTitle>Cost element variance</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead className="text-[11px] uppercase tracking-wider text-[var(--muted)]">
                  <tr>
                    <th className="px-2 py-2 text-left">Element</th>
                    <th className="px-2 py-2 text-right">Standard</th>
                    <th className="px-2 py-2 text-right">Actual</th>
                    <th className="px-2 py-2 text-right">Variance</th>
                    <th className="px-2 py-2 text-left">Signal</th>
                  </tr>
                </thead>
                <tbody>
                  {buckets.map(({ key, label }) => {
                    const std = sheet.standard[key];
                    const act = sheet.actual[key];
                    const v = act - std;
                    const isTotal = key === "total";
                    return (
                      <tr
                        key={key}
                        className={`border-t border-[var(--border)] ${isTotal ? "bg-[var(--surface-muted)] font-semibold" : ""}`}
                      >
                        <td className="px-2 py-3">{label}</td>
                        <td className="px-2 py-3 text-right">{formatCurrency(std)}</td>
                        <td className="px-2 py-3 text-right">{formatCurrency(act)}</td>
                        <td className={`px-2 py-3 text-right ${v > 0 ? "text-rose-600" : v < 0 ? "text-emerald-600" : ""}`}>
                          {v > 0 ? "+" : ""}
                          {formatCurrency(v)}
                        </td>
                        <td className="px-2 py-3">
                          {v === 0 ? (
                            <Badge variant="outline">Flat</Badge>
                          ) : (
                            <Badge variant={v > 0 ? "error" : "success"}>
                              {v > 0 ? "Adverse" : "Favorable"}
                            </Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waterfall">
          <Card>
            <CardHeader>
              <CardTitle>Variance contribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {buckets
                .filter((b) => b.key !== "total")
                .map(({ key, label }) => {
                  const v = sheet.actual[key] - sheet.standard[key];
                  const max = Math.max(
                    ...buckets
                      .filter((b) => b.key !== "total")
                      .map((b) => Math.abs(sheet.actual[b.key] - sheet.standard[b.key])),
                    1,
                  );
                  return (
                    <div key={key}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span>{label}</span>
                        <span className={v > 0 ? "text-rose-600" : v < 0 ? "text-emerald-600" : "text-[var(--muted)]"}>
                          {v > 0 ? "+" : ""}
                          {formatCurrency(v)}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                        <div
                          className={`h-full rounded-full ${v > 0 ? "bg-rose-400" : v < 0 ? "bg-emerald-400" : "bg-slate-300"}`}
                          style={{ width: `${(Math.abs(v) / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              {id === "CS-TS-27" ? (
                <p className="pt-2 text-xs text-[var(--muted)]">
                  Material + waste are the primary adverse drivers on the T-shirt program — align with{" "}
                  <Link href="/production/orders/PRO-7001" className="text-[var(--brand-primary)] hover:underline">
                    PRO-7001
                  </Link>{" "}
                  yield and QC-1202 defects.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links">
          <Card>
            <CardContent className="flex flex-wrap gap-2 pt-6">
              {meta.pro ? (
                <Link href={`/production/orders/${meta.pro}`}>
                  <Button size="sm" variant="outline">{meta.pro}</Button>
                </Link>
              ) : null}
              <Link href="/costing/profitability">
                <Button size="sm" variant="outline">Profitability</Button>
              </Link>
              <Link href="/inventory/valuation">
                <Button size="sm" variant="outline">Inventory valuation</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
