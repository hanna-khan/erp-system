"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatPill } from "@/components/shared/kpi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { statusTone, stockItems } from "@/mock/data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { ScanBarcode, Search } from "lucide-react";

const barcodeIndex: Record<string, string> = {
  "89010010001": "ST-01",
  "89010010002": "ST-02",
  "89010010003": "ST-03",
  "89010010004": "ST-04",
  "89010010005": "ST-05",
  "89010010006": "ST-06",
  RMCTNA: "ST-01",
  YRN30S: "ST-02",
  GREY180: "ST-03",
  DYENVY: "ST-04",
  TSHMENS: "ST-05",
  ACCLABEL: "ST-06",
};

export default function WarehouseScanPage() {
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [lastScan, setLastScan] = useState<string | null>(null);

  const match = useMemo(() => {
    const raw = (lastScan ?? "").trim().toUpperCase();
    if (!raw) return null;
    const byBarcode = barcodeIndex[raw] ?? barcodeIndex[raw.toLowerCase()];
    const item =
      stockItems.find((s) => s.id === byBarcode) ||
      stockItems.find((s) => s.sku.toUpperCase() === raw) ||
      stockItems.find((s) => s.name.toUpperCase().includes(raw));
    return item ?? null;
  }, [lastScan]);

  const runScan = (value?: string) => {
    const scanned = (value ?? code).trim();
    if (!scanned) {
      toast({ title: "Enter a barcode or SKU", tone: "warning" });
      return;
    }
    setLastScan(scanned);
    const key = scanned.toUpperCase();
    const id = barcodeIndex[key] ?? barcodeIndex[scanned];
    const found =
      stockItems.find((s) => s.id === id) ||
      stockItems.find((s) => s.sku.toUpperCase() === key) ||
      stockItems.find((s) => s.name.toUpperCase().includes(key));
    if (found) {
      toast({
        title: "Scan matched",
        description: `${found.sku} · ${formatNumber(found.qty)} ${found.unit} at ${found.warehouse}`,
        tone: found.status === "OK" ? "success" : "warning",
      });
    } else {
      toast({
        title: "No match",
        description: `Barcode/SKU “${scanned}” not in stock master.`,
        tone: "error",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Barcode Scan"
        description="Mock handheld scanner — enter barcode or SKU to look up stock, bin and valuation."
        breadcrumbs={[
          { label: "Warehouse", href: "/warehouse" },
          { label: "Barcode Scan" },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScanBarcode className="size-5 text-[var(--brand-primary)]" />
              Scanner input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scan">Barcode / SKU</Label>
              <Input
                id="scan"
                autoFocus
                value={code}
                placeholder="e.g. 89010010005 or GAR-TSH-MENS"
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") runScan();
                }}
                className="font-mono text-base"
              />
            </div>
            <Button className="w-full" onClick={() => runScan()}>
              <Search className="size-4" /> Look up
            </Button>
            <div>
              <p className="zr-label mb-2">Quick demos</p>
              <div className="flex flex-wrap gap-2">
                {["89010010005", "ACC-LABEL", "CHM-DYE-NVY", "89010010004"].map((demo) => (
                  <Button
                    key={demo}
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCode(demo);
                      runScan(demo);
                    }}
                  >
                    {demo}
                  </Button>
                ))}
              </div>
            </div>
            <p className="text-xs text-[var(--muted)]">
              Try numeric barcodes 89010010001–006 or any stock SKU from inventory.
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Scan result</CardTitle>
          </CardHeader>
          <CardContent>
            {!lastScan ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] text-center">
                <ScanBarcode className="mb-3 size-10 text-[var(--muted)] opacity-50" />
                <p className="text-sm font-medium">Waiting for scan</p>
                <p className="mt-1 text-xs text-[var(--muted)]">Results appear here with location & alerts</p>
              </div>
            ) : !match ? (
              <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-6 text-center">
                <p className="font-semibold text-rose-700">No stock match</p>
                <p className="mt-1 text-sm text-rose-600/80">Scanned: {lastScan}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-[var(--muted)]">{match.sku}</p>
                    <h3 className="text-xl font-semibold">{match.name}</h3>
                    <p className="text-sm text-[var(--muted)]">{match.category}</p>
                  </div>
                  <Badge variant={statusTone(match.status)}>{match.status}</Badge>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <StatPill label="On hand" value={`${formatNumber(match.qty)} ${match.unit}`} tone={match.status === "OK" ? "success" : "warning"} />
                  <StatPill label="Min level" value={formatNumber(match.min)} />
                  <StatPill label="Warehouse" value={match.warehouse} tone="info" />
                  <StatPill label="Value" value={formatCurrency(match.value)} />
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-sm">
                  <p className="zr-label">Suggested bin</p>
                  <p className="mt-1 font-medium">
                    {match.warehouse} · Rack {match.sku.slice(0, 1)}-0
                    {match.id.slice(-1)} · Bin A{match.id.slice(-1)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href="/inventory">
                    <Button size="sm" variant="outline">Inventory</Button>
                  </Link>
                  <Link href="/warehouse/picking">
                    <Button size="sm" variant="outline">Pick lists</Button>
                  </Link>
                  <Button
                    size="sm"
                    onClick={() =>
                      toast({
                        title: "Put-away confirmed",
                        description: `${match.sku} confirmed in ${match.warehouse}.`,
                        tone: "success",
                      })
                    }
                  >
                    Confirm put-away
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
