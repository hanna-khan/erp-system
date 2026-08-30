"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Phone, Plus, Calendar, CheckSquare } from "lucide-react";

type Activity = {
  id: string;
  type: "Call" | "Meeting" | "Task";
  subject: string;
  related: string;
  owner: string;
  due: string;
  status: "Open" | "Done" | "Scheduled";
};

const initial: Activity[] = [
  { id: "ACT-01", type: "Call", subject: "Follow up Gulf Retail RFQ", related: "LD-2202", owner: "Zainab Rizvi", due: "2026-08-30", status: "Open" },
  { id: "ACT-02", type: "Meeting", subject: "Fashion Retailer A — packing specs", related: "SO-1024", owner: "Zainab Rizvi", due: "2026-09-02", status: "Scheduled" },
  { id: "ACT-03", type: "Task", subject: "Send shade cards for Navy reactive", related: "OP-3102", owner: "Nadia Sheikh", due: "2026-08-31", status: "Open" },
  { id: "ACT-04", type: "Call", subject: "Nordic Apparel — repeat polo inquiry", related: "CU-1004", owner: "Imran Sales", due: "2026-08-28", status: "Done" },
  { id: "ACT-05", type: "Meeting", subject: "Denim House PK mill tour", related: "LD-2203", owner: "Zainab Rizvi", due: "2026-09-05", status: "Scheduled" },
  { id: "ACT-06", type: "Task", subject: "Update credit limit for Distributor C", related: "CU-1003", owner: "Hassan Qureshi", due: "2026-09-01", status: "Open" },
];

const typeIcon = {
  Call: Phone,
  Meeting: Calendar,
  Task: CheckSquare,
};

export default function ActivitiesPage() {
  const { toast } = useToast();
  const [items, setItems] = useState(initial);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    type: "Call" as Activity["type"],
    subject: "",
    related: "",
    owner: "Zainab Rizvi",
    due: "2026-09-10",
  });

  const create = () => {
    if (!form.subject.trim()) {
      toast({ title: "Subject required", tone: "error" });
      return;
    }
    const next: Activity = {
      id: `ACT-${String(items.length + 1).padStart(2, "0")}`,
      type: form.type,
      subject: form.subject,
      related: form.related || "—",
      owner: form.owner,
      due: form.due,
      status: form.type === "Meeting" ? "Scheduled" : "Open",
    };
    setItems((prev) => [next, ...prev]);
    setOpen(false);
    setForm({ type: "Call", subject: "", related: "", owner: "Zainab Rizvi", due: "2026-09-10" });
    toast({ title: "Activity created", description: next.subject, tone: "success" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activities"
        description="Calls, meetings, and tasks tied to leads, opportunities, and customers."
        breadcrumbs={[
          { label: "CRM", href: "/crm" },
          { label: "Activities" },
        ]}
        actions={
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="size-3.5" /> Log activity
          </Button>
        }
      />

      <div className="zr-card divide-y divide-[var(--border)]">
        {items.map((a) => {
          const Icon = typeIcon[a.type];
          return (
            <div key={a.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-9 items-center justify-center rounded-xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
                  <Icon className="size-4" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{a.subject}</p>
                    <Badge variant="outline">{a.type}</Badge>
                    <Badge
                      variant={
                        a.status === "Done" ? "success" : a.status === "Scheduled" ? "info" : "warning"
                      }
                    >
                      {a.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {a.id} · Related {a.related} · {a.owner} · Due {a.due}
                  </p>
                </div>
              </div>
              {a.status !== "Done" ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setItems((prev) =>
                      prev.map((x) => (x.id === a.id ? { ...x, status: "Done" } : x)),
                    );
                    toast({ title: "Marked done", description: a.subject, tone: "success" });
                  }}
                >
                  Complete
                </Button>
              ) : null}
            </div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log activity</DialogTitle>
            <DialogDescription>Create a call, meeting, or task for the CRM timeline.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <select
                className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as Activity["type"] }))}
              >
                <option>Call</option>
                <option>Meeting</option>
                <option>Task</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                placeholder="e.g. Confirm GSM for grey fabric"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="related">Related record</Label>
              <Input
                id="related"
                value={form.related}
                onChange={(e) => setForm((f) => ({ ...f, related: e.target.value }))}
                placeholder="SO-1024 / CU-1001 / OP-3101"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="owner">Owner</Label>
                <Input
                  id="owner"
                  value={form.owner}
                  onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="due">Due date</Label>
                <Input
                  id="due"
                  type="date"
                  value={form.due}
                  onChange={(e) => setForm((f) => ({ ...f, due: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={create}>Save activity</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
