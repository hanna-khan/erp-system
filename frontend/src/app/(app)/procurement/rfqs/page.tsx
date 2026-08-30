"use client";

import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { statusTone } from "@/mock/data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Award, Plus, Send } from "lucide-react";

const rfqs = [
  {
    id: "RFQ-5501",
    item: "Raw Cotton Grade A",
    qty: 50000,
    unit: "KG",
    suppliers: 3,
    bestQuote: 365,
    status: "Awarded",
    due: "2026-08-24",
    linkedPo: "PO-4401",
  },
  {
    id: "RFQ-5502",
    item: "Reactive Dye Navy",
    qty: 1200,
    unit: "KG",
    suppliers: 2,
    bestQuote: 2950,
    status: "Evaluating",
    due: "2026-08-30",
    linkedPo: "—",
  },
  {
    id: "RFQ-5503",
    item: "Neck Labels + Hang Tags",
    qty: 25000,
    unit: "PCS",
    suppliers: 4,
    bestQuote: 34,
    status: "Sent",
    due: "2026-09-02",
    linkedPo: "PO-4404",
  },
  {
    id: "RFQ-5504",
    item: "Carton Boxes 5-ply",
    qty: 8000,
    unit: "PCS",
    suppliers: 2,
    bestQuote: 95,
    status: "Draft",
    due: "2026-09-06",
    linkedPo: "—",
  },
];

const quoteLines = [
  { vendor: "Cotton Supplier A", price: 370, lead: 7, score: 94 },
  { vendor: "Indus Fiber Co.", price: 365, lead: 9, score: 88 },
  { vendor: "Punjab Cotton Traders", price: 378, lead: 6, score: 91 },
];

export default function RfqsPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Request for Quotations"
        description="Compare supplier quotes for fiber, dyes and trims before awarding POs."
        breadcrumbs={[
          { label: "Procurement", href: "/procurement" },
          { label: "RFQs" },
        ]}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() =>
                toast({ title: "RFQ published", description: "Vendors notified by email.", tone: "info" })
              }
            >
              <Send className="size-4" /> Publish
            </Button>
            <Button
              onClick={() =>
                toast({ title: "RFQ created", description: "RFQ-5505 draft ready.", tone: "success" })
              }
            >
              <Plus className="size-4" /> New RFQ
            </Button>
          </>
        }
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "open", label: "Open RFQs", value: String(rfqs.filter((r) => r.status !== "Awarded").length), tone: "warning" },
          { id: "award", label: "Awarded", value: String(rfqs.filter((r) => r.status === "Awarded").length), tone: "success" },
          { id: "quotes", label: "Quotes received", value: "11", tone: "info" },
          { id: "save", label: "Est. savings", value: formatCurrency(420000), change: "vs last buy", trend: "up" },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DataTable
            data={rfqs as unknown as Record<string, unknown>[]}
            searchKeys={["id", "item", "status"]}
            searchPlaceholder="Search RFQs..."
            statusKey="status"
            columns={[
              { key: "id", label: "RFQ #" },
              { key: "item", label: "Item" },
              {
                key: "qty",
                label: "Qty",
                render: (row) => `${formatNumber(Number(row.qty))} ${String(row.unit)}`,
              },
              { key: "suppliers", label: "Vendors" },
              {
                key: "bestQuote",
                label: "Best unit",
                render: (row) => formatCurrency(Number(row.bestQuote)),
              },
              { key: "due", label: "Due" },
              { key: "status", label: "Status" },
            ]}
            actions={
              <Button
                size="sm"
                onClick={() =>
                  toast({
                    title: "Awarded to lowest quote",
                    description: "PO draft created from RFQ-5502.",
                    tone: "success",
                  })
                }
              >
                <Award className="size-3.5" /> Award
              </Button>
            }
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>RFQ-5501 · Quote board</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quoteLines.map((q, i) => (
              <div
                key={q.vendor}
                className="rounded-xl border border-[var(--border)] p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{q.vendor}</p>
                  {i === 1 ? <Badge variant="success">Best</Badge> : null}
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-[var(--muted)]">
                  <span>{formatCurrency(q.price)}/KG</span>
                  <span>{q.lead}d lead</span>
                  <span>QS {q.score}%</span>
                </div>
              </div>
            ))}
            <Button
              className="w-full"
              variant="outline"
              onClick={() =>
                toast({
                  title: "Award confirmed",
                  description: "Indus Fiber Co. selected · linked to PO-4401.",
                  tone: "success",
                })
              }
            >
              Confirm award
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
