import fs from "fs";
import path from "path";

const base = path.resolve("src/app");
function write(rel, content) {
  const full = path.join(base, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trimStart());
  console.log("wrote", rel);
}

write("(app)/admin/page.tsx", `"use client";

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
`);

write("(app)/admin/users/page.tsx", `"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { users, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

const rows = Object.values(users).map((u) => ({
  ...u,
  plant: u.plantId ?? "—",
})) as Array<(typeof users)[keyof typeof users] & { plant: string } & Record<string, unknown>>;

const columns: Column<(typeof rows)[number]>[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "title", label: "Title" },
  { key: "role", label: "Role" },
  { key: "plant", label: "Plant" },
  {
    key: "role",
    label: "Status",
    render: () => <Badge variant={statusTone("Active")}>Active</Badge>,
  },
];

export default function AdminUsersPage() {
  const { toast } = useToast();
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Users"
        description="Tenant user directory."
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Users" }]}
        actions={
          <>
            <Button variant="outline" asChild><Link href="/admin/roles">Roles</Link></Button>
            <Button onClick={() => toast({ title: "Invite sent", description: "User invite queued.", tone: "success" })}>
              <Plus className="size-4" /> Invite user
            </Button>
          </>
        }
      />
      <DataTable data={rows} columns={columns} searchKeys={["name", "email", "role", "title"]} searchPlaceholder="Search users..." />
    </div>
  );
}
`);

write("(app)/admin/roles/page.tsx", `"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const modules = ["CRM", "Sales", "Procurement", "Production", "Inventory", "Quality", "Finance", "HR", "Admin"];
const roles = ["CEO", "Production Manager", "Accountant", "HR Manager", "Floor Worker"];

const initial: Record<string, Record<string, boolean>> = {};
for (const r of roles) {
  initial[r] = {};
  for (const m of modules) {
    initial[r][m] = r === "CEO" || (r === "Accountant" && ["Finance", "Sales"].includes(m)) || (r === "Production Manager" && ["Production", "Inventory", "Quality"].includes(m)) || (r === "HR Manager" && m === "HR") || (r === "Floor Worker" && m === "Production");
  }
}

export default function AdminRolesPage() {
  const { toast } = useToast();
  const [matrix, setMatrix] = useState(initial);

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Roles & permissions"
        description="Module-level permission matrix (mock)."
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Roles" }]}
        actions={<Button onClick={() => toast({ title: "Permissions saved", tone: "success" })}>Save matrix</Button>}
      />
      <Card>
        <CardHeader><CardTitle>Permission matrix</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-[11px] uppercase text-[var(--muted)]">
                <th className="px-3 py-2">Role</th>
                {modules.map((m) => <th key={m} className="px-3 py-2 text-center">{m}</th>)}
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r} className="border-b border-[var(--border)]">
                  <td className="px-3 py-3 font-medium">{r}</td>
                  {modules.map((m) => (
                    <td key={m} className="px-3 py-3 text-center">
                      <Checkbox
                        checked={matrix[r][m]}
                        onCheckedChange={(v) =>
                          setMatrix((prev) => ({ ...prev, [r]: { ...prev[r], [m]: Boolean(v) } }))
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
`);

write("(app)/admin/audit/page.tsx", `"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { auditTrail } from "@/mock/data";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";

type Row = (typeof auditTrail)[number] & Record<string, unknown>;

const columns: Column<Row>[] = [
  { key: "timestamp", label: "When" },
  { key: "user", label: "User" },
  { key: "action", label: "Action" },
  { key: "previousValue", label: "Before", render: (r) => String(r.previousValue ?? "—") },
  { key: "newValue", label: "After", render: (r) => String(r.newValue ?? "—") },
];

export default function AdminAuditPage() {
  const { toast } = useToast();
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Audit log"
        description="Immutable change history for compliance."
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Audit" }]}
        actions={
          <Button variant="outline" onClick={() => toast({ title: "Audit export", description: "CSV downloaded.", tone: "success" })}>
            <Download className="size-4" /> Export
          </Button>
        }
      />
      <DataTable data={auditTrail as Row[]} columns={columns} searchKeys={["user", "action", "newValue"]} searchPlaceholder="Search audit..." pageSize={10} />
    </div>
  );
}
`);

write("(app)/admin/workflows/page.tsx", `"use client";

import { PageHeader } from "@/components/shared/page-header";
import { WorkflowStepper } from "@/components/shared/workflow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { WorkflowStep } from "@/types";
import { Plus } from "lucide-react";

const poFlow: WorkflowStep[] = [
  { id: "1", label: "Draft", status: "completed", meta: "Buyer" },
  { id: "2", label: "Dept Head", status: "completed", meta: "Auto" },
  { id: "3", label: "Finance", status: "current", meta: "Pending" },
  { id: "4", label: "CEO", status: "upcoming", meta: "> 1M" },
  { id: "5", label: "Released", status: "upcoming", meta: "ERP" },
];

const nodes = ["Start", "Condition: Amount", "Finance Approve", "CEO Approve", "Notify Buyer", "End"];

export default function AdminWorkflowsPage() {
  const { toast } = useToast();
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Workflow builder"
        description="Visual approval flows (mock canvas)."
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Workflows" }]}
        actions={<Button onClick={() => toast({ title: "Workflow published", tone: "success" })}><Plus className="size-4" /> New workflow</Button>}
      />
      <WorkflowStepper steps={poFlow} title="PO approval · current template" />
      <Card>
        <CardHeader><CardTitle>Canvas</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            {nodes.map((n, i) => (
              <div key={n} className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-medium shadow-[var(--shadow-xs)] hover:border-[var(--brand-primary)]"
                  onClick={() => toast({ title: "Node selected", description: n, tone: "info" })}
                >
                  {n}
                </button>
                {i < nodes.length - 1 ? <span className="text-[var(--muted)]">→</span> : null}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-[var(--muted)]">Drag-and-drop is mocked — click nodes to inspect.</p>
        </CardContent>
      </Card>
    </div>
  );
}
`);

console.log("admin ok");
