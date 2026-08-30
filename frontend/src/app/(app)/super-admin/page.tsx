"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tenants, subscriptionPlans } from "@/mock/data";
import { formatCurrency } from "@/lib/utils";
import { Building2, CreditCard, Headphones, Layers } from "lucide-react";

const links = [
  { href: "/super-admin/tenants", title: "Tenants", desc: "Multi-tenant apparel brands on the platform.", icon: Building2 },
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
