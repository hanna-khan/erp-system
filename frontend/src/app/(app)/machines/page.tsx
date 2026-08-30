"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid, StatPill } from "@/components/shared/kpi";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { machines, dashboardKpis, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { formatNumber } from "@/lib/utils";
import { Plus, Wrench } from "lucide-react";

type MachineRow = (typeof machines)[number] & Record<string, unknown>;

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
  const { toast } = useToast();
  const rows = machines as MachineRow[];

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Machines"
        description="Live machine status across weaving, dyeing, knitting and garment lines."
        breadcrumbs={[{ label: "Operations" }, { label: "Machines" }]}
        badge={`${machines.length} assets`}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/maintenance">
                <Wrench className="size-4" /> Maintenance
              </Link>
            </Button>
            <Button
              onClick={() =>
                toast({ title: "Register machine", description: "Machine registration wizard opened.", tone: "info" })
              }
            >
              <Plus className="size-4" /> Add Machine
            </Button>
          </>
        }
      />

      <KpiGrid items={dashboardKpis.machines} columns={5} />

      <div className="grid gap-3 sm:grid-cols-4">
        <StatPill label="Running" value={machines.filter((m) => m.status === "Running").length} tone="success" />
        <StatPill label="Idle" value={machines.filter((m) => m.status === "Idle").length} tone="warning" />
        <StatPill label="Maintenance" value={machines.filter((m) => m.status === "Maintenance").length} tone="info" />
        <StatPill label="Breakdown" value={machines.filter((m) => m.status === "Breakdown").length} tone="error" />
      </div>

      <DataTable
        data={rows}
        columns={columns}
        searchKeys={["id", "name", "type", "plant", "status", "operator"]}
        searchPlaceholder="Search machines..."
        rowHref={(row) => `/machines/${row.id}`}
        statusKey="status"
      />
    </div>
  );
}
