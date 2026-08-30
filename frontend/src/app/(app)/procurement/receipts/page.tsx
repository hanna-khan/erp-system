"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { purchaseOrders, statusTone } from "@/mock/data";
import { formatNumber } from "@/lib/utils";
import { PackageCheck } from "lucide-react";
import { useState } from "react";

const receipts = [
  { id: "GRN-8801", po: "PO-4403", item: "Cotton Yarn 30s", qty: 15000, unit: "KG", warehouse: "FSD-RM-02", date: "2026-08-22", status: "Posted", qc: "Pass" },
  { id: "GRN-8802", po: "PO-4402", item: "Reactive Dye Navy", qty: 720, unit: "KG", warehouse: "FSD-CHM-01", date: "2026-08-29", status: "Posted", qc: "Pass" },
  { id: "GRN-8803", po: "PO-4401", item: "Raw Cotton Grade A", qty: 0, unit: "KG", warehouse: "KHI-RM-01", date: "—", status: "Draft", qc: "Pending" },
  { id: "GRN-8804", po: "PO-4404", item: "Neck Labels + Tags", qty: 0, unit: "PCS", warehouse: "LHR-ACC-01", date: "—", status: "Awaiting", qc: "Pending" },
];

export default function ReceiptsPage() {
  const { toast } = useToast();
  const [poId, setPoId] = useState("PO-4404");
  const [qty, setQty] = useState("25000");
  const openPos = purchaseOrders.filter((p) => p.status !== "Received");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Goods Receipts"
        description="Post GRNs against open POs, trigger incoming QC and warehouse put-away."
        breadcrumbs={[
          { label: "Procurement", href: "/procurement" },
          { label: "Goods Receipts" },
        ]}
        actions={
          <Button
            onClick={() =>
              toast({
                title: "GRN posted",
                description: `Receipt against ${poId} · ${formatNumber(Number(qty) || 0)} units.`,
                tone: "success",
              })
            }
          >
            <PackageCheck className="size-4" /> Post GRN
          </Button>
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "posted", label: "Posted GRNs", value: String(receipts.filter((r) => r.status === "Posted").length), tone: "success" },
          { id: "await", label: "Awaiting receipt", value: String(openPos.length), tone: "warning" },
          { id: "qc", label: "Pending QC", value: String(receipts.filter((r) => r.qc === "Pending").length), tone: "info" },
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
              <Input id="po" value={poId} onChange={(e) => setPoId(e.target.value)} list="open-pos" />
              <datalist id="open-pos">
                {openPos.map((p) => (
                  <option key={p.id} value={p.id} />
                ))}
              </datalist>
            </div>
            <div className="space-y-2">
              <Label htmlFor="qty">Received qty</Label>
              <Input id="qty" value={qty} onChange={(e) => setQty(e.target.value)} />
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3 text-xs text-[var(--muted)]">
              Linked to T-shirt flow: labels for{" "}
              <Link href="/production/orders/PRO-7001" className="font-medium text-[var(--brand-primary)]">
                PRO-7001
              </Link>
            </div>
            <Button
              className="w-full"
              onClick={() =>
                toast({
                  title: "GRN-8805 drafted",
                  description: "Route to incoming inspection QC.",
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
            data={receipts as unknown as Record<string, unknown>[]}
            searchKeys={["id", "po", "item", "status", "warehouse"]}
            searchPlaceholder="Search GRNs..."
            statusKey="status"
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
