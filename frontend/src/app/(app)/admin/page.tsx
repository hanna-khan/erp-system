"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSearch, GitBranch, Shield, Users } from "lucide-react";

const links = [
  { href: "/admin/users", title: "Users", desc: "Tenant users, plants and status.", icon: Users },
  { href: "/admin/roles", title: "Roles & permissions", desc: "Permission matrix by module.", icon: Shield },
  { href: "/admin/audit", title: "Audit log", desc: "Who changed what and when.", icon: FileSearch },
  { href: "/admin/workflows", title: "Workflows", desc: "Visual approval flow builder (mock).", icon: GitBranch },
];

export default function AdminPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Administration" description="Users, roles, audit trail and workflow configuration." breadcrumbs={[{ label: "Admin" }]} />
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
