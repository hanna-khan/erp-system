"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { WorkflowStepper } from "@/components/shared/workflow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  dashboardKpis,
  dyeingWorkflow,
  productionOrders,
  statusTone,
  tshirtWorkflow,
  weavingWorkflow,
  workOrders,
} from "@/mock/data";
import { formatNumber, formatPercent } from "@/lib/utils";
import { ClipboardList, IdCard, Plus, Wrench } from "lucide-react";

export default function ProductionHubPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Production"
        description="Spinning, weaving, dyeing and garments orders with live efficiency."
        breadcrumbs={[{ label: "Manufacturing" }, { label: "Production" }]}
        badge="MES-ready"
        actions={
          <Button
            onClick={() =>
              toast({
                title: "Production order created",
                description: "PRO-7005 drafted from SO-1028.",
                tone: "success",
              })
            }
          >
            <Plus className="size-4" /> New PRO
          </Button>
        }
      />

      <KpiGrid items={dashboardKpis.production} columns={6} />

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { href: "/production/orders", label: "Production orders", icon: ClipboardList },
          { href: "/production/work-orders", label: "Work orders", icon: Wrench },
          { href: "/production/job-cards", label: "Job cards", icon: IdCard },
        ].map((m) => (
          <Link key={m.href} href={m.href} className="zr-card flex items-center gap-3 p-4 hover:shadow-[var(--shadow-sm)]">
            <m.icon className="size-5 text-[var(--brand-primary)]" />
            <span className="text-sm font-semibold">{m.label}</span>
          </Link>
        ))}
      </div>

      <TabsWorkflows />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DataTable
            data={productionOrders as unknown as Record<string, unknown>[]}
            searchKeys={["id", "product", "process", "plant", "status", "so"]}
            searchPlaceholder="Search production orders..."
            statusKey="status"
            rowHref={(row) => `/production/orders/${row.id}`}
            columns={[
              { key: "id", label: "PRO" },
              { key: "product", label: "Product" },
              { key: "process", label: "Process" },
              {
                key: "qty",
                label: "Progress",
                render: (row) =>
                  `${formatNumber(Number(row.completed))} / ${formatNumber(Number(row.qty))}`,
              },
              {
                key: "efficiency",
                label: "Eff.",
                render: (row) => formatPercent(Number(row.efficiency)),
              },
              { key: "plant", label: "Plant" },
              { key: "status", label: "Status" },
            ]}
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Active work orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workOrders.map((wo) => (
              <Link
                key={wo.id}
                href="/production/work-orders"
                className="block rounded-xl border border-[var(--border)] p-3 hover:bg-[var(--sidebar-hover)]"
              >
                <div className="flex justify-between gap-2">
                  <p className="text-sm font-medium">{wo.operation}</p>
                  <Badge variant={statusTone(wo.status)}>{wo.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {wo.id} · {wo.productionOrder} · {formatNumber(wo.actual)}/{formatNumber(wo.target)}
                </p>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TabsWorkflows() {
  return (
    <div className="space-y-3">
      <WorkflowStepper title="Garments · T-shirt (SO-1024)" steps={tshirtWorkflow.slice(5, 10)} />
      <div className="grid gap-3 lg:grid-cols-2">
        <WorkflowStepper title="Weaving flow" steps={weavingWorkflow.slice(0, 5)} />
        <WorkflowStepper title="Dyeing flow" steps={dyeingWorkflow.slice(0, 5)} />
      </div>
    </div>
  );
}
