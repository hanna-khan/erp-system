"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { notifications } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Bell, CheckCheck } from "lucide-react";

export default function NotificationsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState(notifications.map((n) => ({ ...n })));
  const unread = items.filter((n) => n.unread).length;

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Notifications"
        description="Approvals, alerts, inventory and production signals."
        breadcrumbs={[{ label: "Notifications" }]}
        badge={unread ? unread + " unread" : "All read"}
        actions={
          <Button
            variant="outline"
            onClick={() => {
              setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
              toast({ title: "All marked read", tone: "success" });
            }}
          >
            <CheckCheck className="size-4" /> Mark all read
          </Button>
        }
      />
      <div className="space-y-2">
        {items.map((n) => (
          <Card key={n.id} className={n.unread ? "border-[var(--brand-primary)]/30 bg-[var(--brand-primary-soft)]/40" : ""}>
            <CardContent className="flex items-start gap-3 p-4">
              <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-muted)] text-[var(--brand-primary)]">
                <Bell className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold">{n.title}</p>
                  <Badge variant="outline">{n.type}</Badge>
                  {n.unread ? <Badge variant="info">New</Badge> : null}
                </div>
                <p className="mt-0.5 text-sm text-[var(--muted)]">{n.body}</p>
                <p className="mt-1 text-[11px] text-[var(--muted)]">{n.time}</p>
              </div>
              <div className="flex flex-col gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x)));
                    toast({ title: "Marked read", tone: "success" });
                  }}
                >
                  Read
                </Button>
                {n.type === "approval" ? (
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/approvals">Open</Link>
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
