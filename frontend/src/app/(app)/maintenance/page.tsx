"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable, type Column } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { statusTone } from "@/mock/data";

const workOrders = [
  { id: "MW-112", type: "Preventive", machine: "Finishing Press-01", machineId: "M-F01", priority: "Medium", status: "In Progress", assignee: "Tariq Mehmood", opened: "2026-08-29", due: "2026-08-30" },
  { id: "MW-113", type: "Breakdown", machine: "Sewing Line-02", machineId: "M-S02", priority: "Critical", status: "Open", assignee: "Junaid Ansari", opened: "2026-08-30", due: "2026-08-30" },
  { id: "MW-114", type: "Corrective", machine: "Cutting Table-01", machineId: "M-C01", priority: "High", status: "Scheduled", assignee: "Shift Tech B", opened: "2026-08-28", due: "2026-09-01" },
  { id: "MW-115", type: "Preventive", machine: "Print Table-01", machineId: "M-P01", priority: "Low", status: "Completed", assignee: "Tariq Mehmood", opened: "2026-08-20", due: "2026-08-21" },
  { id: "MW-116", type: "Breakdown", machine: "Sewing Line-03", machineId: "M-S03", priority: "High", status: "Completed", assignee: "Junaid Ansari", opened: "2026-08-15", due: "2026-08-15" },
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
  const [rows, setRows] = useState(workOrders as WORow[]);

  return (
    <div className="animate-fade-in space-y-6 zr-section">
      <PageHeader
        title="Maintenance"
        description="Preventive, corrective and breakdown work orders with MTBF / MTTR tracking."
        breadcrumbs={[{ label: "Operations" }, { label: "Maintenance" }]}
        actions={
          <CreateRecordDialog
            triggerLabel="New Work Order"
            title="Create maintenance work order"
            description="Example: preventive service on a dyeing machine before the next navy lot."
            successTitle="Work order created"
            fields={[
              {
                name: "type",
                label: "Type",
                type: "select",
                options: ["Preventive", "Corrective", "Breakdown"],
                defaultValue: "Preventive",
              },
              {
                name: "machine",
                label: "Machine",
                type: "select",
                options: ["Finishing Press-01", "Sewing Line-02", "Cutting Table-01", "Print Table-01", "Sewing Line-03"],
                defaultValue: "Print Table-01",
              },
              {
                name: "priority",
                label: "Priority",
                type: "select",
                options: ["Low", "Medium", "High", "Critical"],
                defaultValue: "Medium",
              },
              { name: "assignee", label: "Assignee", defaultValue: "Tariq Mehmood" },
              { name: "due", label: "Due date", type: "date", defaultValue: "2026-09-05" },
            ]}
            onCreate={(values) => {
              const machineIds: Record<string, string> = {
                "Finishing Press-01": "M-F01",
                "Sewing Line-02": "M-S02",
                "Cutting Table-01": "M-C01",
                "Print Table-01": "M-P01",
                "Sewing Line-03": "M-S03",
              };
              setRows((prev) => [
                {
                  id: `MW-${116 + prev.length}`,
                  type: values.type,
                  machine: values.machine,
                  machineId: machineIds[values.machine] ?? "M-C01",
                  priority: values.priority,
                  status: "Open",
                  assignee: values.assignee,
                  opened: "2026-08-30",
                  due: values.due,
                },
                ...prev,
              ]);
            }}
          />
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
                statusKey="status"
                filterKey="status"
                exportName="maintenance-work-orders"
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
