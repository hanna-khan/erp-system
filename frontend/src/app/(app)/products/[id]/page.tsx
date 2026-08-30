"use client";

import { use } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatPill } from "@/components/shared/kpi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { bomLines, colorSizeMatrix, products, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Layers, Pencil } from "lucide-react";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { toast } = useToast();
  const product = products.find((p) => p.id === id) ?? products[4];
  const isGarment = product.type === "Garment";

  return (
    <div className="space-y-6">
      <PageHeader
        title={product.name}
        description={`${product.code} · ${product.type} · ${product.category}`}
        badge={product.status}
        breadcrumbs={[
          { label: "Products", href: "/products" },
          { label: product.id },
        ]}
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link href="/products/bom/BOM-TS-27">
                <Layers className="size-3.5" /> View BOM
              </Link>
            </Button>
            <Button
              size="sm"
              onClick={() =>
                toast({ title: "Edit mode", description: `${product.code} opened for update.`, tone: "info" })
              }
            >
              <Pencil className="size-3.5" /> Edit
            </Button>
          </>
        }
      />

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <StatPill label="Stock" value={`${formatNumber(product.stock)} ${product.unit}`} tone="info" />
        <StatPill label="Price" value={formatCurrency(product.price)} />
        <StatPill label="GSM" value={product.gsm != null ? String(product.gsm) : "—"} />
        <StatPill label="Width" value={product.width != null ? `${product.width}"` : "—"} />
        <StatPill label="Status" value={product.status} tone={product.status === "Active" ? "success" : "warning"} />
      </div>

      <Tabs defaultValue="attributes">
        <TabsList>
          <TabsTrigger value="attributes">Textile attributes</TabsTrigger>
          <TabsTrigger value="matrix">Color × Size</TabsTrigger>
          <TabsTrigger value="bom">BOM preview</TabsTrigger>
          <TabsTrigger value="costing">Costing</TabsTrigger>
        </TabsList>

        <TabsContent value="attributes">
          <div className="zr-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["SKU / Code", product.code],
              ["Product type", product.type],
              ["Category", product.category],
              ["Unit of measure", product.unit],
              ["GSM", product.gsm != null ? String(product.gsm) : "N/A"],
              ["Finished width", product.width != null ? `${product.width} inches` : "N/A"],
              ["Composition", isGarment ? "100% Cotton jersey" : product.type === "Yarn" ? "100% Cotton" : "As per style card"],
              ["Construction", isGarment ? "Single jersey knit" : product.category === "Weaving" ? "Plain weave" : "—"],
              ["Finish", isGarment ? "Softener + silicone" : product.category === "Dyeing" ? "Reactive dyed" : "Greige / raw"],
              ["Inspection", "AQL 2.5 / 4.0"],
              ["HS code", isGarment ? "6109.10" : "5208.XX"],
              ["Status", product.status],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="zr-label">{label}</p>
                <p className="mt-1 text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="matrix">
          <div className="zr-card p-5">
            {isGarment ? (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold">Style {colorSizeMatrix.style} · qty grid</p>
                  <Link href="/products/matrix" className="text-xs font-medium text-[var(--brand-primary)] hover:underline">
                    Open editable matrix
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] text-left text-sm">
                    <thead className="text-[11px] uppercase tracking-wider text-[var(--muted)]">
                      <tr>
                        <th className="pb-2 pr-3">Color</th>
                        {colorSizeMatrix.sizes.map((s) => (
                          <th key={s} className="px-2 pb-2 text-center">
                            {s}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {colorSizeMatrix.colors.map((color) => (
                        <tr key={color} className="border-t border-[var(--border)]">
                          <td className="py-2 pr-3 font-medium">{color}</td>
                          {colorSizeMatrix.sizes.map((size) => (
                            <td key={size} className="px-2 py-2 text-center">
                              {formatNumber(colorSizeMatrix.quantities[color]?.[size] ?? 0)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p className="text-sm text-[var(--muted)]">
                Color × size matrix applies to garment styles. This {product.type.toLowerCase()} is managed by lot / roll.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="bom">
          <div className="zr-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[var(--surface-muted)] text-[11px] uppercase tracking-wider text-[var(--muted)]">
                <tr>
                  <th className="px-4 py-3 text-left">Component</th>
                  <th className="px-4 py-3 text-left">Qty</th>
                  <th className="px-4 py-3 text-left">Scrap %</th>
                  <th className="px-4 py-3 text-left">Waste %</th>
                  <th className="px-4 py-3 text-left">Cost</th>
                </tr>
              </thead>
              <tbody>
                {(isGarment ? bomLines : bomLines.slice(0, 2)).map((line) => (
                  <tr key={line.id} className="border-t border-[var(--border)]">
                    <td className="px-4 py-3 font-medium">{line.component}</td>
                    <td className="px-4 py-3">
                      {line.qty} {line.unit}
                    </td>
                    <td className="px-4 py-3">{line.scrap}%</td>
                    <td className="px-4 py-3">{line.waste}%</td>
                    <td className="px-4 py-3">{formatCurrency(line.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="costing">
          <div className="zr-card space-y-3 p-5">
            <p className="text-sm text-[var(--muted)]">
              Standard selling price{" "}
              <span className="font-semibold text-[var(--foreground)]">{formatCurrency(product.price)}</span> /{" "}
              {product.unit}.
            </p>
            <Badge variant={statusTone(product.status)}>{product.status}</Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                toast({ title: "Cost sheet", description: "Opened standard vs actual costing.", tone: "success" })
              }
            >
              Open cost sheet
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
