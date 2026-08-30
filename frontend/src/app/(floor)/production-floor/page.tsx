"use client";

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
                <div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] uppercase text-[var(--muted)]">Qty</p><p className="text-lg font-semibold">{job.qty}</p></div>
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
