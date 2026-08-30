"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

const workOrders = [
  { id: "MW-112", type: "Preventive", machine: "Knitting Machine-03", machineId: "M-K03", priority: "Medium", status: "In Progress", assignee: "Tariq Mehmood", opened: "2026-08-29", due: "2026-08-30" },
  { id: "MW-113", type: "Breakdown", machine: "Sewing Line-02", machineId: "M-S02", priority: "Critical", status: "Open", assignee: "Kamran Shah", opened: "2026-08-30", due: "2026-08-30" },
  { id: "MW-114", type: "Corrective", machine: "Loom-001", machineId: "M-L001", priority: "High", status: "Scheduled", assignee: "Shift Tech B", opened: "2026-08-28", due: "2026-09-01" },
  { id: "MW-115", type: "Preventive", machine: "Dyeing Machine-01", machineId: "M-D01", priority: "Low", status: "Completed", assignee: "Tariq Mehmood", opened: "2026-08-20", due: "2026-08-21" },
  { id: "MW-116", type: "Breakdown", machine: "Loom-002", machineId: "M-L002", priority: "High", status: "Completed", assignee: "Kamran Shah", opened: "2026-08-15", due: "2026-08-15" },
];

type WORow = (typeof workOrders)[number] & Record<string, unknown>;

const kpis = [
  { id: "open", label: "Open WOs", value: "3", tone: "warning" as const },
  { id: "bd", label: "Breakdowns (MTD)", value: "4", tone: "error" as const },
  { id: "mtbf", label: "MTBF", value: "186 hrs", change: "+12 hrs", trend: "up" as const, tone: "success" as const },
  { id: "mttr", label: "MTTR", value: "2.8 hrs", change: "-0.4 hrs", trend: "down" as const, tone: "success" as const },
  { id: "pm", label: "PM Compliance", value: "94%", change: "+2%", trend: "up" as const },
  { id: "cost", label: "Maint. Cost MTD", value: "PKR 1.2M", tone: "info" as const },
];

const columns: Column<WORow>[] = [
  { key: "id", label: "WO #" },
  {
    key: "type",
    label: "Type",
    render: (row) => (
      <Badge variant={row.type === "Breakdown" ? "error" : row.type === "Preventive" ? "info" : "warning"}>
        {row.type}
      </Badge>
    ),
  },
  {
    key: "machine",
    label: "Machine",
    render: (row) => (
      <Link href={`/machines/${row.machineId}`} className="text-[var(--brand-primary)] hover:underline">
        {row.machine}
      </Link>
    ),
  },
  { key: "priority", label: "Priority" },
  {
    key: "status",
    label: "Status",
    render: (row) => <Badge variant={statusTone(row.status)}>{row.status}</Badge>,
  },
  { key: "assignee", label: "Assignee" },
  { key: "due", label: "Due" },
];

export default function MaintenancePage() {
  const { toast } = useToast();
  const [rows] = useState(workOrders as WORow[]);

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Maintenance"
        description="Preventive, corrective and breakdown work orders with MTBF / MTTR tracking."
        breadcrumbs={[{ label: "Operations" }, { label: "Maintenance" }]}
        actions={
          <Button
            onClick={() =>
              toast({ title: "Work order created", description: "MW-117 drafted for review.", tone: "success" })
            }
          >
            <Plus className="size-4" /> New Work Order
          </Button>
        }
      />

      <KpiGrid items={kpis} columns={6} />

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pm">Preventive</TabsTrigger>
          <TabsTrigger value="corrective">Corrective</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>
        {(["all", "pm", "corrective", "breakdown"] as const).map((tab) => {
          const filtered =
            tab === "all"
              ? rows
              : rows.filter((r) =>
                  tab === "pm"
                    ? r.type === "Preventive"
                    : tab === "corrective"
                      ? r.type === "Corrective"
                      : r.type === "Breakdown",
                );
          return (
            <TabsContent key={tab} value={tab}>
              <DataTable
                data={filtered}
                columns={columns}
                searchKeys={["id", "machine", "assignee", "type", "status"]}
                searchPlaceholder="Search work orders..."
                rowHref={(row) => `/maintenance/${row.id}`}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
