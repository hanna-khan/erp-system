"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

const accounts = [
  { code: "1000", name: "Assets", type: "Header", balance: 0, status: "Active", parent: "—" },
  { code: "1100", name: "Cash & Banks", type: "Header", balance: 0, status: "Active", parent: "1000" },
  { code: "1101", name: "HBL Operating PKR", type: "Asset", balance: 18750000, status: "Active", parent: "1100" },
  { code: "1102", name: "Meezan Export USD", type: "Asset", balance: 9200000, status: "Active", parent: "1100" },
  { code: "1200", name: "Accounts Receivable", type: "Asset", balance: 62500000, status: "Active", parent: "1000" },
  { code: "1300", name: "Inventory", type: "Asset", balance: 212200000, status: "Active", parent: "1000" },
  { code: "2000", name: "Liabilities", type: "Header", balance: 0, status: "Active", parent: "—" },
  { code: "2100", name: "Accounts Payable", type: "Liability", balance: 38100000, status: "Active", parent: "2000" },
  { code: "2200", name: "Sales Tax Payable", type: "Liability", balance: 4200000, status: "Active", parent: "2000" },
  { code: "4000", name: "Revenue — Export Sales", type: "Income", balance: 98400000, status: "Active", parent: "—" },
  { code: "4100", name: "Revenue — Domestic Sales", type: "Income", balance: 85800000, status: "Active", parent: "—" },
  { code: "5000", name: "COGS — Material", type: "Expense", balance: 112400000, status: "Active", parent: "—" },
];

type AccRow = (typeof accounts)[number] & Record<string, unknown>;

const columns: Column<AccRow>[] = [
  { key: "code", label: "Code" },
  { key: "name", label: "Account" },
  { key: "type", label: "Type" },
  { key: "parent", label: "Parent" },
  {
    key: "balance",
    label: "Balance",
    render: (row) =>
      row.type === "Header"
        ? "—"
        : new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(
            row.balance,
          ),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => <Badge variant="success">{row.status}</Badge>,
  },
];

export default function CoaPage() {
  const { toast } = useToast();

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Chart of Accounts"
        description="Control accounts aligned to textile cost centers and PKR statutory needs."
        breadcrumbs={[
          { label: "Finance", href: "/finance" },
          { label: "Chart of Accounts" },
        ]}
        actions={
          <Button
            onClick={() =>
              toast({ title: "Account added", description: "Draft account awaiting approval.", tone: "success" })
            }
          >
            <Plus className="size-4" /> Add Account
          </Button>
        }
      />
      <DataTable
        data={accounts as AccRow[]}
        columns={columns}
        searchKeys={["code", "name", "type"]}
        searchPlaceholder="Search accounts..."
        pageSize={12}
      />
    </div>
  );
}
