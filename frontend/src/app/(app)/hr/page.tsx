"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { employees } from "@/mock/data";
import { CalendarDays, Clock, Users, Wallet } from "lucide-react";

const modules = [
  { href: "/hr/employees", title: "Employees", desc: "Master data, contracts, plants and shifts.", icon: Users, count: `${employees.length} people` },
  { href: "/hr/attendance", title: "Attendance", desc: "Daily punches, absences and overtime.", icon: CalendarDays, count: "Today 94% present" },
  { href: "/hr/payroll", title: "Payroll", desc: "Monthly runs, EOBI, tax and bank files.", icon: Wallet, count: "Aug run ready" },
  { href: "/hr/shifts", title: "Shifts", desc: "A/B/C and general shift templates.", icon: Clock, count: "4 templates" },
];

export default function HrPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Human Resources"
        description="Workforce for spinning, weaving, dyeing and garment operations."
        breadcrumbs={[{ label: "HR" }]}
      />

      <KpiGrid
        items={[
          { id: "head", label: "Headcount", value: String(employees.length + 181), tone: "info" },
          { id: "present", label: "Present Today", value: "94%", tone: "success" },
          { id: "leave", label: "On Leave", value: "7", tone: "warning" },
          { id: "ot", label: "OT Hours (Week)", value: "1,240" },
        ]}
        columns={4}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {modules.map((m) => (
          <Link key={m.href} href={m.href} className="group">
            <Card className="h-full transition-shadow hover:shadow-[var(--shadow-sm)]">
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
                  <m.icon className="size-5" />
                </div>
                <CardTitle className="group-hover:text-[var(--brand-primary)]">{m.title}</CardTitle>
                <CardDescription>{m.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-xs font-semibold text-[var(--muted)]">{m.count}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
