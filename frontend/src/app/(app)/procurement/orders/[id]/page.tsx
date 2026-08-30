"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { StatPill } from "@/components/shared/kpi";
import { Timeline, WorkflowStepper } from "@/components/shared/workflow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { purchaseOrders, statusTone, suppliers } from "@/mock/data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { WorkflowStep } from "@/types";

export default function PurchaseOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  const po = purchaseOrders.find((p) => p.id === id);
  if (!po) notFound();

  const supplier = suppliers.find((s) => s.name === po.supplier);
  const receivedPct =
    po.status === "Received" ? 100 : po.status === "Partial" ? 60 : po.status === "Open" || po.status === "Approved" ? 0 : 40;

  const steps: WorkflowStep[] = [
    { id: "1", label: "Draft", status: "completed", meta: "Created" },
    { id: "2", label: "Approved", status: "completed", meta: "Finance" },
    {
      id: "3",
      label: "Issued",
      status: po.status === "Approved" ? "current" : "completed",
      meta: po.supplier,
    },
    {
      id: "4",
      label: "Receipt",
      status:
        po.status === "Received"
          ? "completed"
          : po.status === "Partial"
            ? "current"
            : "upcoming",
      href: "/procurement/receipts",
      meta: `${receivedPct}%`,
    },
    {
      id: "5",
      label: "QC",
      status: po.status === "Received" ? "completed" : "upcoming",
      href: "/quality/inspections",
      meta: "Incoming",
    },
    {
      id: "6",
      label: "Put-away",
      status: po.status === "Received" ? "current" : "upcoming",
      href: "/warehouse",
      meta: po.plant,
    },
  ];

  const lines = [
    { sku: po.item.includes("Lawn") ? "FAB-LAWN-60" : po.item.includes("Ombre") || po.item.includes("Print") ? "FAB-OMBRE-BLUSH" : po.item.includes("Embroidery") ? "ACC-EMB-ORIGIN" : "ACC-TAG-CCN", desc: po.item, qty: po.qty, unit: po.unit, rate: Math.round(po.value / po.qty), received: Math.round((po.qty * receivedPct) / 100) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={po.id}
        description={`${po.item} · ${po.supplier} · ${po.plant}`}
        badge={po.status}
        breadcrumbs={[
          { label: "Procurement", href: "/procurement" },
          { label: "Orders", href: "/procurement/orders" },
          { label: po.id },
        ]}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() =>
                toast({ title: "PO sent to supplier", description: `${po.id} emailed.`, tone: "info" })
              }
            >
              Send to supplier
            </Button>
            <Button
              onClick={() =>
                toast({
                  title: "Goods receipt started",
                  description: `GRN draft against ${po.id}.`,
                  tone: "success",
                })
              }
            >
              Create GRN
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatPill label="Order value" value={formatCurrency(po.value)} tone="info" />
        <StatPill label="Quantity" value={`${formatNumber(po.qty)} ${po.unit}`} />
        <StatPill label="Received" value={`${receivedPct}%`} tone={receivedPct === 100 ? "success" : "warning"} />
        <StatPill label="ETA" value={po.eta} />
        <StatPill label="Plant" value={po.plant} />
      </div>

      <WorkflowStepper title="PO lifecycle" steps={steps} />

      <Tabs defaultValue="lines">
        <TabsList>
          <TabsTrigger value="lines">Lines</TabsTrigger>
          <TabsTrigger value="supplier">Supplier</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="lines">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Order lines</CardTitle>
              <Badge variant={statusTone(po.status)}>{po.status}</Badge>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-[11px] uppercase tracking-wider text-[var(--muted)]">
                    <tr>
                      <th className="px-2 py-2 text-left">SKU</th>
                      <th className="px-2 py-2 text-left">Description</th>
                      <th className="px-2 py-2 text-right">Ordered</th>
                      <th className="px-2 py-2 text-right">Received</th>
                      <th className="px-2 py-2 text-right">Rate</th>
                      <th className="px-2 py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line) => (
                      <tr key={line.sku} className="border-t border-[var(--border)]">
                        <td className="px-2 py-3 font-medium text-[var(--brand-primary)]">{line.sku}</td>
                        <td className="px-2 py-3">{line.desc}</td>
                        <td className="px-2 py-3 text-right">{formatNumber(line.qty)} {line.unit}</td>
                        <td className="px-2 py-3 text-right">{formatNumber(line.received)}</td>
                        <td className="px-2 py-3 text-right">{formatCurrency(line.rate)}</td>
                        <td className="px-2 py-3 text-right font-semibold">{formatCurrency(po.value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/inventory">
                  <Button variant="outline" size="sm">View stock</Button>
                </Link>
                <Link href="/procurement/receipts">
                  <Button variant="outline" size="sm">Receipts</Button>
                </Link>
                {po.id === "PO-4404" ? (
                  <Link href="/production/orders/PRO-7001">
                    <Button variant="outline" size="sm">Linked PRO-7001</Button>
                  </Link>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supplier">
          <Card>
            <CardContent className="space-y-4 pt-6">
              {supplier ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold">{supplier.name}</p>
                      <p className="text-sm text-[var(--muted)]">{supplier.category} · {supplier.city}</p>
                    </div>
                    <Link href={`/procurement/suppliers/${supplier.id}`}>
                      <Button variant="outline" size="sm">Open scorecard</Button>
                    </Link>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <StatPill label="Quality" value={`${supplier.qualityScore}%`} tone="success" />
                    <StatPill label="On-time" value={`${supplier.onTime}%`} tone="info" />
                    <StatPill label="Terms" value={supplier.paymentTerms} />
                  </div>
                </>
              ) : (
                <p className="text-sm text-[var(--muted)]">Supplier master not found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline
                events={[
                  { id: "1", title: "PO created from requisition", time: "2026-08-25 10:12", meta: "Omar Farooq" },
                  { id: "2", title: "Approved by Finance", time: "2026-08-25 14:40", meta: "Waqas Anwar" },
                  { id: "3", title: "Issued to supplier", time: "2026-08-26 09:05", meta: po.supplier },
                  {
                    id: "4",
                    title: receivedPct > 0 ? "Partial / full receipt logged" : "Awaiting goods receipt",
                    time: "2026-08-29",
                    meta: `ETA ${po.eta}`,
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
