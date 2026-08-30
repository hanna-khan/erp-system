"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid, StatPill } from "@/components/shared/kpi";
import { DataTable, type Column } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { machines, dashboardKpis, statusTone } from "@/mock/data";
import { formatNumber } from "@/lib/utils";
import { Wrench } from "lucide-react";

type MachineRow = {
  id: string;
  name: string;
  type: string;
  plant: string;
  status: string;
  utilization: number;
  operator: string;
  job: string;
  downtimeHrs: number;
} & Record<string, unknown>;

const columns: Column<MachineRow>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Machine" },
  { key: "type", label: "Type" },
  { key: "plant", label: "Plant" },
  {
    key: "status",
    label: "Status",
    render: (row) => <Badge variant={statusTone(row.status)}>{row.status}</Badge>,
  },
  {
    key: "utilization",
    label: "Util %",
    render: (row) => `${formatNumber(row.utilization)}%`,
  },
  { key: "operator", label: "Operator" },
  {
    key: "job",
    label: "Job",
    render: (row) =>
      row.job !== "—" ? (
        <Link href={`/production/orders/${row.job}`} className="text-[var(--brand-primary)] hover:underline">
          {row.job}
        </Link>
      ) : (
        "—"
      ),
  },
  {
    key: "downtimeHrs",
    label: "Downtime",
    render: (row) => `${row.downtimeHrs}h`,
  },
];

export default function MachinesPage() {
  const [rows, setRows] = useState<MachineRow[]>(machines as MachineRow[]);

  return (
    <div className="animate-fade-in space-y-6 zr-section">
      <PageHeader
        title="Machines"
        description="Live machine status across cutting, print, sewing and finishing lines."
        breadcrumbs={[{ label: "Operations" }, { label: "Machines" }]}
        badge={`${rows.length} assets`}
        actions={
          <>
            <Button variant="outline" asChild className="rounded-xl">
              <Link href="/maintenance">
                <Wrench className="size-4" /> Maintenance
              </Link>
            </Button>
            <CreateRecordDialog
              triggerLabel="Add Machine"
              title="Register machine"
              description="Example: register a new sewing line at SITE Karachi Plant."
              successTitle="Machine registered"
              fields={[
                { name: "name", label: "Machine name", defaultValue: "Sewing Line-04" },
                {
                  name: "type",
                  label: "Type",
                  type: "select",
                  options: ["Cutting Table", "Print Table", "Garment Line", "Finishing Press"],
                  defaultValue: "Garment Line",
                },
                {
                  name: "plant",
                  label: "Plant",
                  type: "select",
                  options: ["SITE Karachi Plant", "Karachi FG Warehouse", "Online Fulfillment Hub"],
                  defaultValue: "SITE Karachi Plant",
                },
                { name: "operator", label: "Operator", defaultValue: "—", required: false },
              ]}
              onCreate={(values) => {
                setRows((prev) => [
                  {
                    id: `M-NEW-${prev.length + 1}`,
                    name: values.name,
                    type: values.type,
                    plant: values.plant,
                    status: "Idle",
                    utilization: 0,
                    operator: values.operator || "—",
                    job: "—",
                    downtimeHrs: 0,
                  },
                  ...prev,
                ]);
              }}
            />
          </>
        }
      />

      <KpiGrid items={dashboardKpis.machines} columns={5} />

      <div className="grid gap-3 sm:grid-cols-4">
        <StatPill label="Running" value={rows.filter((m) => m.status === "Running").length} tone="success" />
        <StatPill label="Idle" value={rows.filter((m) => m.status === "Idle").length} tone="warning" />
        <StatPill label="Maintenance" value={rows.filter((m) => m.status === "Maintenance").length} tone="info" />
        <StatPill label="Breakdown" value={rows.filter((m) => m.status === "Breakdown").length} tone="error" />
      </div>

      <DataTable
        data={rows}
        columns={columns}
        searchKeys={["id", "name", "type", "plant", "status", "operator"]}
        searchPlaceholder="Search machines..."
        rowHref={(row) => `/machines/${row.id}`}
        statusKey="status"
        filterKey="status"
        exportName="machines"
      />
    </div>
  );
}
