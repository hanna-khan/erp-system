"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { employees, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";

type EmpRow = (typeof employees)[number] & Record<string, unknown>;

const columns: Column<EmpRow>[] = [
  { key: "id", label: "Employee #" },
  { key: "name", label: "Name" },
  { key: "department", label: "Department" },
  { key: "designation", label: "Designation" },
  { key: "plant", label: "Plant" },
  { key: "shift", label: "Shift" },
  {
    key: "status",
    label: "Status",
    render: (r) => <Badge variant={statusTone(r.status)}>{r.status}</Badge>,
  },
  {
    key: "joinDate",
    label: "Joined",
    render: (r) => formatDate(r.joinDate),
  },
];

export default function EmployeesPage() {
  const { toast } = useToast();

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Employees"
        description="Active workforce across plants."
        breadcrumbs={[
          { label: "HR", href: "/hr" },
          { label: "Employees" },
        ]}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/hr/attendance">Attendance</Link>
            </Button>
            <Button
              onClick={() =>
                toast({ title: "Employee form", description: "Onboarding wizard opened.", tone: "info" })
              }
            >
              <Plus className="size-4" /> Add Employee
            </Button>
          </>
        }
      />

      <DataTable
        data={employees as EmpRow[]}
        columns={columns}
        searchKeys={["id", "name", "department", "designation", "plant", "status"]}
        searchPlaceholder="Search employees..."
        rowHref={(row) => `/hr/employees/${row.id}`}
      />
    </div>
  );
}
