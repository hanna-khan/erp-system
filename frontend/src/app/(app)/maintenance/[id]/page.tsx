"use client";

import { use, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatPill } from "@/components/shared/kpi";
import { Timeline, WorkflowStepper } from "@/components/shared/workflow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import type { WorkflowStep } from "@/types";
import { CheckCircle2, Play, Wrench } from "lucide-react";

const catalog: Record<string, { type: string; machine: string; machineId: string; priority: string; status: string; assignee: string; description: string }> = {
  "MW-112": { type: "Preventive", machine: "Knitting Machine-03", machineId: "M-K03", priority: "Medium", status: "In Progress", assignee: "Tariq Mehmood", description: "Monthly PM — lubricate cams, check needle bed, clean fluff." },
  "MW-113": { type: "Breakdown", machine: "Sewing Line-02", machineId: "M-S02", priority: "Critical", status: "Open", assignee: "Kamran Shah", description: "Motor overheating and intermittent stop. Line idle since 10:40." },
  "MW-114": { type: "Corrective", machine: "Loom-001", machineId: "M-L001", priority: "High", status: "Scheduled", assignee: "Shift Tech B", description: "Replace worn heald wires and adjust tension." },
};

export default function MaintenanceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  const base = catalog[id] ?? catalog["MW-113"];
  const [status, setStatus] = useState(base.status);
  const [notes, setNotes] = useState("");

  const steps: WorkflowStep[] = [
    { id: "1", label: "Reported", status: "completed", meta: "Floor / Supervisor" },
    { id: "2", label: "Assigned", status: status === "Open" ? "current" : "completed", meta: base.assignee },
    { id: "3", label: "In Progress", status: status === "In Progress" ? "current" : status === "Completed" ? "completed" : "upcoming", meta: base.machine },
    { id: "4", label: "Verified", status: status === "Completed" ? "completed" : "upcoming", meta: "QC / Ops" },
    { id: "5", label: "Closed", status: status === "Completed" ? "completed" : "upcoming", href: "/machines" },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title={`Work Order ${id}`}
        description={base.description}
        breadcrumbs={[
          { label: "Maintenance", href: "/maintenance" },
          { label: id },
        ]}
        badge={base.type}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setStatus("In Progress");
                toast({ title: "WO started", description: `${id} marked In Progress.`, tone: "info" });
              }}
            >
              <Play className="size-4" /> Start
            </Button>
            <Button
              onClick={() => {
                setStatus("Completed");
                toast({ title: "WO completed", description: "Machine released to production.", tone: "success" });
              }}
            >
              <CheckCircle2 className="size-4" /> Complete
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatPill label="Status" value={status} tone={status === "Completed" ? "success" : status === "Open" ? "error" : "warning"} />
        <StatPill label="Type" value={base.type} tone="info" />
        <StatPill label="Priority" value={base.priority} tone={base.priority === "Critical" ? "error" : "warning"} />
        <StatPill label="Assignee" value={base.assignee} />
        <StatPill label="Machine" value={base.machine} />
      </div>

      <WorkflowStepper steps={steps} title="Maintenance workflow" />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Machine</span>
              <Link href={`/machines/${base.machineId}`} className="font-medium text-[var(--brand-primary)] hover:underline">
                {base.machine}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Status</span>
              <Badge variant={statusTone(status)}>{status}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Spare parts</span>
              <span>Bearing kit · Drive belt</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Linked assets</span>
              <Link href="/assets" className="text-[var(--brand-primary)] hover:underline">
                View asset register
              </Link>
            </div>
            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Technician notes</p>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Log findings, parts used, downtime reason..."
                rows={4}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast({ title: "Notes saved", description: "Activity log updated.", tone: "success" })}
              >
                <Wrench className="size-3.5" /> Save notes
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline
              events={[
                { id: "t1", title: "Work order created", time: "08:40", meta: "From production floor" },
                { id: "t2", title: `Assigned to ${base.assignee}`, time: "08:45" },
                { id: "t3", title: "Parts reserved from stores", time: "09:10", meta: "WH-FSD-SP" },
                { id: "t4", title: status === "Completed" ? "Verified & closed" : "Awaiting completion", time: "Now" },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
