"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { employees, statusTone } from "@/mock/data";
import { formatDate } from "@/lib/utils";

type EmpRow = {
  id: string;
  name: string;
  department: string;
  designation: string;
  plant: string;
  shift: string;
  status: string;
  joinDate: string;
} & Record<string, unknown>;

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
  const [rows, setRows] = useState<EmpRow[]>(employees as EmpRow[]);

  return (
    <div className="animate-fade-in space-y-6 zr-section">
      <PageHeader
        title="Employees"
        description="Active workforce across plants."
        breadcrumbs={[
          { label: "HR", href: "/hr" },
          { label: "Employees" },
        ]}
        actions={
          <>
            <Button variant="outline" asChild className="rounded-xl">
              <Link href="/hr/attendance">Attendance</Link>
            </Button>
            <CreateRecordDialog
              triggerLabel="Add Employee"
              title="Onboard employee"
              description="Example: hire a sewing operator for SITE Karachi Plant Shift A."
              successTitle="Employee added"
              fields={[
                { name: "name", label: "Full name", defaultValue: "New Operator" },
                {
                  name: "department",
                  label: "Department",
                  type: "select",
                  options: ["Production", "Quality", "Cutting", "HR", "Maintenance"],
                  defaultValue: "Production",
                },
                { name: "designation", label: "Designation", defaultValue: "Machine Operator" },
                {
                  name: "plant",
                  label: "Plant",
                  type: "select",
                  options: ["SITE Karachi Plant", "Karachi FG Warehouse", "Online Fulfillment Hub"],
                  defaultValue: "SITE Karachi Plant",
                },
                {
                  name: "shift",
                  label: "Shift",
                  type: "select",
                  options: ["A", "B", "General"],
                  defaultValue: "A",
                },
                { name: "joinDate", label: "Join date", type: "date", defaultValue: "2026-09-01" },
              ]}
              onCreate={(values) => {
                setRows((prev) => [
                  {
                    id: `EMP-${1005 + prev.length}`,
                    name: values.name,
                    department: values.department,
                    designation: values.designation,
                    plant: values.plant,
                    shift: values.shift,
                    status: "Active",
                    joinDate: values.joinDate,
                  },
                  ...prev,
                ]);
              }}
            />
          </>
        }
      />

      <DataTable
        data={rows}
        columns={columns}
        searchKeys={["id", "name", "department", "designation", "plant", "status"]}
        searchPlaceholder="Search employees..."
        rowHref={(row) => `/hr/employees/${row.id}`}
        statusKey="status"
        filterKey="status"
        exportName="employees"
      />
    </div>
  );
}
