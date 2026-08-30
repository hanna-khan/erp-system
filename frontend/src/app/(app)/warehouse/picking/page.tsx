"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { formatNumber } from "@/lib/utils";
import { Play } from "lucide-react";

const initialPickLists = [
  { id: "PL-218", order: "SO-1025", customer: "Gulf Style Trading (UAE)", lines: 3, qty: 8000, unit: "MTR", warehouse: "KHI-FG-01", priority: "High", status: "In Progress", picker: "Asif Khan" },
  { id: "PL-219", order: "SO-1024", customer: "Boutique Collective PK", lines: 4, qty: 2000, unit: "PCS", warehouse: "KHI-FG-01", priority: "Normal", status: "Released", picker: "—" },
  { id: "PL-220", order: "SO-1027", customer: "cocoon.pk Retail Customers", lines: 2, qty: 5000, unit: "MTR", warehouse: "KHI-WIP-01", priority: "Normal", status: "Draft", picker: "—" },
  { id: "PL-221", order: "PRO-7001", customer: "Internal · Stitching", lines: 2, qty: 4200, unit: "PCS", warehouse: "KHI-ACC-01", priority: "Urgent", status: "Picked", picker: "Saba Fatima" },
  { id: "PL-222", order: "SO-1026", customer: "UK Desi Wear Ltd", lines: 1, qty: 6000, unit: "PCS", warehouse: "KHI-FG-01", priority: "Normal", status: "Completed", picker: "Asif Khan" },
];

const pickLines = [
  { sku: "FAB-DYE-200", bin: "F-02 / B4", need: 4500, picked: 3200, unit: "MTR" },
  { sku: "FAB-DYE-200", bin: "F-02 / B5", need: 3500, picked: 0, unit: "MTR" },
  { sku: "CARTON-5P", bin: "P-01 / A1", need: 180, picked: 180, unit: "PCS" },
];

type PickRow = (typeof initialPickLists)[number] & Record<string, unknown>;

export default function PickingPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<PickRow[]>(initialPickLists as PickRow[]);

  return (
    <div className="space-y-6 zr-section">
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
              className="rounded-xl"
              onClick={() =>
                toast({ title: "Wave released", description: "Open lists assigned to picker pool.", tone: "info" })
              }
            >
              <Play className="size-4" /> Release wave
            </Button>
            <CreateRecordDialog
              triggerLabel="New pick list"
              title="Create pick list"
              description="Example: pick dyed fabric meters for an export sales order."
              successTitle="Pick list created"
              fields={[
                {
                  name: "order",
                  label: "Order / PRO",
                  type: "select",
                  options: ["SO-1024", "SO-1025", "SO-1026", "SO-1027", "PRO-7001"],
                  defaultValue: "SO-1024",
                },
                {
                  name: "customer",
                  label: "Customer / destination",
                  defaultValue: "Boutique Collective PK",
                },
                { name: "qty", label: "Quantity", type: "number", defaultValue: "2000" },
                {
                  name: "unit",
                  label: "Unit",
                  type: "select",
                  options: ["PCS", "MTR", "KG"],
                  defaultValue: "PCS",
                },
                {
                  name: "warehouse",
                  label: "Warehouse",
                  type: "select",
                  options: ["KHI-FG-01", "KHI-FG-01", "KHI-WIP-01", "KHI-ACC-01"],
                  defaultValue: "KHI-FG-01",
                },
                {
                  name: "priority",
                  label: "Priority",
                  type: "select",
                  options: ["Normal", "High", "Urgent"],
                  defaultValue: "Normal",
                },
              ]}
              onCreate={(values) => {
                setRows((prev) => [
                  {
                    id: `PL-${222 + prev.length}`,
                    order: values.order,
                    customer: values.customer,
                    lines: 1,
                    qty: Number(values.qty) || 0,
                    unit: values.unit,
                    warehouse: values.warehouse,
                    priority: values.priority,
                    status: "Draft",
                    picker: "—",
                  },
                  ...prev,
                ]);
              }}
            />
          </>
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "open", label: "Open lists", value: String(rows.filter((p) => !["Completed", "Picked"].includes(String(p.status))).length), tone: "warning" },
          { id: "urg", label: "Urgent", value: String(rows.filter((p) => p.priority === "Urgent").length), tone: "error" },
          { id: "prog", label: "In progress", value: String(rows.filter((p) => p.status === "In Progress").length), tone: "info" },
          { id: "acc", label: "Accuracy (MTD)", value: "98.4%", tone: "success" },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DataTable
            data={rows as unknown as Record<string, unknown>[]}
            searchKeys={["id", "order", "customer", "warehouse", "status", "picker"]}
            searchPlaceholder="Search pick lists..."
            statusKey="status"
            filterKey="status"
            exportName="pick-lists"
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
              <Button variant="outline" className="w-full rounded-xl" size="sm">
                Open scanner
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
