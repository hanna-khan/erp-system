"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Award, Send } from "lucide-react";

const initialRfqs = [
  {
    id: "RFQ-5501",
    item: "Printed Lawn Fabric (60\")",
    qty: 50000,
    unit: "MTR",
    suppliers: 3,
    bestQuote: 365,
    status: "Awarded",
    due: "2026-08-24",
    linkedPo: "PO-4401",
  },
  {
    id: "RFQ-5502",
    item: "Ombre Print Job — Blush",
    qty: 1200,
    unit: "MTR",
    suppliers: 2,
    bestQuote: 2950,
    status: "Evaluating",
    due: "2026-08-30",
    linkedPo: "—",
  },
  {
    id: "RFQ-5503",
    item: "Cocoon Hang Tags + Polybags",
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
    item: "E-com Cartons (Cocoon branded)",
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

type RfqRow = (typeof initialRfqs)[number] & Record<string, unknown>;

export default function RfqsPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<RfqRow[]>(initialRfqs as RfqRow[]);

  return (
    <div className="space-y-6 zr-section">
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
              className="rounded-xl"
              onClick={() =>
                toast({ title: "RFQ published", description: "Vendors notified by email.", tone: "info" })
              }
            >
              <Send className="size-4" /> Publish
            </Button>
            <CreateRecordDialog
              triggerLabel="New RFQ"
              title="Create RFQ"
              description="Example: request quotes for Ombre Print Job — Blush from chemical vendors."
              successTitle="RFQ created"
              fields={[
                {
                  name: "item",
                  label: "Item",
                  type: "select",
                  options: ["Printed Lawn Fabric (60\")", "Ombre Print Job — Blush", "Cocoon Hang Tags + Polybags", "E-com Cartons (Cocoon branded)", "Printed Lawn Fabric (60\")"],
                  defaultValue: "Ombre Print Job — Blush",
                },
                { name: "qty", label: "Quantity", type: "number", defaultValue: "1000" },
                {
                  name: "unit",
                  label: "Unit",
                  type: "select",
                  options: ["KG", "PCS", "MTR"],
                  defaultValue: "KG",
                },
                { name: "suppliers", label: "Vendors invited", type: "number", defaultValue: "3" },
                { name: "due", label: "Quote due", type: "date", defaultValue: "2026-09-10" },
              ]}
              onCreate={(values) => {
                setRows((prev) => [
                  {
                    id: `RFQ-${5504 + prev.length}`,
                    item: values.item,
                    qty: Number(values.qty) || 0,
                    unit: values.unit,
                    suppliers: Number(values.suppliers) || 0,
                    bestQuote: 0,
                    status: "Draft",
                    due: values.due,
                    linkedPo: "—",
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
          { id: "open", label: "Open RFQs", value: String(rows.filter((r) => r.status !== "Awarded").length), tone: "warning" },
          { id: "award", label: "Awarded", value: String(rows.filter((r) => r.status === "Awarded").length), tone: "success" },
          { id: "quotes", label: "Quotes received", value: "11", tone: "info" },
          { id: "save", label: "Est. savings", value: formatCurrency(420000), change: "vs last buy", trend: "up" },
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DataTable
            data={rows as unknown as Record<string, unknown>[]}
            searchKeys={["id", "item", "status"]}
            searchPlaceholder="Search RFQs..."
            statusKey="status"
            filterKey="status"
            exportName="rfqs"
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
                className="rounded-xl"
                onClick={() =>
                  toast({
                    title: "Awarded to lowest quote",
                    description: "PO draft created from RFQ.",
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
              className="w-full rounded-xl"
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
