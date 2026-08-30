"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { StatPill } from "@/components/shared/kpi";
import { Timeline } from "@/components/shared/workflow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { purchaseOrders, statusTone, suppliers } from "@/mock/data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Star } from "lucide-react";

const historyBySupplier: Record<string, { id: string; title: string; meta?: string; time: string }[]> = {
  "SU-501": [
    { id: "1", title: "PO-4401 issued — Printed Lawn Fabric (60\")", meta: "12,000 MTR · PKR 5.04M", time: "2026-08-26" },
    { id: "2", title: "Incoming QC Pass · BT-LAWN-882", meta: "QC-1201 · Mehreen Qazi", time: "2026-08-28" },
    { id: "3", title: "Quality score updated to 95%", meta: "GSM & print registration within spec", time: "2026-08-28" },
    { id: "4", title: "On-time delivery confirmed", meta: "Lead time 9 days vs SLA 10", time: "2026-08-29" },
  ],
  "SU-502": [
    { id: "1", title: "PO-4403 received — Origin Embroidery Panels", meta: "2,000 PCS", time: "2026-08-22" },
    { id: "2", title: "Embroidery QC notes logged", meta: "Accepted with concession", time: "2026-08-23" },
  ],
  "SU-503": [
    { id: "1", title: "PO-4402 partial — Ombre Print Job — Blush", meta: "3,500 MTR inbound", time: "2026-08-29" },
    { id: "2", title: "Preferred vendor renewal", meta: "Quality score 93%", time: "2026-08-15" },
  ],
  "SU-504": [
    { id: "1", title: "PO-4404 approved — Cocoon Hang Tags + Polybags", meta: "25,000 PCS · for PRO-7001", time: "2026-08-27" },
    { id: "2", title: "Awaiting GRN at Karachi FG Warehouse", meta: "ETA 2026-09-08", time: "2026-08-30" },
  ],
};

export default function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  const supplier = suppliers.find((s) => s.id === id);
  if (!supplier) notFound();

  const relatedPos = purchaseOrders.filter((p) => p.supplier === supplier.name);
  const events = historyBySupplier[supplier.id] ?? [
    { id: "1", title: "Vendor profile created", time: "2026-01-10", meta: supplier.category },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={supplier.name}
        description={`${supplier.category} · ${supplier.city} · ${supplier.paymentTerms}`}
        badge={supplier.status}
        breadcrumbs={[
          { label: "Procurement", href: "/procurement" },
          { label: "Suppliers", href: "/procurement/suppliers" },
          { label: supplier.id },
        ]}
        actions={
          <>
            <Button variant="outline" onClick={() => toast({ title: "RFQ sent", description: `RFQ emailed to ${supplier.name}.`, tone: "info" })}>
              Send RFQ
            </Button>
            <Button onClick={() => toast({ title: "PO draft linked", description: `New PO against ${supplier.id}.`, tone: "success" })}>
              Create PO
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatPill label="Rating" value={`${supplier.rating.toFixed(1)} / 5`} tone="warning" />
        <StatPill label="Quality score" value={`${supplier.qualityScore}%`} tone="success" />
        <StatPill label="On-time %" value={`${supplier.onTime}%`} tone="info" />
        <StatPill label="Lead time" value={`${supplier.leadDays} days`} />
        <StatPill label="Open PO value" value={formatCurrency(relatedPos.filter((p) => p.status !== "Received").reduce((s, p) => s + p.value, 0))} />
      </div>

      <Tabs defaultValue="scorecard">
        <TabsList>
          <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
          <TabsTrigger value="orders">Purchase history</TabsTrigger>
          <TabsTrigger value="timeline">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="scorecard">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quality & delivery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Quality score", value: supplier.qualityScore },
                  { label: "On-time delivery", value: supplier.onTime },
                  { label: "Rating index", value: Math.round(supplier.rating * 20) },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-[var(--muted)]">{bar.label}</span>
                      <span className="font-semibold">{bar.value}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                      <div
                        className="h-full rounded-full bg-[var(--brand-primary)]"
                        style={{ width: `${bar.value}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                  <Star className="size-5 fill-amber-400 text-amber-400" />
                  <div>
                    <p className="text-sm font-semibold">{supplier.rating.toFixed(1)} star vendor</p>
                    <p className="text-xs text-[var(--muted)]">Based on last 12 months of receipts & QC</p>
                  </div>
                  <Badge className="ml-auto" variant={statusTone(supplier.status)}>
                    {supplier.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Commercial profile</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Supplier ID", supplier.id],
                  ["Category", supplier.category],
                  ["City", supplier.city],
                  ["Payment terms", supplier.paymentTerms],
                  ["Lead days", `${supplier.leadDays}`],
                  ["Status", supplier.status],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-[var(--border)] p-3">
                    <p className="zr-label">{k}</p>
                    <p className="mt-1 text-sm font-medium">{v}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardContent className="space-y-3 pt-6">
              {relatedPos.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">No purchase orders linked yet.</p>
              ) : (
                relatedPos.map((po) => (
                  <Link
                    key={po.id}
                    href={`/procurement/orders/${po.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] p-4 hover:bg-[var(--sidebar-hover)]"
                  >
                    <div>
                      <p className="font-medium text-[var(--brand-primary)]">{po.id}</p>
                      <p className="text-xs text-[var(--muted)]">
                        {po.item} · {formatNumber(po.qty)} {po.unit} · {po.plant}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(po.value)}</p>
                      <Badge variant={statusTone(po.status)}>{po.status}</Badge>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Supplier history</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline events={events} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
