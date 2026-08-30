"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { users, statusTone } from "@/mock/data";

type UserRow = {
  id: string;
  name: string;
  email: string;
  title: string;
  role: string;
  plant: string;
  status: string;
} & Record<string, unknown>;

const initialRows: UserRow[] = Object.values(users).map((u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  title: u.title,
  role: String(u.role),
  plant: u.plantId ?? "—",
  status: "Active",
}));

const columns: Column<UserRow>[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "title", label: "Title" },
  { key: "role", label: "Role" },
  { key: "plant", label: "Plant" },
  {
    key: "status",
    label: "Status",
    render: (r) => <Badge variant={statusTone(r.status)}>{r.status}</Badge>,
  },
];

export default function AdminUsersPage() {
  const [rows, setRows] = useState(initialRows);

  return (
    <div className="animate-fade-in space-y-6 zr-section">
      <PageHeader
        title="Users"
        description="Tenant user directory."
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Users" }]}
        actions={
          <>
            <Button variant="outline" asChild className="rounded-xl">
              <Link href="/admin/roles">Roles</Link>
            </Button>
            <CreateRecordDialog
              triggerLabel="Invite user"
              title="Invite user"
              description="Example: invite a production planner for SITE Karachi Plant."
              successTitle="Invite sent"
              fields={[
                { name: "name", label: "Full name", defaultValue: "New Planner" },
                { name: "email", label: "Email", type: "email", defaultValue: "planner@cocoon.pk" },
                { name: "title", label: "Title", defaultValue: "Production Planner" },
                {
                  name: "role",
                  label: "Role",
                  type: "select",
                  options: ["Admin", "Manager", "Supervisor", "Operator", "Viewer"],
                  defaultValue: "Manager",
                },
                {
                  name: "plant",
                  label: "Plant",
                  type: "select",
                  options: ["SITE Karachi Plant", "Karachi FG Warehouse", "Online Fulfillment Hub", "—"],
                  defaultValue: "SITE Karachi Plant",
                },
              ]}
              onCreate={(values) => {
                setRows((prev) => [
                  {
                    id: `usr-${prev.length + 1}`,
                    name: values.name,
                    email: values.email,
                    title: values.title,
                    role: values.role,
                    plant: values.plant,
                    status: "Invited",
                  },
                  ...prev,
                ]);
              }}
            />
          </>
        }
      />
      <DataTable
        data={rows}
        columns={columns}
        searchKeys={["name", "email", "role", "title", "status"]}
        searchPlaceholder="Search users..."
        statusKey="status"
        filterKey="status"
        exportName="users"
      />
    </div>
  );
}
