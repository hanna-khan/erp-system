"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";

const journals = [
  { id: "JV-2401", date: "2026-08-28", memo: "Cotton purchase — PO-4401", debit: 18500000, credit: 18500000, status: "Posted", user: "Hassan Qureshi" },
  { id: "JV-2402", date: "2026-08-28", memo: "Export invoice SH-5501", debit: 5040000, credit: 5040000, status: "Posted", user: "Hassan Qureshi" },
  { id: "JV-2403", date: "2026-08-29", memo: "Payroll Aug week 4", debit: 6200000, credit: 6200000, status: "Draft", user: "Ayesha Noor" },
  { id: "JV-2404", date: "2026-08-29", memo: "Depreciation run — machines", debit: 1850000, credit: 1850000, status: "Posted", user: "System" },
  { id: "JV-2405", date: "2026-08-30", memo: "Supplier payment SU-503", debit: 1800000, credit: 1800000, status: "Pending Approval", user: "Hassan Qureshi" },
];

type JVRow = (typeof journals)[number] & Record<string, unknown>;

const columns: Column<JVRow>[] = [
  { key: "id", label: "Journal" },
  { key: "date", label: "Date" },
  { key: "memo", label: "Memo" },
  { key: "debit", label: "Debit", render: (r) => formatCurrency(r.debit) },
  { key: "credit", label: "Credit", render: (r) => formatCurrency(r.credit) },
  {
    key: "status",
    label: "Status",
    render: (r) => <Badge variant={statusTone(r.status)}>{r.status}</Badge>,
  },
  { key: "user", label: "User" },
];

export default function GlPage() {
  const { toast } = useToast();

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="General Ledger"
        description="Journal vouchers and postings for FY 2025-26."
        breadcrumbs={[
          { label: "Finance", href: "/finance" },
          { label: "General Ledger" },
        ]}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() =>
                toast({ title: "Trial balance", description: "TB exported for Aug 2026.", tone: "success" })
              }
            >
              Trial balance
            </Button>
            <Button
              onClick={() =>
                toast({ title: "Journal created", description: "JV-2406 draft opened.", tone: "info" })
              }
            >
              <Plus className="size-4" /> New Journal
            </Button>
          </>
        }
      />
      <DataTable
        data={journals as JVRow[]}
        columns={columns}
        searchKeys={["id", "memo", "user", "status"]}
        searchPlaceholder="Search journals..."
      />
    </div>
  );
}
