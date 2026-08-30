"use client";

import { use } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatPill } from "@/components/shared/kpi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { bomLines } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Copy, Save } from "lucide-react";

const altBom = bomLines.map((line, i) => ({
  ...line,
  scrap: Math.max(0, line.scrap - (i % 2)),
  waste: line.waste + (i === 0 ? 1 : 0),
  cost: Math.round(line.cost * 0.96),
}));

export default function BomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { toast } = useToast();
  const isTee = id.includes("TS") || id === "BOM-TS-27";
  const title = isTee ? "BOM-TS-27 · Prism Kaftaan 2-Piece" : id;
  const lines = bomLines;
  const materialCost = lines.reduce((s, l) => s + l.cost, 0);
  const altCost = altBom.reduce((s, l) => s + l.cost, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description="Multi-level BOM with scrap %, waste %, and version comparison."
        badge="Released"
        breadcrumbs={[
          { label: "Products", href: "/products" },
          { label: "BOM", href: "/products/bom" },
          { label: id },
        ]}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast({ title: "BOM copied", description: "Draft version v4 created.", tone: "success" })
              }
            >
              <Copy className="size-3.5" /> Duplicate
            </Button>
            <Button
              size="sm"
              onClick={() => toast({ title: "BOM saved", description: `${id} updated.`, tone: "success" })}
            >
              <Save className="size-3.5" /> Save
            </Button>
          </>
        }
      />

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <StatPill label="Style" value={isTee ? "CCN-KAFT-PRISM" : "—"} tone="info" />
        <StatPill label="Components" value={lines.length} />
        <StatPill label="Material / pc" value={formatCurrency(materialCost)} />
        <StatPill label="Linked product" value="PR-TS" />
      </div>

      <div className="zr-card p-4">
        <p className="zr-label mb-3">BOM structure</p>
        <div className="space-y-2 text-sm">
          <div className="rounded-lg border border-[var(--brand-primary)]/30 bg-[var(--brand-primary-soft)] px-3 py-2 font-medium">
            L0 · Prism Kaftaan 2-Piece (FG) · 1 PCS
          </div>
          <div className="ml-4 space-y-2 border-l-2 border-[var(--border)] pl-4">
            <div className="rounded-lg border border-[var(--border)] px-3 py-2">
              L1 · Cut fabric panel kit · 1 SET
              <div className="mt-2 ml-2 space-y-1 border-l border-dashed border-[var(--border)] pl-3 text-xs text-[var(--muted)]">
                <p>L2 · Printed Lawn Fabric (60\") · 1.35 MTR (+3% scrap)</p>
              </div>
            </div>
            <div className="rounded-lg border border-[var(--border)] px-3 py-2">L1 · Trims pack · 1 SET</div>
            <div className="rounded-lg border border-[var(--border)] px-3 py-2">L1 · Packing materials · 1 SET</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="current">
        <TabsList>
          <TabsTrigger value="current">Current (v3)</TabsTrigger>
          <TabsTrigger value="compare">Compare vs alt</TabsTrigger>
          <TabsTrigger value="scrap">Scrap & waste</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <div className="zr-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[var(--surface-muted)] text-[11px] uppercase tracking-wider text-[var(--muted)]">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Component</th>
                  <th className="px-4 py-3 text-left">Qty</th>
                  <th className="px-4 py-3 text-left">Unit</th>
                  <th className="px-4 py-3 text-left">Scrap %</th>
                  <th className="px-4 py-3 text-left">Waste %</th>
                  <th className="px-4 py-3 text-left">Cost</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.id} className="border-t border-[var(--border)]">
                    <td className="px-4 py-3">{line.id}</td>
                    <td className="px-4 py-3 font-medium">{line.component}</td>
                    <td className="px-4 py-3">{line.qty}</td>
                    <td className="px-4 py-3">{line.unit}</td>
                    <td className="px-4 py-3">{line.scrap}%</td>
                    <td className="px-4 py-3">{line.waste}%</td>
                    <td className="px-4 py-3">{formatCurrency(line.cost)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[var(--border)] font-semibold">
                  <td className="px-4 py-3" colSpan={6}>
                    Material total / pc
                  </td>
                  <td className="px-4 py-3">{formatCurrency(materialCost)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="compare">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="zr-card p-4">
              <p className="mb-2 text-sm font-semibold">Current v3 · {formatCurrency(materialCost)}</p>
              <ul className="space-y-1 text-xs text-[var(--muted)]">
                {lines.map((l) => (
                  <li key={l.id} className="flex justify-between gap-2">
                    <span>{l.component}</span>
                    <span>{formatCurrency(l.cost)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="zr-card p-4">
              <p className="mb-2 flex flex-wrap items-center gap-2 text-sm font-semibold">
                Alternate (vendor B) · {formatCurrency(altCost)}
                <Badge variant="success">{formatPercent(((materialCost - altCost) / materialCost) * 100)} lower</Badge>
              </p>
              <ul className="space-y-1 text-xs text-[var(--muted)]">
                {altBom.map((l) => (
                  <li key={l.id} className="flex justify-between gap-2">
                    <span>{l.component}</span>
                    <span>{formatCurrency(l.cost)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scrap">
          <div className="zr-card space-y-3 p-5">
            {lines.map((line) => {
              const gross = line.qty * (1 + (line.scrap + line.waste) / 100);
              return (
                <div
                  key={line.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium">{line.component}</p>
                    <p className="text-xs text-[var(--muted)]">
                      Net {line.qty} {line.unit} · scrap {line.scrap}% · waste {line.waste}%
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    Issue {formatNumber(Number(gross.toFixed(3)))} {line.unit}
                  </p>
                </div>
              );
            })}
            <Button asChild variant="outline" size="sm">
              <Link href="/products/PR-TS">Open finished good</Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
