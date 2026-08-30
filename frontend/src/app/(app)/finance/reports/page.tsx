"use client";

import { PageHeader } from "@/components/shared/page-header";
import { StatPill } from "@/components/shared/kpi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Download } from "lucide-react";

const pnl = [
  { label: "Export Sales", amount: 98400000 },
  { label: "Domestic Sales", amount: 85800000 },
  { label: "Total Revenue", amount: 184200000, bold: true },
  { label: "COGS — Material", amount: -112400000 },
  { label: "COGS — Labor & Overhead", amount: -25000000 },
  { label: "Gross Profit", amount: 46800000, bold: true },
  { label: "Operating Expenses", amount: -18400000 },
  { label: "Finance Cost", amount: -4200000 },
  { label: "Taxation", amount: -2800000 },
  { label: "Net Profit", amount: 21400000, bold: true },
];

const balance = [
  { label: "Cash & Banks", amount: 29700000 },
  { label: "Receivables", amount: 62500000 },
  { label: "Inventory", amount: 212200000 },
  { label: "Fixed Assets (Net)", amount: 186000000 },
  { label: "Total Assets", amount: 490400000, bold: true },
  { label: "Payables", amount: -38100000 },
  { label: "Loans", amount: -120000000 },
  { label: "Equity", amount: -332300000 },
  { label: "Total Liab. + Equity", amount: -490400000, bold: true },
];

const cashflow = [
  { label: "Operating cash inflow", amount: 48200000 },
  { label: "Operating cash outflow", amount: -35600000 },
  { label: "Net operating", amount: 12600000, bold: true },
  { label: "Capex", amount: -4200000 },
  { label: "Financing", amount: -1800000 },
  { label: "Net change in cash", amount: 6600000, bold: true },
];

function ReportTable({ rows }: { rows: { label: string; amount: number; bold?: boolean }[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--border)]">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.label}
              className={`border-t border-[var(--border)] first:border-0 ${row.bold ? "bg-[var(--surface-muted)]" : ""}`}
            >
              <td className={`px-4 py-3 ${row.bold ? "font-semibold" : ""}`}>{row.label}</td>
              <td
                className={`px-4 py-3 text-right tabular-nums ${row.bold ? "font-semibold" : ""} ${
                  row.amount < 0 ? "text-rose-600" : ""
                }`}
              >
                {formatCurrency(Math.abs(row.amount))}
                {row.amount < 0 ? " (−)" : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function FinanceReportsPage() {
  const { toast } = useToast();

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Financial Reports"
        description="Management P&L, Balance Sheet and Cash Flow for FY 2025-26 (MTD Aug)."
        breadcrumbs={[
          { label: "Finance", href: "/finance" },
          { label: "Reports" },
        ]}
        actions={
          <Button
            onClick={() =>
              toast({ title: "Report exported", description: "Excel pack downloaded (mock).", tone: "success" })
            }
          >
            <Download className="size-4" /> Export pack
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatPill label="Revenue MTD" value="PKR 184.2M" tone="success" />
        <StatPill label="Net Profit" value="PKR 21.4M" tone="info" />
        <StatPill label="Cash Balance" value="PKR 29.7M" />
      </div>

      <Tabs defaultValue="pnl">
        <TabsList>
          <TabsTrigger value="pnl">Profit & Loss</TabsTrigger>
          <TabsTrigger value="bs">Balance Sheet</TabsTrigger>
          <TabsTrigger value="cf">Cash Flow</TabsTrigger>
        </TabsList>
        <TabsContent value="pnl">
          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss — Aug 2026</CardTitle>
            </CardHeader>
            <CardContent>
              <ReportTable rows={pnl} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bs">
          <Card>
            <CardHeader>
              <CardTitle>Balance Sheet — as of 30 Aug 2026</CardTitle>
            </CardHeader>
            <CardContent>
              <ReportTable rows={balance} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cf">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow — Aug 2026</CardTitle>
            </CardHeader>
            <CardContent>
              <ReportTable rows={cashflow} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
