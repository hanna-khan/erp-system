"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dashboardKpis } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  FileSpreadsheet,
  Landmark,
  Receipt,
  Scale,
  Wallet,
} from "lucide-react";

const modules = [
  { href: "/finance/coa", title: "Chart of Accounts", desc: "Account groups, control accounts, cost centers.", icon: BookOpen },
  { href: "/finance/gl", title: "General Ledger", desc: "Journal entries, postings, trial balance.", icon: FileSpreadsheet },
  { href: "/finance/ar", title: "Accounts Receivable", desc: "Customer invoices, receipts, aging.", icon: Wallet },
  { href: "/finance/ap", title: "Accounts Payable", desc: "Supplier bills, payments, aging.", icon: Receipt },
  { href: "/finance/reports", title: "Financial Reports", desc: "P&L, Balance Sheet, Cash Flow.", icon: Scale },
  { href: "/assets", title: "Fixed Assets", desc: "Register, depreciation, disposal.", icon: Landmark },
];

export default function FinancePage() {
  const { toast } = useToast();

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Finance"
        description="Cocoon Clothing financial control — GL, AR/AP, tax (PKR) and statutory reports."
        breadcrumbs={[{ label: "Finance" }]}
        actions={
          <Button
            onClick={() =>
              toast({ title: "Period close checklist", description: "August 2026 soft-close started.", tone: "info" })
            }
          >
            Period close
          </Button>
        }
      />

      <KpiGrid items={dashboardKpis.financial} columns={6} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((m) => (
          <Link key={m.href} href={m.href} className="group">
            <Card className="h-full transition-shadow hover:shadow-[var(--shadow-sm)]">
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
                  <m.icon className="size-5" />
                </div>
                <CardTitle className="group-hover:text-[var(--brand-primary)]">{m.title}</CardTitle>
                <CardDescription>{m.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-xs font-semibold text-[var(--brand-primary)]">Open module →</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
