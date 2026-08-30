"use client";

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
