"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

const shifts = [
  { id: "SH-A", name: "Shift A", start: "06:00", end: "14:00", breakMin: 30, plants: "All", headcount: 86, status: "Active" },
  { id: "SH-B", name: "Shift B", start: "14:00", end: "22:00", breakMin: 30, plants: "FSD + LHR", headcount: 64, status: "Active" },
  { id: "SH-C", name: "Shift C", start: "22:00", end: "06:00", breakMin: 30, plants: "SITE Karachi", headcount: 28, status: "Active" },
  { id: "SH-G", name: "General", start: "09:00", end: "18:00", breakMin: 60, plants: "HO + Offices", headcount: 42, status: "Active" },
];

type ShiftRow = (typeof shifts)[number] & Record<string, unknown>;

const columns: Column<ShiftRow>[] = [
  { key: "id", label: "Code" },
  { key: "name", label: "Shift" },
  { key: "start", label: "Start" },
  { key: "end", label: "End" },
  { key: "breakMin", label: "Break (min)" },
  { key: "plants", label: "Plants" },
  { key: "headcount", label: "People" },
  {
    key: "status",
    label: "Status",
    render: (r) => <Badge variant="success">{r.status}</Badge>,
  },
];

export default function ShiftsPage() {
  const { toast } = useToast();

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Shifts"
        description="Production and office shift templates."
        breadcrumbs={[
          { label: "HR", href: "/hr" },
          { label: "Shifts" },
        ]}
        actions={
          <Button
            onClick={() =>
              toast({ title: "Shift template", description: "New shift draft created.", tone: "info" })
            }
          >
            <Plus className="size-4" /> Add Shift
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        {shifts.map((s) => (
          <Card key={s.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{s.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tracking-tight">
                {s.start}–{s.end}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">{s.headcount} assigned · {s.plants}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <DataTable
        data={shifts as ShiftRow[]}
        columns={columns}
        searchKeys={["id", "name", "plants"]}
        searchPlaceholder="Search shifts..."
        selectable={false}
      />
    </div>
  );
}
