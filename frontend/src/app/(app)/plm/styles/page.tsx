"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

const styles = [
  { id: "ST-BASIC-27", name: "Men's Basic Tee", season: "SS27", category: "Knit", customer: "Fashion Retailer A", status: "Approved", samples: 3 },
  { id: "ST-POLO-26", name: "Core Polo", season: "AW26", category: "Knit", customer: "Nordic Apparel AS", status: "In Development", samples: 2 },
  { id: "ST-DF-58", name: "Reactive Dyed Fabric", season: "SS27", category: "Fabric", customer: "Export Customer B", status: "Approved", samples: 1 },
  { id: "ST-DENIM-01", name: "Denim Shirt", season: "AW26", category: "Woven", customer: "Denim House PK", status: "Draft", samples: 0 },
];

type Row = (typeof styles)[number] & Record<string, unknown>;

const columns: Column<Row>[] = [
  { key: "id", label: "Style #" },
  { key: "name", label: "Name" },
  { key: "season", label: "Season" },
  { key: "category", label: "Category" },
  { key: "customer", label: "Customer" },
  { key: "samples", label: "Samples" },
  { key: "status", label: "Status", render: (r) => <Badge variant={statusTone(r.status)}>{r.status}</Badge> },
];

export default function PlmStylesPage() {
  const { toast } = useToast();
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Styles"
        description="Style master for garments and fabric programs."
        breadcrumbs={[{ label: "PLM", href: "/plm" }, { label: "Styles" }]}
        actions={
          <>
            <Button variant="outline" asChild><Link href="/plm/samples">Samples</Link></Button>
            <Button onClick={() => toast({ title: "Style draft", description: "New style created.", tone: "success" })}><Plus className="size-4" /> New style</Button>
          </>
        }
      />
      <DataTable data={styles as Row[]} columns={columns} searchKeys={["id", "name", "season", "customer", "status"]} searchPlaceholder="Search styles..." rowHref={(r) => "/plm/styles/" + r.id} />
    </div>
  );
}
