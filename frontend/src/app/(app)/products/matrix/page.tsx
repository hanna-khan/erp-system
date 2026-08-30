"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatPill } from "@/components/shared/kpi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/lib/utils";
import { colorSizeMatrix } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

export default function ColorSizeMatrixPage() {
  const { toast } = useToast();
  const [grid, setGrid] = useState(() =>
    Object.fromEntries(
      colorSizeMatrix.colors.map((color) => [color, { ...colorSizeMatrix.quantities[color] }]),
    ) as Record<string, Record<string, number>>,
  );

  const totals = useMemo(() => {
    let grand = 0;
    const byColor: Record<string, number> = {};
    const bySize: Record<string, number> = Object.fromEntries(colorSizeMatrix.sizes.map((s) => [s, 0]));
    for (const color of colorSizeMatrix.colors) {
      let row = 0;
      for (const size of colorSizeMatrix.sizes) {
        const qty = grid[color]?.[size] ?? 0;
        row += qty;
        bySize[size] += qty;
      }
      byColor[color] = row;
      grand += row;
    }
    return { grand, byColor, bySize };
  }, [grid]);

  const updateCell = (color: string, size: string, value: string) => {
    const n = Math.max(0, Number(value.replace(/[^\d]/g, "")) || 0);
    setGrid((prev) => ({
      ...prev,
      [color]: { ...prev[color], [size]: n },
    }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Color × Size matrix"
        description={`Style ${colorSizeMatrix.style} — editable assortment grid for cutting tickets and packing lists.`}
        breadcrumbs={[
          { label: "Products", href: "/products" },
          { label: "Color × Size" },
        ]}
        actions={
          <Button
            size="sm"
            onClick={() =>
              toast({
                title: "Matrix saved",
                description: `${formatNumber(totals.grand)} pcs committed for ${colorSizeMatrix.style}.`,
                tone: "success",
              })
            }
          >
            <Save className="size-3.5" /> Save matrix
          </Button>
        }
      />

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <StatPill label="Style" value={colorSizeMatrix.style} tone="info" />
        <StatPill label="Colors" value={colorSizeMatrix.colors.length} />
        <StatPill label="Sizes" value={colorSizeMatrix.sizes.length} />
        <StatPill label="Total pcs" value={formatNumber(totals.grand)} tone="success" />
      </div>

      <div className="zr-card overflow-x-auto p-4">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-[var(--muted)]">
              <th className="px-2 py-2 text-left">Color</th>
              {colorSizeMatrix.sizes.map((size) => (
                <th key={size} className="px-2 py-2 text-center">
                  {size}
                </th>
              ))}
              <th className="px-2 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {colorSizeMatrix.colors.map((color) => (
              <tr key={color} className="border-t border-[var(--border)]">
                <td className="px-2 py-2 font-medium">{color}</td>
                {colorSizeMatrix.sizes.map((size) => (
                  <td key={size} className="px-1 py-1.5">
                    <Input
                      className="h-8 text-center"
                      value={String(grid[color]?.[size] ?? 0)}
                      onChange={(e) => updateCell(color, size, e.target.value)}
                    />
                  </td>
                ))}
                <td className="px-2 py-2 text-right font-semibold">{formatNumber(totals.byColor[color] ?? 0)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[var(--border)] text-sm font-semibold">
              <td className="px-2 py-3">Total</td>
              {colorSizeMatrix.sizes.map((size) => (
                <td key={size} className="px-2 py-3 text-center">
                  {formatNumber(totals.bySize[size] ?? 0)}
                </td>
              ))}
              <td className="px-2 py-3 text-right text-[var(--brand-primary)]">{formatNumber(totals.grand)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
