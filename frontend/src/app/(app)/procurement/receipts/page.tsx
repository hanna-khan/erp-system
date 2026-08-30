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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { purchaseOrders, statusTone } from "@/mock/data";
import { formatNumber } from "@/lib/utils";

const initialReceipts = [
  { id: "GRN-8801", po: "PO-4403", item: "Origin Embroidery Panels", qty: 2000, unit: "PCS", warehouse: "KHI-ACC-01", date: "2026-08-22", status: "Posted", qc: "Pass" },
  { id: "GRN-8802", po: "PO-4402", item: "Ombre Print Job — Blush", qty: 2400, unit: "MTR", warehouse: "KHI-WIP-01", date: "2026-08-29", status: "Posted", qc: "Pass" },
  { id: "GRN-8803", po: "PO-4401", item: "Printed Lawn Fabric (60\")", qty: 0, unit: "MTR", warehouse: "KHI-RM-01", date: "—", status: "Draft", qc: "Pending" },
  { id: "GRN-8804", po: "PO-4404", item: "Cocoon Hang Tags + Polybags", qty: 0, unit: "PCS", warehouse: "KHI-ACC-01", date: "—", status: "Awaiting", qc: "Pending" },
];

type ReceiptRow = (typeof initialReceipts)[number] & Record<string, unknown>;

export default function ReceiptsPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<ReceiptRow[]>(initialReceipts as ReceiptRow[]);
  const [poId, setPoId] = useState("PO-4404");
  const [qty, setQty] = useState("25000");
  const openPos = purchaseOrders.filter((p) => p.status !== "Received");

  return (
    <div className="space-y-6 zr-section">
      <PageHeader
        title="Goods Receipts"
        description="Post GRNs against open POs, trigger incoming QC and warehouse put-away."
        breadcrumbs={[
          { label: "Procurement", href: "/procurement" },
          { label: "Goods Receipts" },
        ]}
        actions={
          <CreateRecordDialog
            triggerLabel="Post GRN"
            title="Post goods receipt"
            description="Example: receive embroidery panels against PO-4403 into KHI-RM-01."
            successTitle="GRN posted"
            fields={[
              {
                name: "po",
                label: "Purchase order",
                type: "select",
                options: ["PO-4401", "PO-4402", "PO-4403", "PO-4404"],
                defaultValue: "PO-4404",
              },
              {
                name: "item",
                label: "Item",
                type: "select",
                options: ["Printed Lawn Fabric (60\")", "Ombre Print Job — Blush", "Printed Lawn Fabric (60\")", "Cocoon Hang Tags + Polybags"],
                defaultValue: "Cocoon Hang Tags + Polybags",
              },
              { name: "qty", label: "Received qty", type: "number", defaultValue: "25000" },
              {
                name: "unit",
                label: "Unit",
                type: "select",
                options: ["KG", "PCS", "MTR"],
                defaultValue: "PCS",
              },
              {
                name: "warehouse",
                label: "Warehouse",
                type: "select",
                options: ["KHI-RM-01", "KHI-RM-01", "KHI-RM-01", "KHI-ACC-01"],
                defaultValue: "KHI-ACC-01",
              },
              { name: "date", label: "Receipt date", type: "date", defaultValue: "2026-08-30" },
            ]}
            onCreate={(values) => {
              setRows((prev) => [
                {
                  id: `GRN-${8804 + prev.length}`,
                  po: values.po,
                  item: values.item,
                  qty: Number(values.qty) || 0,
                  unit: values.unit,
                  warehouse: values.warehouse,
                  date: values.date,
                  status: "Posted",
                  qc: "Pending",
                },
                ...prev,
              ]);
            }}
          />
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "posted", label: "Posted GRNs", value: String(rows.filter((r) => r.status === "Posted").length), tone: "success" },
          { id: "await", label: "Awaiting receipt", value: String(openPos.length), tone: "warning" },
          { id: "qc", label: "Pending QC", value: String(rows.filter((r) => r.qc === "Pending").length), tone: "info" },
          { id: "today", label: "Received today", value: "720 KG", change: "Dye navy", trend: "up" },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Quick receive</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="po">Purchase order</Label>
              <Input id="po" value={poId} onChange={(e) => setPoId(e.target.value)} list="open-pos" className="rounded-xl" />
              <datalist id="open-pos">
                {openPos.map((p) => (
                  <option key={p.id} value={p.id} />
                ))}
              </datalist>
            </div>
            <div className="space-y-2">
              <Label htmlFor="qty">Received qty</Label>
              <Input id="qty" value={qty} onChange={(e) => setQty(e.target.value)} className="rounded-xl" />
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3 text-xs text-[var(--muted)]">
              Linked to Prism Kaftaan flow: labels for{" "}
              <Link href="/production/orders/PRO-7001" className="font-medium text-[var(--brand-primary)]">
                PRO-7001
              </Link>
            </div>
            <Button
              className="w-full rounded-xl"
              onClick={() =>
                toast({
                  title: "GRN-8805 drafted",
                  description: `Receipt against ${poId} · ${formatNumber(Number(qty) || 0)} units. Route to incoming inspection QC.`,
                  tone: "info",
                })
              }
            >
              Save draft & send to QC
            </Button>
          </CardContent>
        </Card>

        <div className="xl:col-span-2">
          <DataTable
            data={rows as unknown as Record<string, unknown>[]}
            searchKeys={["id", "po", "item", "status", "warehouse"]}
            searchPlaceholder="Search GRNs..."
            statusKey="status"
            filterKey="status"
            exportName="goods-receipts"
            columns={[
              { key: "id", label: "GRN #" },
              {
                key: "po",
                label: "PO",
                href: (row) => `/procurement/orders/${row.po}`,
              },
              { key: "item", label: "Item" },
              {
                key: "qty",
                label: "Qty",
                render: (row) =>
                  Number(row.qty) > 0
                    ? `${formatNumber(Number(row.qty))} ${String(row.unit)}`
                    : "—",
              },
              { key: "warehouse", label: "Warehouse" },
              { key: "date", label: "Date" },
              {
                key: "qc",
                label: "QC",
                render: (row) => <Badge variant={statusTone(String(row.qc))}>{String(row.qc)}</Badge>,
              },
              { key: "status", label: "Status" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
