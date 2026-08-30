import fs from "fs";
import path from "path";

const base = path.resolve("src/app");

function write(rel, content) {
  const full = path.join(base, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trimStart());
  console.log("wrote", rel);
}

write(
  "(app)/reports/page.tsx",
  `"use client";

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
`
);

write(
  "(app)/notifications/page.tsx",
  `"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { notifications } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Bell, CheckCheck } from "lucide-react";

export default function NotificationsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState(notifications.map((n) => ({ ...n })));
  const unread = items.filter((n) => n.unread).length;

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Notifications"
        description="Approvals, alerts, inventory and production signals."
        breadcrumbs={[{ label: "Notifications" }]}
        badge={unread ? unread + " unread" : "All read"}
        actions={
          <Button
            variant="outline"
            onClick={() => {
              setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
              toast({ title: "All marked read", tone: "success" });
            }}
          >
            <CheckCheck className="size-4" /> Mark all read
          </Button>
        }
      />
      <div className="space-y-2">
        {items.map((n) => (
          <Card key={n.id} className={n.unread ? "border-[var(--brand-primary)]/30 bg-[var(--brand-primary-soft)]/40" : ""}>
            <CardContent className="flex items-start gap-3 p-4">
              <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-muted)] text-[var(--brand-primary)]">
                <Bell className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold">{n.title}</p>
                  <Badge variant="outline">{n.type}</Badge>
                  {n.unread ? <Badge variant="info">New</Badge> : null}
                </div>
                <p className="mt-0.5 text-sm text-[var(--muted)]">{n.body}</p>
                <p className="mt-1 text-[11px] text-[var(--muted)]">{n.time}</p>
              </div>
              <div className="flex flex-col gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x)));
                    toast({ title: "Marked read", tone: "success" });
                  }}
                >
                  Read
                </Button>
                {n.type === "approval" ? (
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/approvals">Open</Link>
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
`
);

console.log("done batch 1");
