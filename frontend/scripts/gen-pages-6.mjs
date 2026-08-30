import fs from "fs";
import path from "path";

const base = path.resolve("src/app");
function write(rel, content) {
  const full = path.join(base, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trimStart());
  console.log("wrote", rel);
}

write("(floor)/layout.tsx", `"use client";

import Link from "next/link";
import { Factory } from "lucide-react";

export default function FloorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef3ff] via-[#f7f5fb] to-[#eaf7f4]">
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
              <Factory className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">Production Floor · MES</p>
              <p className="text-[11px] text-[var(--muted)]">Tablet-optimized · soft colors · large targets</p>
            </div>
          </div>
          <Link href="/dashboard" className="text-sm font-medium text-[var(--brand-primary)] hover:underline">
            Exit to ERP
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
`);

write("(floor)/production-floor/page.tsx", `"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { machines, productionOrders, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Pause, Play, CheckCircle2, Wrench } from "lucide-react";

type Job = {
  id: string;
  product: string;
  machine: string;
  status: "Ready" | "Running" | "Paused" | "Completed";
  qty: number;
  scrap: number;
  defect: number;
  downtimeMin: number;
};

const initial: Job[] = productionOrders
  .filter((p) => p.status === "In Progress" || p.status === "Released")
  .slice(0, 4)
  .map((p, i) => ({
    id: p.id,
    product: p.product,
    machine: machines[i % machines.length]?.name ?? "Line",
    status: p.status === "In Progress" ? "Running" : "Ready",
    qty: p.completed,
    scrap: 0,
    defect: 0,
    downtimeMin: 0,
  }));

export default function ProductionFloorPage() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>(initial);
  const [report, setReport] = useState({ jobId: initial[0]?.id ?? "", qty: 50, scrap: 2, defect: 1, downtime: 5 });

  const update = (id: string, patch: Partial<Job>, msg: string) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...patch } : j)));
    toast({ title: msg, description: id, tone: "success" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Active jobs</h1>
        <p className="text-sm text-[var(--muted)]">Start / pause / complete and report qty, scrap, defect, downtime.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {machines.slice(0, 4).map((m) => (
          <Card key={m.id} className="border-white/70 bg-white/90">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{m.name}</p>
                <Badge variant={statusTone(m.status)}>{m.status}</Badge>
              </div>
              <p className="mt-1 text-xs text-[var(--muted)]">{m.type} · util {m.utilization}%</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {jobs.map((job) => (
          <Card key={job.id} className="border-white/70 bg-white/95 shadow-[var(--shadow-sm)]">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-lg">{job.product}</CardTitle>
                  <p className="text-sm text-[var(--muted)]">{job.id} · {job.machine}</p>
                </div>
                <Badge variant={statusTone(job.status)}>{job.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-2 text-center text-sm">
                <div className="rounded-xl bg-[var(--surface-muted)] p-3"><p className="text-[10px] uppercase text-[var(--muted)]">Qty</p><p className="text-lg font-semibold">{job.qty}</p></div>
                <div className="rounded-xl bg-amber-50 p-3"><p className="text-[10px] uppercase text-[var(--muted)]">Scrap</p><p className="text-lg font-semibold">{job.scrap}</p></div>
                <div className="rounded-xl bg-rose-50 p-3"><p className="text-[10px] uppercase text-[var(--muted)]">Defect</p><p className="text-lg font-semibold">{job.defect}</p></div>
                <div className="rounded-xl bg-sky-50 p-3"><p className="text-[10px] uppercase text-[var(--muted)]">DT min</p><p className="text-lg font-semibold">{job.downtimeMin}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Button className="h-12 text-base" onClick={() => update(job.id, { status: "Running" }, "Started")}>
                  <Play className="size-5" /> Start
                </Button>
                <Button className="h-12 text-base" variant="outline" onClick={() => update(job.id, { status: "Paused" }, "Paused")}>
                  <Pause className="size-5" /> Pause
                </Button>
                <Button className="h-12 text-base" variant="secondary" onClick={() => update(job.id, { status: "Running" }, "Resumed")}>
                  Resume
                </Button>
                <Button className="h-12 text-base" onClick={() => update(job.id, { status: "Completed" }, "Completed")}>
                  <CheckCircle2 className="size-5" /> Complete
                </Button>
              </div>
              <Button
                className="h-12 w-full text-base"
                variant="destructive"
                onClick={() => toast({ title: "Maintenance requested", description: job.machine + " ticket created.", tone: "warning" })}
              >
                <Wrench className="size-5" /> Request maintenance
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/70 bg-white/95">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AlertTriangle className="size-5 text-amber-500" /> Report production</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-2 lg:col-span-1">
            <Label>Job</Label>
            <select
              className="flex h-12 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-base"
              value={report.jobId}
              onChange={(e) => setReport((r) => ({ ...r, jobId: e.target.value }))}
            >
              {jobs.map((j) => <option key={j.id} value={j.id}>{j.id}</option>)}
            </select>
          </div>
          {([
            ["qty", "Good qty"],
            ["scrap", "Scrap"],
            ["defect", "Defect"],
            ["downtime", "Downtime min"],
          ] as const).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <Label>{label}</Label>
              <Input
                className="h-12 text-base"
                type="number"
                value={report[key]}
                onChange={(e) => setReport((r) => ({ ...r, [key]: Number(e.target.value) }))}
              />
            </div>
          ))}
          <div className="sm:col-span-2 lg:col-span-5">
            <Button
              className="h-14 w-full text-base"
              onClick={() => {
                setJobs((prev) =>
                  prev.map((j) =>
                    j.id === report.jobId
                      ? {
                          ...j,
                          qty: j.qty + report.qty,
                          scrap: j.scrap + report.scrap,
                          defect: j.defect + report.defect,
                          downtimeMin: j.downtimeMin + report.downtime,
                        }
                      : j,
                  ),
                );
                toast({ title: "Report posted", description: "Qty / scrap / defect / downtime updated.", tone: "success" });
              }}
            >
              Post report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
`);

