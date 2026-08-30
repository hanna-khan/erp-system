"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Download, Factory, Package, Play, Shield, Users, Wallet } from "lucide-react";

const categories = [
  { id: "prod", title: "Production", desc: "Efficiency, OEE, WIP aging, style completion.", icon: Factory, href: "/production", reports: ["Daily production summary", "Machine utilization", "Style vs target"] },
  { id: "inv", title: "Inventory", desc: "Stock valuation, slow movers, batch trace.", icon: Package, href: "/inventory", reports: ["Stock valuation", "Low stock", "Batch ledger"] },
  { id: "fin", title: "Finance", desc: "Profit and loss, AR aging, cost sheets.", icon: Wallet, href: "/finance/reports", reports: ["P and L MTD", "AR aging", "Cost variance"] },
  { id: "hr", title: "HR", desc: "Attendance, OT, headcount by plant.", icon: Users, href: "/hr", reports: ["Attendance register", "OT summary", "Payroll cost"] },
  { id: "qc", title: "Quality", desc: "Defect Pareto, NCR aging, fabric points.", icon: Shield, href: "/quality", reports: ["Defect Pareto", "NCR status", "AQL summary"] },
  { id: "exec", title: "Executive", desc: "KPI pack for CEO / board.", icon: BarChart3, href: "/dashboard", reports: ["KPI dashboard PDF", "Revenue trend", "Order book"] },
];

export default function ReportsPage() {
  const { toast } = useToast();
  const run = (name: string) => toast({ title: "Report running", description: name + " queued (mock).", tone: "info" });
  const exp = (name: string) => toast({ title: "Export ready", description: name + " Excel downloaded.", tone: "success" });

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Reports" description="Run operational and financial packs across textile modules." breadcrumbs={[{ label: "Reports" }]} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((c) => (
          <Card key={c.id} className="flex flex-col">
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
                <c.icon className="size-5" />
              </div>
              <CardTitle>{c.title}</CardTitle>
              <CardDescription>{c.desc}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto space-y-3">
              <ul className="space-y-1 text-sm text-[var(--muted)]">
                {c.reports.map((r) => (
                  <li key={r} className="flex items-center justify-between gap-2">
                    <span>{r}</span>
                    <span className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => run(r)}><Play className="size-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => exp(r)}><Download className="size-3.5" /></Button>
                    </span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="sm" asChild className="w-full"><Link href={c.href}>Open module</Link></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
