"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { employees, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";

const attendance = employees.map((e, i) => ({
  id: e.id,
  name: e.name,
  plant: e.plant,
  shift: e.shift,
  in: e.status === "On Leave" ? "—" : `0${6 + (i % 2)}:${String(i * 3).padStart(2, "0")}`,
  out: e.status === "On Leave" ? "—" : "14:05",
  hours: e.status === "On Leave" ? 0 : 8 + (i % 3) * 0.5,
  status: e.status === "On Leave" ? "Leave" : i === 2 ? "Late" : "Present",
}));

type AttRow = (typeof attendance)[number] & Record<string, unknown>;

const columns: Column<AttRow>[] = [
  {
    key: "id",
    label: "Employee",
    render: (r) => (
      <Link href={`/hr/employees/${r.id}`} className="font-medium text-[var(--brand-primary)] hover:underline">
        {r.name}
      </Link>
    ),
  },
  { key: "plant", label: "Plant" },
  { key: "shift", label: "Shift" },
  { key: "in", label: "In" },
  { key: "out", label: "Out" },
  { key: "hours", label: "Hours" },
  {
    key: "status",
    label: "Status",
    render: (r) => <Badge variant={statusTone(r.status)}>{r.status}</Badge>,
  },
];

export default function AttendancePage() {
  const { toast } = useToast();
  const [rows] = useState(attendance as AttRow[]);

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Attendance"
        description="Daily attendance across plants — soft sync from biometric devices."
        breadcrumbs={[
          { label: "HR", href: "/hr" },
          { label: "Attendance" },
        ]}
        actions={
          <Button
            onClick={() =>
              toast({ title: "Devices synced", description: "1,842 punches imported.", tone: "success" })
            }
          >
            Sync devices
          </Button>
        }
      />

      <KpiGrid
        items={[
          { id: "p", label: "Present", value: String(rows.filter((r) => r.status === "Present").length), tone: "success" },
          { id: "l", label: "Late", value: String(rows.filter((r) => r.status === "Late").length), tone: "warning" },
          { id: "lv", label: "Leave", value: String(rows.filter((r) => r.status === "Leave").length), tone: "info" },
          { id: "ot", label: "OT today", value: "86 hrs" },
        ]}
        columns={4}
      />

      <DataTable
        data={rows}
        columns={columns}
        searchKeys={["id", "name", "plant", "status"]}
        searchPlaceholder="Search attendance..."
      />
    </div>
  );
}