write("(app)/plm/page.tsx", `"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileStack, FlaskConical, Palette, Shirt } from "lucide-react";

const links = [
  { href: "/plm/styles", title: "Styles", desc: "Seasonal style library and BOM links.", icon: Palette },
  { href: "/plm/samples", title: "Samples", desc: "Proto / fit / size set tracking.", icon: FlaskConical },
  { href: "/plm/techpacks", title: "Tech packs", desc: "Construction, measurements and artwork.", icon: FileStack },
];

export default function PlmPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="PLM" description="Product lifecycle for apparel and fabric styles." breadcrumbs={[{ label: "PLM" }]} badge="Apparel" />
      <div className="grid gap-4 sm:grid-cols-3">
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
      <Card>
        <CardContent className="flex items-center gap-3 p-5 text-sm text-[var(--muted)]">
          <Shirt className="size-5 text-[var(--brand-primary)]" />
          Linked to products, BOM and color × size matrix for TS-BASIC-27.
        </CardContent>
      </Card>
    </div>
  );
}
`);

write("(app)/plm/styles/page.tsx", `"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

const styles = [
  { id: "ST-BASIC-27", name: "Men's Basic Tee", season: "SS27", category: "Knit", customer: "Fashion Retailer A", status: "Approved", samples: 3 },
  { id: "ST-POLO-26", name: "Core Polo", season: "AW26", category: "Knit", customer: "Nordic Apparel AS", status: "In Development", samples: 2 },
  { id: "ST-DF-58", name: "Reactive Dyed Fabric", season: "SS27", category: "Fabric", customer: "Export Customer B", status: "Approved", samples: 1 },
  { id: "ST-DENIM-01", name: "Denim Shirt", season: "AW26", category: "Woven", customer: "Denim House PK", status: "Draft", samples: 0 },
];

type Row = (typeof styles)[number] & Record<string, unknown>;

const columns: Column<Row>[] = [
  { key: "id", label: "Style #" },
  { key: "name", label: "Name" },
  { key: "season", label: "Season" },
  { key: "category", label: "Category" },
  { key: "customer", label: "Customer" },
  { key: "samples", label: "Samples" },
  { key: "status", label: "Status", render: (r) => <Badge variant={statusTone(r.status)}>{r.status}</Badge> },
];

export default function PlmStylesPage() {
  const { toast } = useToast();
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Styles"
        description="Style master for garments and fabric programs."
        breadcrumbs={[{ label: "PLM", href: "/plm" }, { label: "Styles" }]}
        actions={
          <>
            <Button variant="outline" asChild><Link href="/plm/samples">Samples</Link></Button>
            <Button onClick={() => toast({ title: "Style draft", description: "New style created.", tone: "success" })}><Plus className="size-4" /> New style</Button>
          </>
        }
      />
      <DataTable data={styles as Row[]} columns={columns} searchKeys={["id", "name", "season", "customer", "status"]} searchPlaceholder="Search styles..." rowHref={(r) => "/plm/styles/" + r.id} />
    </div>
  );
}
`);

