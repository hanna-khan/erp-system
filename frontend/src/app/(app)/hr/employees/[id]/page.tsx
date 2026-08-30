"use client";

import { use } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatPill } from "@/components/shared/kpi";
import { Timeline } from "@/components/shared/workflow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { employees, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  const emp = employees.find((e) => e.id === id) ?? employees[0];

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title={emp.name}
        description={`${emp.designation} · ${emp.department}`}
        breadcrumbs={[
          { label: "HR", href: "/hr" },
          { label: "Employees", href: "/hr/employees" },
          { label: emp.id },
        ]}
        badge={emp.status}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/hr/payroll">Payroll</Link>
            </Button>
            <Button
              onClick={() =>
                toast({ title: "Profile updated", description: "Changes saved (mock).", tone: "success" })
              }
            >
              Save changes
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatPill label="Status" value={emp.status} tone={emp.status === "Active" ? "success" : "warning"} />
        <StatPill label="Plant" value={emp.plant} />
        <StatPill label="Shift" value={emp.shift} tone="info" />
        <StatPill label="Joined" value={formatDate(emp.joinDate)} />
        <StatPill label="Gross (mock)" value={formatCurrency(85000)} />
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="docs">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Employment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-[var(--muted)]">Employee ID</span><span>{emp.id}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted)]">Department</span><span>{emp.department}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted)]">Designation</span><span>{emp.designation}</span></div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Status</span>
                <Badge variant={statusTone(emp.status)}>{emp.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">Floor access</span>
                <Link href="/production-floor" className="text-[var(--brand-primary)] hover:underline">
                  MES tablet
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline
                events={[
                  { id: "1", title: "Clock-in Shift A", time: "Today 06:02", meta: emp.plant },
                  { id: "2", title: "Assigned to job PRO-7001", time: "Yesterday", meta: "Stitching" },
                  { id: "3", title: "Leave balance updated", time: "2026-08-01", meta: "12 casual remaining" },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="attendance">
          <Card>
            <CardContent className="pt-6">
              <Timeline
                events={[
                  { id: "a1", title: "Present — 8.2 hrs", time: "2026-08-29" },
                  { id: "a2", title: "Present — 8.0 hrs + 1.5 OT", time: "2026-08-28" },
                  { id: "a3", title: "Weekly off", time: "2026-08-27" },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="docs">
          <Card>
            <CardContent className="space-y-2 pt-6 text-sm text-[var(--muted)]">
              <p>CNIC copy · Verified</p>
              <p>Contract PDF · Active</p>
              <p>Bank letter · Meezan · ****4412</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
