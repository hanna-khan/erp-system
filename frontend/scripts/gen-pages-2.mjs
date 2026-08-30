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
  "(app)/organization/page.tsx",
  `"use client";

import { PageHeader } from "@/components/shared/page-header";
import { StatPill } from "@/components/shared/kpi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { branches, company, plants } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Building2, Plus } from "lucide-react";

const departments = [
  { id: "D-PROD", name: "Production", head: "Ahmed Raza", headcount: 420, plant: "All" },
  { id: "D-QC", name: "Quality", head: "Nadia Sheikh", headcount: 48, plant: "All" },
  { id: "D-WH", name: "Warehouse", head: "Fatima Ali", headcount: 62, plant: "Karachi / Lahore" },
  { id: "D-FIN", name: "Finance", head: "Hassan Qureshi", headcount: 18, plant: "HO" },
  { id: "D-HR", name: "HR", head: "Ayesha Noor", headcount: 12, plant: "HO" },
];

const costCenters = [
  { id: "CC-WEAVE", name: "Weaving", plant: "Faisalabad Plant", budget: "PKR 28M" },
  { id: "CC-DYE", name: "Dyeing", plant: "Faisalabad Plant", budget: "PKR 34M" },
  { id: "CC-SEW", name: "Garments", plant: "Lahore Plant", budget: "PKR 22M" },
  { id: "CC-SPIN", name: "Spinning", plant: "Karachi Plant", budget: "PKR 41M" },
];

export default function OrganizationPage() {
  const { toast } = useToast();

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Organization"
        description="Companies, branches, plants, departments and cost centers."
        breadcrumbs={[{ label: "Organization" }]}
        actions={
          <Button onClick={() => toast({ title: "Unit draft", description: "New org unit form opened.", tone: "info" })}>
            <Plus className="size-4" /> Add unit
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatPill label="Company" value={company.shortName} tone="info" />
        <StatPill label="Plants" value={plants.length} />
        <StatPill label="Branches" value={branches.length} />
        <StatPill label="Cost centers" value={costCenters.length} tone="success" />
      </div>

      <Tabs defaultValue="company">
        <TabsList>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="plants">Plants</TabsTrigger>
          <TabsTrigger value="depts">Departments</TabsTrigger>
          <TabsTrigger value="cc">Cost centers</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Building2 className="size-4" /> {company.name}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
              <div><p className="text-[var(--muted)]">NTN</p><p className="font-medium">{company.ntn}</p></div>
              <div><p className="text-[var(--muted)]">STRN</p><p className="font-medium">{company.strn}</p></div>
              <div><p className="text-[var(--muted)]">Currency</p><p className="font-medium">{company.currency}</p></div>
              <div><p className="text-[var(--muted)]">Fiscal year</p><p className="font-medium">{company.fiscalYear}</p></div>
              <div className="sm:col-span-2"><p className="text-[var(--muted)]">Address</p><p className="font-medium">{company.address}, {company.city}</p></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branches" className="grid gap-3 sm:grid-cols-3">
          {branches.map((b) => (
            <Card key={b.id}><CardHeader><CardTitle className="text-sm">{b.name}</CardTitle></CardHeader>
              <CardContent className="text-sm text-[var(--muted)]">{b.city}</CardContent></Card>
          ))}
        </TabsContent>

        <TabsContent value="plants" className="grid gap-3 sm:grid-cols-3">
          {plants.map((p) => (
            <Card key={p.id}><CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">{p.name}</CardTitle><Badge variant="info">{p.type}</Badge>
            </CardHeader>
              <CardContent className="text-sm text-[var(--muted)]">{p.city}</CardContent></Card>
          ))}
        </TabsContent>

        <TabsContent value="depts">
          <div className="overflow-hidden rounded-xl border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead className="bg-[var(--surface-muted)] text-[11px] uppercase text-[var(--muted)]">
                <tr><th className="px-4 py-2 text-left">Code</th><th className="px-4 py-2 text-left">Department</th><th className="px-4 py-2 text-left">Head</th><th className="px-4 py-2 text-left">HC</th><th className="px-4 py-2 text-left">Scope</th></tr>
              </thead>
              <tbody>
                {departments.map((d) => (
                  <tr key={d.id} className="border-t border-[var(--border)]">
                    <td className="px-4 py-3 font-medium text-[var(--brand-primary)]">{d.id}</td>
                    <td className="px-4 py-3">{d.name}</td>
                    <td className="px-4 py-3">{d.head}</td>
                    <td className="px-4 py-3">{d.headcount}</td>
                    <td className="px-4 py-3">{d.plant}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="cc" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {costCenters.map((c) => (
            <Card key={c.id}>
              <CardHeader><CardTitle className="text-sm">{c.name}</CardTitle></CardHeader>
              <CardContent className="text-sm">
                <p className="text-[var(--muted)]">{c.id} · {c.plant}</p>
                <p className="mt-2 font-semibold">{c.budget}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
`
);

write(
  "(app)/approvals/page.tsx",
  `"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Check, X } from "lucide-react";

const seed = [
  { id: "AP-901", type: "Purchase Order", ref: "PO-4404", requester: "Omar Farooq", amount: 875000, status: "Pending", href: "/procurement/orders/PO-4404" },
  { id: "AP-902", type: "Sales Discount", ref: "SO-1024", requester: "Zainab Rizvi", amount: 450000, status: "Pending", href: "/sales/orders/SO-1024" },
  { id: "AP-903", type: "Leave", ref: "EMP-1005", requester: "Tariq Mehmood", amount: 0, status: "Pending", href: "/hr/employees/EMP-1005" },
  { id: "AP-904", type: "Journal", ref: "JV-2405", requester: "Hassan Qureshi", amount: 1800000, status: "Pending", href: "/finance/gl" },
];

export default function ApprovalsPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState(seed);

  const decide = (id: string, decision: "Approved" | "Rejected") => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: decision } : r)));
    toast({
      title: decision === "Approved" ? "Approved" : "Rejected",
      description: id + " marked " + decision.toLowerCase() + ".",
      tone: decision === "Approved" ? "success" : "error",
    });
  };

  const pending = rows.filter((r) => r.status === "Pending");

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Approvals"
        description="Pending workflow decisions across PO, sales, HR and finance."
        breadcrumbs={[{ label: "Approvals" }]}
        badge={pending.length + " pending"}
      />

      <KpiGrid
        columns={4}
        items={[
          { id: "p", label: "Pending", value: String(pending.length), tone: "warning" },
          { id: "a", label: "Approved today", value: String(rows.filter((r) => r.status === "Approved").length), tone: "success" },
          { id: "r", label: "Rejected", value: String(rows.filter((r) => r.status === "Rejected").length), tone: "error" },
          { id: "v", label: "Value pending", value: formatCurrency(pending.reduce((s, r) => s + r.amount, 0)), tone: "info" },
        ]}
      />

      <div className="space-y-3">
        {rows.map((r) => (
          <Card key={r.id}>
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{r.type}</p>
                  <Badge variant={r.status === "Pending" ? "warning" : r.status === "Approved" ? "success" : "error"}>{r.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  <Link href={r.href} className="text-[var(--brand-primary)] hover:underline">{r.ref}</Link>
                  {" · "}{r.requester}
                  {r.amount ? " · " + formatCurrency(r.amount) : ""}
                </p>
              </div>
              {r.status === "Pending" ? (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => decide(r.id, "Approved")}><Check className="size-4" /> Approve</Button>
                  <Button size="sm" variant="outline" onClick={() => decide(r.id, "Rejected")}><X className="size-4" /> Reject</Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
`
);

console.log("batch2 ok");
