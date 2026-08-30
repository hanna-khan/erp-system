import fs from "fs";
import path from "path";

const base = path.resolve("src/app");
function write(rel, content) {
  const full = path.join(base, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trimStart());
  console.log("wrote", rel);
}

write("(app)/super-admin/page.tsx", `"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tenants, subscriptionPlans } from "@/mock/data";
import { formatCurrency } from "@/lib/utils";
import { Building2, CreditCard, Headphones, Layers } from "lucide-react";

const links = [
  { href: "/super-admin/tenants", title: "Tenants", desc: "Multi-tenant textile mills on the platform.", icon: Building2 },
  { href: "/super-admin/subscriptions", title: "Subscriptions", desc: "Plans, limits and module packs.", icon: Layers },
  { href: "/super-admin/billing", title: "Billing", desc: "MRR, invoices and past-due tenants.", icon: CreditCard },
  { href: "/super-admin/support", title: "Support", desc: "Tickets from tenant admins.", icon: Headphones },
];

export default function SuperAdminPage() {
  const mrr = tenants.reduce((s, t) => s + t.mrr, 0);
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Super Admin" description="Platform control for Zendrock ERP tenants." breadcrumbs={[{ label: "Super Admin" }]} badge="Platform" />
      <KpiGrid
        columns={4}
        items={[
          { id: "t", label: "Tenants", value: String(tenants.length), tone: "info" },
          { id: "m", label: "MRR", value: formatCurrency(mrr), tone: "success" },
          { id: "p", label: "Plans", value: String(subscriptionPlans.length) },
          { id: "d", label: "Past due", value: String(tenants.filter((t) => t.status === "Past Due").length), tone: "error" },
        ]}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="group">
            <Card className="h-full transition-shadow hover:shadow-[var(--shadow-sm)]">
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
                  <l.icon className="size-5" />
                </div>
                <CardTitle className="group-hover:text-[var(--brand-primary)]">{l.title}</CardTitle>
                <CardDescription>{l.desc}</CardDescription>
              </CardHeader>
              <CardContent><span className="text-xs font-semibold text-[var(--brand-primary)]">Open →</span></CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
`);

write("(app)/super-admin/tenants/page.tsx", `"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { tenants, statusTone } from "@/mock/data";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

type Row = (typeof tenants)[number] & Record<string, unknown>;

const columns: Column<Row>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Tenant" },
  { key: "plan", label: "Plan" },
  { key: "users", label: "Users" },
  { key: "storage", label: "Storage" },
  { key: "mrr", label: "MRR", render: (r) => formatCurrency(r.mrr) },
  { key: "status", label: "Status", render: (r) => <Badge variant={statusTone(r.status)}>{r.status}</Badge> },
];

export default function TenantsPage() {
  const { toast } = useToast();
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Tenants"
        description="All textile mills on Zendrock."
        breadcrumbs={[{ label: "Super Admin", href: "/super-admin" }, { label: "Tenants" }]}
        actions={<Button onClick={() => toast({ title: "Tenant wizard", description: "Provision flow opened.", tone: "info" })}><Plus className="size-4" /> New tenant</Button>}
      />
      <DataTable data={tenants as Row[]} columns={columns} searchKeys={["id", "name", "plan", "status"]} searchPlaceholder="Search tenants..." />
    </div>
  );
}
`);

write("(app)/super-admin/subscriptions/page.tsx", `"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { subscriptionPlans } from "@/mock/data";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function SubscriptionsPage() {
  const { toast } = useToast();
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Subscriptions" description="Platform plans for textile ERP tenants." breadcrumbs={[{ label: "Super Admin", href: "/super-admin" }, { label: "Subscriptions" }]} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {subscriptionPlans.map((p) => (
          <Card key={p.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
              <CardDescription>{p.cycle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-2xl font-semibold">{p.price ? formatCurrency(p.price) : "Free"}</p>
              <p className="text-[var(--muted)]">{p.users} users · {p.storage}</p>
              <p className="text-[var(--muted)]">{p.modules}</p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button className="w-full" variant="outline" onClick={() => toast({ title: "Plan selected", description: p.name, tone: "success" })}>Edit plan</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
`);

write("(app)/super-admin/billing/page.tsx", `"use client";

import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { tenants, statusTone } from "@/mock/data";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const invoices = tenants.map((t, i) => ({
  id: "INV-SA-" + (8800 + i),
  tenant: t.name,
  amount: t.mrr || 45000,
  status: t.status === "Past Due" ? "Overdue" : t.trial ? "Trial" : "Paid",
  period: "Aug 2026",
}));

type Row = (typeof invoices)[number] & Record<string, unknown>;

const columns: Column<Row>[] = [
  { key: "id", label: "Invoice" },
  { key: "tenant", label: "Tenant" },
  { key: "period", label: "Period" },
  { key: "amount", label: "Amount", render: (r) => formatCurrency(r.amount) },
  { key: "status", label: "Status", render: (r) => <Badge variant={statusTone(r.status)}>{r.status}</Badge> },
];

export default function BillingPage() {
  const { toast } = useToast();
  const mrr = tenants.reduce((s, t) => s + t.mrr, 0);
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Billing"
        description="Platform invoices and recurring revenue."
        breadcrumbs={[{ label: "Super Admin", href: "/super-admin" }, { label: "Billing" }]}
        actions={<Button onClick={() => toast({ title: "Dunning run", description: "Past-due reminders queued.", tone: "info" })}>Run dunning</Button>}
      />
      <KpiGrid columns={3} items={[
        { id: "mrr", label: "MRR", value: formatCurrency(mrr), tone: "success" },
        { id: "arr", label: "ARR", value: formatCurrency(mrr * 12), tone: "info" },
        { id: "od", label: "Overdue invoices", value: String(invoices.filter((i) => i.status === "Overdue").length), tone: "error" },
      ]} />
      <DataTable data={invoices as Row[]} columns={columns} searchKeys={["id", "tenant", "status"]} searchPlaceholder="Search invoices..." />
    </div>
  );
}
`);

write("(app)/super-admin/support/page.tsx", `"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const seed = [
  { id: "TK-301", tenant: "ABC Textile Mills", subject: "MES tablet sync delay", priority: "High", status: "Open" },
  { id: "TK-302", tenant: "Sunrise Knits", subject: "Need extra QC users", priority: "Medium", status: "Open" },
  { id: "TK-303", tenant: "Pearl Dyeing Works", subject: "Trial extension request", priority: "Low", status: "Pending" },
];

export default function SupportPage() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState(seed);

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Support" description="Tickets from tenant admins." breadcrumbs={[{ label: "Super Admin", href: "/super-admin" }, { label: "Support" }]} />
      <div className="space-y-3">
        {tickets.map((t) => (
          <Card key={t.id}>
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{t.subject}</p>
                  <Badge variant={t.priority === "High" ? "error" : t.priority === "Medium" ? "warning" : "info"}>{t.priority}</Badge>
                  <Badge variant="outline">{t.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-[var(--muted)]">{t.id} · {t.tenant}</p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setTickets((prev) => prev.map((x) => (x.id === t.id ? { ...x, status: "Resolved" } : x)));
                  toast({ title: "Ticket resolved", description: t.id, tone: "success" });
                }}
              >
                Resolve
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
`);

console.log("super-admin ok");
