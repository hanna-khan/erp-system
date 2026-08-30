"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid, StatPill } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { dashboardKpis, statusTone, stockItems } from "@/mock/data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { ArrowLeftRight, BookOpen, Coins, Hash } from "lucide-react";

const links = [
  { href: "/inventory/ledger", label: "Stock ledger", icon: BookOpen },
  { href: "/inventory/movements", label: "Movements", icon: ArrowLeftRight },
  { href: "/inventory/batches", label: "Batches & lots", icon: Hash },
  { href: "/inventory/valuation", label: "Valuation", icon: Coins },
];

type StockRow = (typeof stockItems)[number] & Record<string, unknown>;

export default function InventoryDashboardPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<StockRow[]>(stockItems as StockRow[]);
  const low = rows.filter((s) => s.status === "Low" || s.status === "Critical");

  return (
    <div className="space-y-6 zr-section">
      <PageHeader
        title="Inventory"
        description="Raw materials, WIP, chemicals, accessories and finished goods across plants."
        breadcrumbs={[{ label: "Supply Chain" }, { label: "Inventory" }]}
        badge="Multi-warehouse"
        actions={
          <>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => toast({ title: "Cycle count scheduled", description: "KHI-FG-01 queued for tonight.", tone: "info" })}
            >
              Cycle count
            </Button>
            <CreateRecordDialog
              triggerLabel="Stock transfer"
              title="Stock transfer"
              description="Example: move lawn fabric from KHI-WIP to print house staging."
              successTitle="Transfer drafted"
              variant="outline"
              fields={[
                {
                  name: "sku",
                  label: "SKU",
                  type: "select",
                  options: rows.map((r) => String(r.sku)),
                  defaultValue: String(rows[0]?.sku ?? "FAB-GREY-180"),
                },
                {
                  name: "fromWh",
                  label: "From warehouse",
                  type: "select",
                  options: ["KHI-RM-01", "KHI-RM-01", "KHI-WIP-01", "KHI-RM-01", "KHI-FG-01", "KHI-ACC-01"],
                  defaultValue: "KHI-WIP-01",
                },
                {
                  name: "toWh",
                  label: "To warehouse",
                  type: "select",
                  options: ["KHI-RM-01", "KHI-RM-01", "KHI-WIP-01", "KHI-RM-01", "KHI-FG-01", "KHI-ACC-01"],
                  defaultValue: "KHI-RM-01",
                },
                { name: "qty", label: "Transfer qty", type: "number", defaultValue: "1000" },
              ]}
              onCreate={(values) => {
                setRows((prev) =>
                  prev.map((item) =>
                    item.sku === values.sku
                      ? {
                          ...item,
                          qty: Math.max(0, Number(item.qty) - (Number(values.qty) || 0)),
                          warehouse: values.toWh,
                        }
                      : item,
                  ),
                );
              }}
            />
            <CreateRecordDialog
              triggerLabel="Stock adjustment"
              title="Stock adjustment"
              description="Example: adjust neck labels after a physical count variance."
              successTitle="Adjustment drafted"
              fields={[
                {
                  name: "sku",
                  label: "SKU",
                  type: "select",
                  options: rows.map((r) => String(r.sku)),
                  defaultValue: "ACC-TAG-CCN",
                },
                {
                  name: "direction",
                  label: "Direction",
                  type: "select",
                  options: ["Increase", "Decrease"],
                  defaultValue: "Increase",
                },
                { name: "qty", label: "Quantity", type: "number", defaultValue: "500" },
                { name: "reason", label: "Reason", defaultValue: "Cycle count variance" },
              ]}
              onCreate={(values) => {
                const delta = Number(values.qty) || 0;
                const signed = values.direction === "Decrease" ? -delta : delta;
                setRows((prev) =>
                  prev.map((item) => {
                    if (item.sku !== values.sku) return item;
                    const qty = Math.max(0, Number(item.qty) + signed);
                    const status =
                      qty < Number(item.min) * 0.25 ? "Critical" : qty < Number(item.min) ? "Low" : "OK";
                    return { ...item, qty, status, value: qty * (Number(item.value) / Math.max(Number(item.qty), 1)) };
                  }),
                );
              }}
            />
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
            data={rows as unknown as Record<string, unknown>[]}
            searchKeys={["sku", "name", "category", "warehouse", "status"]}
            searchPlaceholder="Search stock items..."
            statusKey="status"
            filterKey="status"
            exportName="inventory"
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
                  <Badge variant={statusTone(String(item.status))}>{String(item.status)}</Badge>
                </div>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {formatNumber(Number(item.qty))} / min {formatNumber(Number(item.min))} {String(item.unit)}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 w-full rounded-xl"
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
              <StatPill label="SKUs" value={rows.length} />
              <StatPill label="Stock value" value={formatCurrency(rows.reduce((s, i) => s + Number(i.value), 0))} tone="info" />
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
