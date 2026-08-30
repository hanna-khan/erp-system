"use client";

import { use, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatPill } from "@/components/shared/kpi";
import { Timeline } from "@/components/shared/workflow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { machines, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { formatNumber } from "@/lib/utils";
import { Pause, Play, Wrench, AlertTriangle } from "lucide-react";

export default function MachineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  const machine = machines.find((m) => m.id === id) ?? machines[0];
  const [status, setStatus] = useState(machine.status);

  const events = [
    { id: "e1", title: "Shift start — operator logged in", meta: machine.operator, time: "06:00" },
    { id: "e2", title: "Job assigned", meta: machine.job, time: "06:12" },
    { id: "e3", title: "Utilization peak 94%", meta: "Last hour", time: "14:20" },
    { id: "e4", title: status === "Breakdown" ? "Breakdown reported" : "Running normally", meta: machine.plant, time: "Just now" },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title={machine.name}
        description={`${machine.type} · ${machine.plant}`}
        breadcrumbs={[
          { label: "Machines", href: "/machines" },
          { label: machine.id },
        ]}
        badge={machine.id}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setStatus("Idle");
                toast({ title: "Paused", description: `${machine.name} set to Idle.`, tone: "warning" });
              }}
            >
              <Pause className="size-4" /> Pause
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setStatus("Running");
                toast({ title: "Resumed", description: `${machine.name} is Running.`, tone: "success" });
              }}
            >
              <Play className="size-4" /> Resume
            </Button>
            <Button
              variant="outline"
              asChild
            >
              <Link href="/maintenance">
                <Wrench className="size-4" /> Request PM
              </Link>
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setStatus("Breakdown");
                toast({ title: "Breakdown logged", description: "Maintenance ticket created.", tone: "error" });
              }}
            >
              <AlertTriangle className="size-4" /> Report Breakdown
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatPill label="Status" value={status} tone={status === "Running" ? "success" : status === "Breakdown" ? "error" : "warning"} />
        <StatPill label="Utilization" value={`${formatNumber(machine.utilization)}%`} tone="info" />
        <StatPill label="Operator" value={machine.operator} />
        <StatPill label="Active Job" value={machine.job} />
        <StatPill label="Downtime Today" value={`${machine.downtimeHrs} hrs`} tone="warning" />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="specs">Specs</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Live status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Current status</span>
                <Badge variant={statusTone(status)}>{status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Plant</span>
                <span>{machine.plant}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Linked job</span>
                {machine.job !== "—" ? (
                  <Link href={`/production/orders/${machine.job}`} className="text-[var(--brand-primary)] hover:underline">
                    {machine.job}
                  </Link>
                ) : (
                  <span>—</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Floor MES</span>
                <Link href="/production-floor" className="text-[var(--brand-primary)] hover:underline">
                  Open tablet view
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Event timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline events={events} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardContent className="pt-6">
              <Timeline
                events={[
                  { id: "h1", title: "PM completed — bearings greased", time: "2026-08-12", meta: "WO-PM-098" },
                  { id: "h2", title: "Spindle replacement", time: "2026-07-03", meta: "Corrective" },
                  { id: "h3", title: "Commissioned", time: "2024-01-15", meta: "Asset register" },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="specs">
          <Card>
            <CardContent className="grid gap-3 pt-6 text-sm sm:grid-cols-2">
              <div><p className="text-[var(--muted)]">OEM</p><p className="font-medium">Toyota / Picanol / Local</p></div>
              <div><p className="text-[var(--muted)]">Install year</p><p className="font-medium">2019</p></div>
              <div><p className="text-[var(--muted)]">Power</p><p className="font-medium">15 kW</p></div>
              <div><p className="text-[var(--muted)]">Cost center</p><p className="font-medium">CC-WEAVE-01</p></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
