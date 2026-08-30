"use client";

import { use } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatPill } from "@/components/shared/kpi";
import { Timeline, WorkflowStepper } from "@/components/shared/workflow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import {
  auditTrail,
  colorSizeMatrix,
  salesOrders,
  statusTone,
  tshirtWorkflow,
} from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import type { WorkflowStep } from "@/types";
import { Check, Factory, FileCheck } from "lucide-react";

const orderLifecycle: WorkflowStep[] = [
  { id: "draft", label: "Draft", status: "completed", meta: "Created" },
  { id: "approve", label: "Approved", status: "completed", meta: "CEO" },
  { id: "mrp", label: "MRP", status: "completed", meta: "Shortage labels" },
  { id: "prod", label: "Production", status: "current", meta: "PRO-7001" },
  { id: "qc", label: "QC", status: "upcoming", meta: "Final" },
  { id: "dispatch", label: "Dispatch", status: "upcoming", meta: "DO" },
  { id: "invoice", label: "Invoice", status: "upcoming", meta: "AR" },
];

function matrixTotal() {
  return Object.values(colorSizeMatrix.quantities).reduce(
    (sum, sizes) => sum + Object.values(sizes).reduce((a, b) => a + b, 0),
    0,
  );
}

export default function SalesOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { toast } = useToast();
  const order = salesOrders.find((o) => o.id === id);
  const isRich = id === "SO-1024" || (!order && id === "SO-1024");
  const so = order ?? salesOrders[0];
  const rich = so.id === "SO-1024";

  const approvalSteps = rich
    ? [
        { role: "Sales Manager", user: "Zainab Rizvi", status: "Approved", at: "2026-08-20 09:30" },
        { role: "Finance", user: "Hassan Qureshi", status: "Approved", at: "2026-08-20 10:15" },
        { role: "CEO", user: "Imran Malik", status: "Approved", at: "2026-08-20 11:05" },
      ]
    : [
        { role: "Sales Manager", user: "Zainab Rizvi", status: so.status === "Approved" || so.status === "In Production" || so.status === "Delivered" || so.status === "Partial Delivery" ? "Approved" : "Pending", at: "—" },
        { role: "Finance", user: "Hassan Qureshi", status: so.status === "Overdue" || so.status === "Draft" ? "Pending" : "Approved", at: "—" },
      ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={so.id}
        description={`${so.customer} · ${so.product} · Style ${so.style}`}
        badge={so.status}
        breadcrumbs={[
          { label: "Sales", href: "/sales" },
          { label: "Orders", href: "/sales/orders" },
          { label: so.id },
        ]}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast({ title: "PDF generated", description: `${so.id} commercial copy.`, tone: "info" })
              }
            >
              Print PDF
            </Button>
            <Button
              size="sm"
              onClick={() =>
                toast({
                  title: "Approval submitted",
                  description: "Waiting for next approver.",
                  tone: "success",
                })
              }
            >
              <FileCheck className="size-3.5" /> Submit approval
            </Button>
          </>
        }
      />

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <StatPill label="Order value" value={formatCurrency(so.value)} tone="info" />
        <StatPill label="Quantity" value={`${formatNumber(so.qty)} ${so.unit}`} />
        <StatPill label="Delivered" value={formatNumber(so.delivered)} tone={so.delivered > 0 ? "success" : "default"} />
        <StatPill label="Delivery date" value={formatDate(so.deliveryDate)} tone={so.status === "Overdue" ? "error" : "default"} />
        <StatPill label="Plant" value={so.plant} />
      </div>

      <WorkflowStepper steps={rich ? tshirtWorkflow : orderLifecycle} title={rich ? "End-to-end T-shirt workflow" : "Order lifecycle"} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="zr-card space-y-4 p-5 lg:col-span-2">
          <p className="zr-label">Textile attributes</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Style", so.style],
              ["Fabric / product", so.product],
              ["Colorway", so.color],
              ["GSM", String(so.gsm)],
              ["Composition", rich ? "100% Cotton jersey" : "As per style"],
              ["Wash / finish", rich ? "Softener + silicone" : "Standard"],
              ["Packing", rich ? "1 pc polybag · 24/carton" : "Standard export"],
              ["Incoterms", rich ? "FOB Karachi" : so.customer.includes("Export") ? "CIF" : "Ex-Works"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">{label}</p>
                <p className="mt-0.5 text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>

          {rich ? (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold">Color × size matrix summary</p>
                <Link href="/products/matrix" className="text-xs text-[var(--brand-primary)] hover:underline">
                  Open matrix
                </Link>
              </div>
              <p className="mb-3 text-xs text-[var(--muted)]">
                Style {colorSizeMatrix.style} · Total {formatNumber(matrixTotal())} pcs
              </p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-xs">
                  <thead className="text-[var(--muted)]">
                    <tr>
                      <th className="pb-2 pr-3">Color</th>
                      {colorSizeMatrix.sizes.map((s) => (
                        <th key={s} className="pb-2 px-2 text-center">
                          {s}
                        </th>
                      ))}
                      <th className="pb-2 pl-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {colorSizeMatrix.colors.map((color) => {
                      const row = colorSizeMatrix.quantities[color];
                      const total = Object.values(row).reduce((a, b) => a + b, 0);
                      return (
                        <tr key={color} className="border-t border-[var(--border)]">
                          <td className="py-2 pr-3 font-medium">{color}</td>
                          {colorSizeMatrix.sizes.map((s) => (
                            <td key={s} className="px-2 py-2 text-center">
                              {formatNumber(row[s] ?? 0)}
                            </td>
                          ))}
                          <td className="py-2 pl-2 text-right font-semibold">{formatNumber(total)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted)]">
              Size matrix not expanded for this order. Color: {so.color}, GSM {so.gsm}.
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="zr-card p-5">
            <p className="zr-label mb-3">Production link</p>
            {rich || so.id === "SO-1024" ? (
              <Link
                href="/production/orders/PRO-7001"
                className="flex items-center gap-3 rounded-xl border border-[var(--brand-primary)]/20 bg-[var(--brand-primary-soft)] px-3 py-3 text-sm font-medium text-[var(--brand-primary)] hover:underline"
              >
                <Factory className="size-4" />
                PRO-7001 · 42% complete
              </Link>
            ) : (
              <p className="text-sm text-[var(--muted)]">
                {so.status === "Approved" || so.status === "In Production" || so.status === "Partial Delivery"
                  ? "Linked production order available in Manufacturing."
                  : "No production order released yet."}
              </p>
            )}
            <Button asChild variant="outline" size="sm" className="mt-3 w-full">
              <Link href="/workflows">View demo workflows</Link>
            </Button>
          </div>

          <div className="zr-card p-5">
            <p className="zr-label mb-3">Approvals</p>
            <div className="space-y-3">
              {approvalSteps.map((step) => (
                <div key={step.role} className="flex items-start gap-2">
                  <span
                    className={`mt-0.5 flex size-6 items-center justify-center rounded-full ${
                      step.status === "Approved"
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <Check className="size-3.5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{step.role}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {step.user} · {step.status}
                      {step.at !== "—" ? ` · ${step.at}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="audit">
        <TabsList>
          <TabsTrigger value="audit">Audit trail</TabsTrigger>
          <TabsTrigger value="lines">Line details</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="audit">
          <div className="zr-card p-5">
            <Timeline
              events={(rich ? auditTrail : auditTrail.slice(0, 2)).map((e) => ({
                id: e.id,
                title: e.action,
                meta: `${e.user}${e.newValue ? ` · ${e.newValue}` : ""}`,
                time: e.timestamp,
              }))}
            />
          </div>
        </TabsContent>
        <TabsContent value="lines">
          <div className="zr-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[var(--surface-muted)] text-[11px] uppercase tracking-wider text-[var(--muted)]">
                <tr>
                  <th className="px-4 py-3 text-left">Line</th>
                  <th className="px-4 py-3 text-left">SKU / Style</th>
                  <th className="px-4 py-3 text-left">Color</th>
                  <th className="px-4 py-3 text-left">Qty</th>
                  <th className="px-4 py-3 text-left">Rate</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-[var(--border)]">
                  <td className="px-4 py-3">1</td>
                  <td className="px-4 py-3">
                    {so.style} · {so.product}
                  </td>
                  <td className="px-4 py-3">{so.color}</td>
                  <td className="px-4 py-3">
                    {formatNumber(so.qty)} {so.unit}
                  </td>
                  <td className="px-4 py-3">{formatCurrency(Math.round(so.value / so.qty))}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(so.value)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="notes">
          <div className="zr-card p-5 text-sm text-[var(--muted)]">
            {rich ? (
              <ul className="list-disc space-y-2 pl-5">
                <li>Customer requires carton stamp with SS27 season code.</li>
                <li>Neck labels PO-4404 must arrive before finishing release.</li>
                <li>Partial shipment allowed after 5,000 pcs QC pass.</li>
              </ul>
            ) : (
              <p>No special packing notes recorded for {so.id}.</p>
            )}
            <div className="mt-4">
              <Badge variant={statusTone(so.status)}>{so.status}</Badge>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
