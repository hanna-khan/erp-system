"use client";

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
  { id: "D-PROD", name: "Production", head: "Farhan Siddiqui", headcount: 420, plant: "All" },
  { id: "D-QC", name: "Quality", head: "Mehreen Qazi", headcount: 48, plant: "All" },
  { id: "D-WH", name: "Warehouse", head: "Hira Nadeem", headcount: 62, plant: "Karachi SITE / FG" },
  { id: "D-FIN", name: "Finance", head: "Waqas Anwar", headcount: 18, plant: "HO" },
  { id: "D-HR", name: "HR", head: "Ayesha Noor", headcount: 12, plant: "HO" },
];

const costCenters = [
  { id: "CC-ECOM", name: "E-commerce Fulfillment", plant: "Online Fulfillment Hub", budget: "PKR 18M" },
  { id: "CC-PRINT", name: "Print / Ombre", plant: "SITE Karachi Plant", budget: "PKR 24M" },
  { id: "CC-SEW", name: "Garments", plant: "SITE Karachi Plant", budget: "PKR 22M" },
  { id: "CC-CUT", name: "Cutting", plant: "SITE Karachi Plant", budget: "PKR 12M" },
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
