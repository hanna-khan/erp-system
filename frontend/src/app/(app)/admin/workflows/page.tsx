"use client";

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
