"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { users, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

const rows = Object.values(users).map((u) => ({
  ...u,
  plant: u.plantId ?? "—",
})) as Array<(typeof users)[keyof typeof users] & { plant: string } & Record<string, unknown>>;

const columns: Column<(typeof rows)[number]>[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "title", label: "Title" },
  { key: "role", label: "Role" },
  { key: "plant", label: "Plant" },
  {
    key: "role",
    label: "Status",
    render: () => <Badge variant={statusTone("Active")}>Active</Badge>,
  },
];

export default function AdminUsersPage() {
  const { toast } = useToast();
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Users"
        description="Tenant user directory."
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Users" }]}
        actions={
          <>
            <Button variant="outline" asChild><Link href="/admin/roles">Roles</Link></Button>
            <Button onClick={() => toast({ title: "Invite sent", description: "User invite queued.", tone: "success" })}>
              <Plus className="size-4" /> Invite user
            </Button>
          </>
        }
      />
      <DataTable data={rows} columns={columns} searchKeys={["name", "email", "role", "title"]} searchPlaceholder="Search users..." />
    </div>
  );
}
