"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid, StatPill } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { dashboardKpis, statusTone, stockItems } from "@/mock/data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { ArrowLeftRight, BookOpen, Coins, Hash, Plus } from "lucide-react";

const links = [
  { href: "/inventory/ledger", label: "Stock ledger", icon: BookOpen },
  { href: "/inventory/movements", label: "Movements", icon: ArrowLeftRight },
  { href: "/inventory/batches", label: "Batches & lots", icon: Hash },
  { href: "/inventory/valuation", label: "Valuation", icon: Coins },
];

export default function InventoryDashboardPage() {
  const { toast } = useToast();
  const low = stockItems.filter((s) => s.status === "Low" || s.status === "Critical");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Raw materials, WIP, chemicals, accessories and finished goods across plants."
        breadcrumbs={[{ label: "Supply Chain" }, { label: "Inventory" }]}
        badge="Multi-warehouse"
        actions={
          <>
            <Button variant="outline" onClick={() => toast({ title: "Cycle count scheduled", description: "LHR-FG-01 queued for tonight.", tone: "info" })}>
              Cycle count
            </Button>
            <Button onClick={() => toast({ title: "Adjustment drafted", description: "INV-ADJ-901 awaiting approval.", tone: "success" })}>
              <Plus className="size-4" /> Stock adjustment
            </Button>
          </>
        }
      />

      <KpiGrid items={dashboardKpis.inventory} columns={5} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="zr-card flex items-center gap-3 p-4 transition-shadow hover:shadow-[var(--shadow-sm)]">
            <l.icon className="size-5 text-[var(--brand-primary)]" />
            <span className="text-sm font-semibold">{l.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DataTable
            data={stockItems as unknown as Record<string, unknown>[]}
            searchKeys={["sku", "name", "category", "warehouse", "status"]}
            searchPlaceholder="Search stock items..."
            statusKey="status"
            columns={[
              { key: "sku", label: "SKU" },
              { key: "name", label: "Item" },
              { key: "category", label: "Category" },
              { key: "warehouse", label: "Warehouse" },
              {
                key: "qty",
                label: "On hand",
                render: (row) => `${formatNumber(Number(row.qty))} ${String(row.unit)}`,
              },
              {
                key: "min",
                label: "Min",
                render: (row) => formatNumber(Number(row.min)),
              },
              {
                key: "value",
                label: "Value",
                render: (row) => formatCurrency(Number(row.value)),
              },
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
            <CardTitle>Low / critical alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {low.map((item) => (
              <div key={item.id} className="rounded-xl border border-[var(--border)] p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-[var(--muted)]">{item.sku} · {item.warehouse}</p>
                  </div>
                  <Badge variant={statusTone(item.status)}>{item.status}</Badge>
                </div>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {formatNumber(item.qty)} / min {formatNumber(item.min)} {item.unit}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={() =>
                    toast({
                      title: "Requisition suggested",
                      description: `PR draft for ${item.name}.`,
                      tone: "warning",
                    })
                  }
                >
                  Raise PR
                </Button>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <StatPill label="SKUs" value={stockItems.length} />
              <StatPill label="Stock value" value={formatCurrency(stockItems.reduce((s, i) => s + i.value, 0))} tone="info" />
            </div>
            <Link href="/procurement/requisitions" className="text-xs font-medium text-[var(--brand-primary)] hover:underline">
              Open requisitions →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
