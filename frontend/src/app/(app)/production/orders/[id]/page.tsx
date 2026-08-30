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
import {
  bomLines,
  colorSizeMatrix,
  processTemplates,
  productionOrders,
  statusTone,
  tshirtWorkflow,
  workOrders,
} from "@/mock/data";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import type { WorkflowStep } from "@/types";

export default function ProductionOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { toast } = useToast();
  const order = productionOrders.find((p) => p.id === id);
  if (!order) notFound();

  const isTshirt = order.id === "PRO-7001";
  const pct = Math.round((order.completed / order.qty) * 100);
  const relatedWo = workOrders.filter((w) => w.productionOrder === order.id);
  const template =
    processTemplates.find((p) => p.name === order.process) ||
    processTemplates.find((p) => p.id === "PT-GAR");

  const routingSteps: WorkflowStep[] =
    isTshirt
      ? [
          { id: "r1", label: "Cutting", status: "completed", meta: "10,000 pcs", href: "/production/work-orders" },
          { id: "r2", label: "Stitching", status: "current", meta: "4,200 pcs", href: "/production/work-orders" },
          { id: "r3", label: "Finishing", status: "upcoming", meta: "Queued" },
          { id: "r4", label: "Packing", status: "upcoming", meta: "Pending" },
          { id: "r5", label: "Final QC", status: "upcoming", href: "/quality/inspections", meta: "QC-1202" },
          { id: "r6", label: "FG Put-away", status: "upcoming", href: "/warehouse", meta: "KHI-FG-01" },
        ]
      : (template?.steps ?? ["Start", "Process", "Finish"]).map((label, i, arr) => ({
          id: `r${i}`,
          label,
          status:
            order.status === "Completed"
              ? ("completed" as const)
              : i < Math.floor((pct / 100) * arr.length)
                ? ("completed" as const)
                : i === Math.floor((pct / 100) * arr.length)
                  ? ("current" as const)
                  : ("upcoming" as const),
          meta: order.process,
        }));

  const materials = isTshirt
    ? bomLines.map((b) => ({
        ...b,
        required: Math.ceil(b.qty * order.qty * (1 + (b.scrap + b.waste) / 100)),
        issued: b.component.includes("Hang") || b.component.includes("Tag")
          ? 1250
          : b.component.includes("Fabric")
            ? Math.round(b.qty * order.completed)
            : Math.round(b.qty * order.completed * 0.9),
      }))
    : [
        {
          id: "1",
          component: order.product.includes("Lawn") || order.product.includes("Fabric") ? "Printed Lawn Fabric (60\")" : "Process input",
          qty: 1,
          unit: "MTR",
          scrap: 2,
          waste: 1,
          cost: 350,
          required: order.qty,
          issued: order.completed,
        },
      ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={order.id}
        description={`${order.product} · ${order.process} · ${order.plant}`}
        badge={order.status}
        breadcrumbs={[
          { label: "Production", href: "/production" },
          { label: "Orders", href: "/production/orders" },
          { label: order.id },
        ]}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() =>
                toast({
                  title: "Job cards printed",
                  description: `Floor packets for ${order.id}.`,
                  tone: "info",
                })
              }
            >
              Print job cards
            </Button>
            <Button
              onClick={() =>
                toast({
                  title: "Progress posted",
                  description: `Stitching +200 pcs on ${order.id}.`,
                  tone: "success",
                })
              }
            >
              Post production
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <StatPill label="Target" value={formatNumber(order.qty)} />
        <StatPill label="Completed" value={formatNumber(order.completed)} tone="info" />
        <StatPill label="Progress" value={`${pct}%`} tone={pct > 80 ? "success" : "warning"} />
        <StatPill label="Efficiency" value={formatPercent(order.efficiency)} tone="success" />
        <StatPill label="Sales order" value={order.so} />
        <StatPill label="Window" value={`${order.start} → ${order.finish}`} />
      </div>

      {isTshirt ? (
        <WorkflowStepper title="End-to-end Prism Kaftaan program" steps={tshirtWorkflow} />
      ) : null}

      <WorkflowStepper title="Routing / operations" steps={routingSteps} />

      <div className="mb-2">
        <div className="mb-1 flex justify-between text-xs text-[var(--muted)]">
          <span>Order completion</span>
          <span className="font-semibold text-[var(--foreground)]">{pct}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-[var(--surface-muted)]">
          <div
            className="h-full rounded-full bg-[var(--brand-primary)] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <Tabs defaultValue={isTshirt ? "matrix" : "bom"}>
        <TabsList>
          {isTshirt ? <TabsTrigger value="matrix">Color × Size</TabsTrigger> : null}
          <TabsTrigger value="bom">BOM / Materials</TabsTrigger>
          <TabsTrigger value="routing">Work orders</TabsTrigger>
          <TabsTrigger value="status">Status & timeline</TabsTrigger>
        </TabsList>

        {isTshirt ? (
          <TabsContent value="matrix">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>Style {colorSizeMatrix.style}</CardTitle>
                  <p className="text-sm text-[var(--muted)]">Prism Kaftaan 2-Piece · SITE Karachi garments flow</p>
                </div>
                <Badge variant="info">Garments</Badge>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead className="text-[11px] uppercase tracking-wider text-[var(--muted)]">
                    <tr>
                      <th className="px-3 py-2 text-left">Color</th>
                      {colorSizeMatrix.sizes.map((s) => (
                        <th key={s} className="px-3 py-2 text-right">{s}</th>
                      ))}
                      <th className="px-3 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {colorSizeMatrix.colors.map((color) => {
                      const row = colorSizeMatrix.quantities[color];
                      const total = colorSizeMatrix.sizes.reduce((s, sz) => s + (row[sz] ?? 0), 0);
                      return (
                        <tr key={color} className="border-t border-[var(--border)]">
                          <td className="px-3 py-2.5 font-medium">{color}</td>
                          {colorSizeMatrix.sizes.map((sz) => (
                            <td key={sz} className="px-3 py-2.5 text-right tabular-nums">
                              {formatNumber(row[sz] ?? 0)}
                            </td>
                          ))}
                          <td className="px-3 py-2.5 text-right font-semibold">{formatNumber(total)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href="/procurement/orders/PO-4404">
                    <Button size="sm" variant="outline">Labels PO-4404</Button>
                  </Link>
                  <Link href="/quality/inspections/QC-1202">
                    <Button size="sm" variant="outline">In-process QC</Button>
                  </Link>
                  <Link href="/costing/sheets/CS-TS-27">
                    <Button size="sm" variant="outline">Cost sheet</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ) : null}

        <TabsContent value="bom">
          <Card>
            <CardHeader>
              <CardTitle>Bill of materials & issue status</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="text-[11px] uppercase tracking-wider text-[var(--muted)]">
                  <tr>
                    <th className="px-2 py-2 text-left">Component</th>
                    <th className="px-2 py-2 text-right">Per unit</th>
                    <th className="px-2 py-2 text-right">Required</th>
                    <th className="px-2 py-2 text-right">Issued</th>
                    <th className="px-2 py-2 text-right">Std cost</th>
                    <th className="px-2 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((m) => {
                    const short = m.issued < m.required;
                    return (
                      <tr key={m.id} className="border-t border-[var(--border)]">
                        <td className="px-2 py-3 font-medium">{m.component}</td>
                        <td className="px-2 py-3 text-right">
                          {m.qty} {m.unit}
                        </td>
                        <td className="px-2 py-3 text-right">{formatNumber(m.required)}</td>
                        <td className="px-2 py-3 text-right">{formatNumber(m.issued)}</td>
                        <td className="px-2 py-3 text-right">{formatCurrency(m.cost)}</td>
                        <td className="px-2 py-3">
                          <Badge variant={short ? "warning" : "success"}>
                            {short ? "Shortage / partial" : "Covered"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {isTshirt ? (
                <p className="mt-3 text-xs text-[var(--muted)]">
                  Neck labels short — see{" "}
                  <Link href="/planning/mrp" className="text-[var(--brand-primary)] hover:underline">
                    MRP
                  </Link>{" "}
                  and incoming{" "}
                  <Link href="/procurement/orders/PO-4404" className="text-[var(--brand-primary)] hover:underline">
                    PO-4404
                  </Link>
                  .
                </p>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routing">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Work orders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(relatedWo.length ? relatedWo : workOrders.slice(0, 1)).map((wo) => (
                  <div key={wo.id} className="rounded-xl border border-[var(--border)] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-medium">{wo.operation}</p>
                        <p className="text-xs text-[var(--muted)]">
                          {wo.id} · {wo.workCenter} · {wo.operator}
                        </p>
                      </div>
                      <Badge variant={statusTone(wo.status)}>{wo.status}</Badge>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                      <div
                        className="h-full rounded-full bg-[var(--brand-primary)]"
                        style={{ width: `${Math.min(100, (wo.actual / wo.target) * 100)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {formatNumber(wo.actual)} / {formatNumber(wo.target)}
                    </p>
                  </div>
                ))}
                <Link href="/production/work-orders">
                  <Button variant="outline" size="sm" className="w-full">
                    All work orders
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Process template · {template?.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {(template?.steps ?? []).map((step, i) => (
                    <li
                      key={step}
                      className="flex items-center gap-3 rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                    >
                      <span className="flex size-6 items-center justify-center rounded-full bg-[var(--brand-primary-soft)] text-[11px] font-bold text-[var(--brand-primary)]">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Order timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline
                events={
                  isTshirt
                    ? [
                        { id: "1", title: "PRO created from SO-1024", meta: "Farhan Siddiqui", time: "2026-08-21 08:40" },
                        { id: "2", title: "BOM CCN-KAFT-PRISM locked", meta: "Fabric + trims", time: "2026-08-22" },
                        { id: "3", title: "Cutting completed", meta: "WO-9101 · 10,000 pcs", time: "2026-08-26" },
                        { id: "4", title: "Stitching in progress", meta: "WO-9102 · 42% · Line-01", time: "2026-08-29" },
                        { id: "5", title: "In-process QC conditional", meta: "QC-1202 · 42 defects", time: "2026-08-29" },
                        { id: "6", title: "Labels inbound (PO-4404)", meta: "ETA 2026-09-08", time: "Awaiting" },
                      ]
                    : [
                        { id: "1", title: `${order.id} ${order.status}`, meta: order.plant, time: order.start },
                        { id: "2", title: "Materials issued", meta: order.process, time: order.start },
                        { id: "3", title: "Progress update", meta: `${pct}% complete`, time: "Today" },
                      ]
                }
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
