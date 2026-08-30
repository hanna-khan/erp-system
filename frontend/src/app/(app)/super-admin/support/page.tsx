"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const seed = [
  { id: "TK-301", tenant: "ABC Textile Mills", subject: "MES tablet sync delay", priority: "High", status: "Open" },
  { id: "TK-302", tenant: "Sunrise Knits", subject: "Need extra QC users", priority: "Medium", status: "Open" },
  { id: "TK-303", tenant: "Pearl Dyeing Works", subject: "Trial extension request", priority: "Low", status: "Pending" },
];

export default function SupportPage() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState(seed);

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Support" description="Tickets from tenant admins." breadcrumbs={[{ label: "Super Admin", href: "/super-admin" }, { label: "Support" }]} />
      <div className="space-y-3">
        {tickets.map((t) => (
          <Card key={t.id}>
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{t.subject}</p>
                  <Badge variant={t.priority === "High" ? "error" : t.priority === "Medium" ? "warning" : "info"}>{t.priority}</Badge>
                  <Badge variant="outline">{t.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-[var(--muted)]">{t.id} · {t.tenant}</p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setTickets((prev) => prev.map((x) => (x.id === t.id ? { ...x, status: "Resolved" } : x)));
                  toast({ title: "Ticket resolved", description: t.id, tone: "success" });
                }}
              >
                Resolve
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
