"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { statusTone } from "@/mock/data";
import { formatNumber } from "@/lib/utils";
import { Check, Play } from "lucide-react";

const pickLists = [
  { id: "PL-218", order: "SO-1025", customer: "Export Customer B", lines: 3, qty: 8000, unit: "MTR", warehouse: "FSD-FG", priority: "High", status: "In Progress", picker: "Asif Khan" },
  { id: "PL-219", order: "SO-1024", customer: "Fashion Retailer A", lines: 4, qty: 2000, unit: "PCS", warehouse: "LHR-FG-01", priority: "Normal", status: "Released", picker: "—" },
  { id: "PL-220", order: "SO-1027", customer: "Local Distributor C", lines: 2, qty: 5000, unit: "MTR", warehouse: "FSD-WIP-01", priority: "Normal", status: "Draft", picker: "—" },
  { id: "PL-221", order: "PRO-7001", customer: "Internal · Stitching", lines: 2, qty: 4200, unit: "PCS", warehouse: "LHR-ACC-01", priority: "Urgent", status: "Picked", picker: "Saba Fatima" },
  { id: "PL-222", order: "SO-1026", customer: "Nordic Apparel AS", lines: 1, qty: 6000, unit: "PCS", warehouse: "LHR-FG-01", priority: "Normal", status: "Completed", picker: "Asif Khan" },
];

const pickLines = [
  { sku: "FAB-DYE-200", bin: "F-02 / B4", need: 4500, picked: 3200, unit: "MTR" },
  { sku: "FAB-DYE-200", bin: "F-02 / B5", need: 3500, picked: 0, unit: "MTR" },
  { sku: "CARTON-5P", bin: "P-01 / A1", need: 180, picked: 180, unit: "PCS" },
];

export default function PickingPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pick Lists"
        description="Directed picking for sales orders, production issues and dispatch waves."
        breadcrumbs={[
          { label: "Warehouse", href: "/warehouse" },
          { label: "Pick Lists" },
        ]}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() =>
                toast({ title: "Wave released", description: "PL-219 assigned to picker pool.", tone: "info" })
              }
            >
              <Play className="size-4" /> Release wave
            </Button>
            <Button
              onClick={() =>
                toast({ title: "Pick confirmed", description: "PL-218 lines posted to packing.", tone: "success" })
              }
            >
              <Check className="size-4" /> Confirm pick
            </Button>
          </>
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "open", label: "Open lists", value: String(pickLists.filter((p) => !["Completed", "Picked"].includes(p.status)).length), tone: "warning" },
          { id: "urg", label: "Urgent", value: String(pickLists.filter((p) => p.priority === "Urgent").length), tone: "error" },
          { id: "prog", label: "In progress", value: "1", tone: "info" },
          { id: "acc", label: "Accuracy (MTD)", value: "98.4%", tone: "success" },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DataTable
            data={pickLists as unknown as Record<string, unknown>[]}
            searchKeys={["id", "order", "customer", "warehouse", "status", "picker"]}
            searchPlaceholder="Search pick lists..."
            statusKey="status"
            columns={[
              { key: "id", label: "Pick list" },
              { key: "order", label: "Order" },
              { key: "customer", label: "Customer / dest." },
              {
                key: "qty",
                label: "Qty",
                render: (row) => `${formatNumber(Number(row.qty))} ${String(row.unit)}`,
              },
              {
                key: "priority",
                label: "Priority",
                render: (row) => (
                  <Badge
                    variant={
                      String(row.priority) === "Urgent"
                        ? "error"
                        : String(row.priority) === "High"
                          ? "warning"
                          : "outline"
                    }
                  >
                    {String(row.priority)}
                  </Badge>
                ),
              },
              { key: "picker", label: "Picker" },
              { key: "status", label: "Status" },
            ]}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>PL-218 · Active lines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pickLines.map((line) => (
              <div key={`${line.sku}-${line.bin}`} className="rounded-xl border border-[var(--border)] p-3">
                <div className="flex justify-between gap-2">
                  <p className="text-sm font-medium">{line.sku}</p>
                  <Badge variant={line.picked >= line.need ? "success" : "warning"}>
                    {line.picked}/{line.need}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">Bin {line.bin} · {line.unit}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                  <div
                    className="h-full rounded-full bg-[var(--brand-primary)]"
                    style={{ width: `${Math.min(100, (line.picked / line.need) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            <Link href="/warehouse/scan">
              <Button variant="outline" className="w-full" size="sm">
                Open scanner
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