write("(app)/plm/styles/[id]/page.tsx", `"use client";

import { use } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatPill } from "@/components/shared/kpi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { colorSizeMatrix, bomLines, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";

export default function StyleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  const styleId = id || "ST-BASIC-27";

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title={styleId}
        description="Men's Basic Tee · SS27 · linked to SO-1024 / PRO-7001"
        breadcrumbs={[{ label: "PLM", href: "/plm" }, { label: "Styles", href: "/plm/styles" }, { label: styleId }]}
        badge="Approved"
        actions={
          <>
            <Button variant="outline" asChild><Link href="/plm/techpacks">Tech pack</Link></Button>
            <Button onClick={() => toast({ title: "Style published", tone: "success" })}>Publish</Button>
          </>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatPill label="Season" value="SS27" tone="info" />
        <StatPill label="GSM" value="180" />
        <StatPill label="Colors" value={colorSizeMatrix.colors.length} />
        <StatPill label="BOM lines" value={bomLines.length} tone="success" />
      </div>
      <Tabs defaultValue="matrix">
        <TabsList>
          <TabsTrigger value="matrix">Color × size</TabsTrigger>
          <TabsTrigger value="bom">BOM</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
        </TabsList>
        <TabsContent value="matrix">
          <Card>
            <CardContent className="overflow-x-auto pt-6">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase text-[var(--muted)]">
                    <th className="px-3 py-2">Color</th>
                    {colorSizeMatrix.sizes.map((s) => <th key={s} className="px-3 py-2">{s}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {colorSizeMatrix.colors.map((c) => (
                    <tr key={c} className="border-t border-[var(--border)]">
                      <td className="px-3 py-2 font-medium">{c}</td>
                      {colorSizeMatrix.sizes.map((s) => (
                        <td key={s} className="px-3 py-2">{colorSizeMatrix.quantities[c]?.[s] ?? 0}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bom">
          <Card>
            <CardHeader><CardTitle>Bill of materials</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {bomLines.map((b) => (
                <div key={b.id} className="flex justify-between border-b border-[var(--border)] py-2">
                  <span>{b.component}</span>
                  <span className="text-[var(--muted)]">{b.qty} {b.unit}</span>
                </div>
              ))}
              <Button variant="outline" asChild className="mt-2"><Link href="/products/bom">Open BOM module</Link></Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="links">
          <Card>
            <CardContent className="flex flex-wrap gap-2 pt-6">
              <Badge variant={statusTone("Approved")}>SO-1024</Badge>
              <Button size="sm" variant="outline" asChild><Link href="/sales/orders/SO-1024">Sales order</Link></Button>
              <Button size="sm" variant="outline" asChild><Link href="/production/orders/PRO-7001">Production</Link></Button>
              <Button size="sm" variant="outline" asChild><Link href="/plm/samples">Samples</Link></Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
`);

write("(app)/plm/samples/page.tsx", `"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";

const seed = [
  { id: "SMP-101", style: "ST-BASIC-27", type: "Proto", size: "M", status: "Approved", owner: "PLM Team", due: "2026-08-10" },
  { id: "SMP-102", style: "ST-BASIC-27", type: "Fit", size: "L", status: "In Review", owner: "Nadia Sheikh", due: "2026-08-28" },
  { id: "SMP-103", style: "ST-POLO-26", type: "Size Set", size: "S-XXL", status: "Pending", owner: "PLM Team", due: "2026-09-05" },
  { id: "SMP-104", style: "ST-DF-58", type: "Lab Dip", size: "—", status: "Approved", owner: "Lab FSD", due: "2026-08-15" },
];

type Row = (typeof seed)[number] & Record<string, unknown>;

const columns: Column<Row>[] = [
  { key: "id", label: "Sample #" },
  { key: "style", label: "Style", render: (r) => <Link href={"/plm/styles/" + r.style} className="text-[var(--brand-primary)] hover:underline">{r.style}</Link> },
  { key: "type", label: "Type" },
  { key: "size", label: "Size" },
  { key: "owner", label: "Owner" },
  { key: "due", label: "Due" },
  { key: "status", label: "Status", render: (r) => <Badge variant={statusTone(r.status)}>{r.status}</Badge> },
];

export default function SamplesPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState(seed as Row[]);
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Samples"
        description="Proto, fit, size-set and lab dips."
        breadcrumbs={[{ label: "PLM", href: "/plm" }, { label: "Samples" }]}
        actions={
          <Button
            onClick={() => {
              setRows((prev) => prev.map((r) => (r.id === "SMP-102" ? { ...r, status: "Approved" } : r)));
              toast({ title: "Sample approved", description: "SMP-102", tone: "success" });
            }}
          >
            Approve fit
          </Button>
        }
      />
      <DataTable data={rows} columns={columns} searchKeys={["id", "style", "type", "status"]} searchPlaceholder="Search samples..." />
    </div>
  );
}
`);

write("(app)/plm/techpacks/page.tsx", `"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Download, FileStack } from "lucide-react";

const packs = [
  { id: "TP-2701", style: "ST-BASIC-27", rev: "R3", pages: 12, status: "Released" },
  { id: "TP-2608", style: "ST-POLO-26", rev: "R1", pages: 9, status: "Draft" },
  { id: "TP-5802", style: "ST-DF-58", rev: "R2", pages: 6, status: "Released" },
];

export default function TechpacksPage() {
  const { toast } = useToast();
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Tech packs"
        description="Construction, measurement charts and artwork packs."
        breadcrumbs={[{ label: "PLM", href: "/plm" }, { label: "Tech packs" }]}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {packs.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
                <FileStack className="size-5" />
              </div>
              <CardTitle className="text-base">{p.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-[var(--muted)]">
                <Link href={"/plm/styles/" + p.style} className="text-[var(--brand-primary)] hover:underline">{p.style}</Link>
                {" · "}{p.rev} · {p.pages} pages
              </p>
              <Badge variant={p.status === "Released" ? "success" : "warning"}>{p.status}</Badge>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => toast({ title: "Tech pack exported", description: p.id + " PDF (mock).", tone: "success" })}
              >
                <Download className="size-4" /> Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
`);

console.log("floor+plm ok");
