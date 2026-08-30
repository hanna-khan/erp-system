"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { employees, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

const payroll = employees.map((e, i) => ({
  id: e.id,
  name: e.name,
  department: e.department,
  basic: 55000 + i * 8000,
  allowances: 12000 + i * 1500,
  deductions: 4500 + i * 200,
  net: 62500 + i * 9300,
  status: e.status === "On Leave" ? "Hold" : i === 0 ? "Processed" : "Ready",
}));

type PayRow = (typeof payroll)[number] & Record<string, unknown>;

const columns: Column<PayRow>[] = [
  { key: "id", label: "Emp #" },
  { key: "name", label: "Name" },
  { key: "department", label: "Dept" },
  { key: "basic", label: "Basic", render: (r) => formatCurrency(r.basic) },
  { key: "allowances", label: "Allowances", render: (r) => formatCurrency(r.allowances) },
  { key: "deductions", label: "Deductions", render: (r) => formatCurrency(r.deductions) },
  { key: "net", label: "Net", render: (r) => formatCurrency(r.net) },
  {
    key: "status",
    label: "Status",
    render: (r) => <Badge variant={statusTone(r.status)}>{r.status}</Badge>,
  },
];

export default function PayrollPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState(payroll as PayRow[]);
  const total = rows.reduce((s, r) => s + r.net, 0);

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Payroll"
        description="August 2026 payroll run — EOBI, income tax and bank advice."
        breadcrumbs={[
          { label: "HR", href: "/hr" },
          { label: "Payroll" },
        ]}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() =>
                toast({ title: "Bank file exported", description: "Meezan salary file ready.", tone: "success" })
              }
            >
              Export bank file
            </Button>
            <Button
              onClick={() => {
                setRows((prev) => prev.map((r) => ({ ...r, status: r.status === "Hold" ? "Hold" : "Processed" })));
                toast({ title: "Payroll posted", description: "GL JV-2403 created.", tone: "success" });
              }}
            >
              Process payroll
            </Button>
          </>
        }
      />

      <KpiGrid
        items={[
          { id: "net", label: "Net payable", value: formatCurrency(total), tone: "info" },
          { id: "ready", label: "Ready", value: String(rows.filter((r) => r.status === "Ready").length) },
          { id: "hold", label: "On hold", value: String(rows.filter((r) => r.status === "Hold").length), tone: "warning" },
          { id: "tax", label: "Tax withheld", value: "PKR 184K" },
        ]}
        columns={4}
      />

      <DataTable
        data={rows}
        columns={columns}
        searchKeys={["id", "name", "department", "status"]}
        searchPlaceholder="Search payroll..."
      />
    </div>
  );
}
