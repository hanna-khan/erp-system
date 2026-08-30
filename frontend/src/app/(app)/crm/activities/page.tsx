"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Phone, Calendar, CheckSquare } from "lucide-react";

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
  { id: "ACT-01", type: "Call", subject: "Follow up Gulf Style Trading RFQ", related: "LD-2202", owner: "Areeba Malik", due: "2026-08-30", status: "Open" },
  { id: "ACT-02", type: "Meeting", subject: "Boutique Collective PK — packing & hang-tag specs", related: "SO-1024", owner: "Areeba Malik", due: "2026-09-02", status: "Scheduled" },
  { id: "ACT-03", type: "Task", subject: "Send shade cards for Fairy Meadows lawn", related: "OP-3102", owner: "Mehreen Qazi", due: "2026-08-31", status: "Open" },
  { id: "ACT-04", type: "Call", subject: "UK Desi Wear — Matcha reorder inquiry", related: "CU-1004", owner: "Areeba Malik", due: "2026-08-28", status: "Done" },
  { id: "ACT-05", type: "Meeting", subject: "Karachi Multi-Brand Store visit", related: "LD-2203", owner: "Areeba Malik", due: "2026-09-05", status: "Scheduled" },
  { id: "ACT-06", type: "Task", subject: "Update credit limit for cocoon.pk Retail Customers", related: "CU-1003", owner: "Waqas Anwar", due: "2026-09-01", status: "Open" },
];

const typeIcon = {
  Call: Phone,
  Meeting: Calendar,
  Task: CheckSquare,
};

export default function ActivitiesPage() {
  const { toast } = useToast();
  const [items, setItems] = useState(initial);

  return (
    <div className="space-y-6 zr-section">
      <PageHeader
        title="Activities"
        description="Calls, meetings, and tasks tied to leads, opportunities, and customers."
        breadcrumbs={[
          { label: "CRM", href: "/crm" },
          { label: "Activities" },
        ]}
        actions={
          <CreateRecordDialog
            triggerLabel="Log activity"
            title="Log activity"
            description="Example: call a buyer to confirm GSM for lawn fabric."
            successTitle="Activity created"
            fields={[
              {
                name: "type",
                label: "Type",
                type: "select",
                options: ["Call", "Meeting", "Task"],
                defaultValue: "Call",
              },
              {
                name: "subject",
                label: "Subject",
                placeholder: "Confirm GSM for lawn fabric",
                defaultValue: "Follow up lawn print shade approval",
              },
              {
                name: "related",
                label: "Related record",
                placeholder: "SO-1024 / CU-1001 / OP-3101",
                defaultValue: "SO-1024",
                required: false,
              },
              {
                name: "owner",
                label: "Owner",
                defaultValue: "Areeba Malik",
              },
              {
                name: "due",
                label: "Due date",
                type: "date",
                defaultValue: "2026-09-10",
              },
            ]}
            onCreate={(values) => {
              const type = (values.type as Activity["type"]) || "Call";
              setItems((prev) => [
                {
                  id: `ACT-${String(prev.length + 1).padStart(2, "0")}`,
                  type,
                  subject: values.subject,
                  related: values.related || "—",
                  owner: values.owner,
                  due: values.due,
                  status: type === "Meeting" ? "Scheduled" : "Open",
                },
                ...prev,
              ]);
            }}
          />
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
                  className="rounded-xl"
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
    </div>
  );
}
