"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/shared/kpi";
import { DataTable } from "@/components/shared/data-table";
import { CreateRecordDialog } from "@/components/shared/create-dialog";
import { productionOrders } from "@/mock/data";
import { formatNumber, formatPercent } from "@/lib/utils";

type ProRow = (typeof productionOrders)[number] & Record<string, unknown>;

export default function ProductionOrdersPage() {
  const [rows, setRows] = useState<ProRow[]>(productionOrders as ProRow[]);

  return (
    <div className="space-y-6 zr-section">
      <PageHeader
        title="Production Orders"
        description="Release and track PROs across cutting, print, stitch and finishing."
        breadcrumbs={[
          { label: "Production", href: "/production" },
          { label: "Production Orders" },
        ]}
        actions={
          <CreateRecordDialog
            triggerLabel="Create order"
            title="Create production order"
            description="Example: release a garments PRO for 10,000 men's tees."
            successTitle="Production order created"
            fields={[
              {
                name: "so",
                label: "Sales order",
                type: "select",
                options: ["SO-1024", "SO-1025", "SO-1026", "SO-1027", "—"],
                defaultValue: "SO-1024",
              },
              {
                name: "product",
                label: "Product",
                type: "select",
                options: ["Prism Kaftaan 2-Piece", "Matcha | 2-Piece", "Fairy Meadows 2-Piece", "Printed Lawn Fabric (60\")", "Printed Lawn Fabric (60\")"],
                defaultValue: "Prism Kaftaan 2-Piece",
              },
              {
                name: "process",
                label: "Process",
                type: "select",
                options: ["Garments", "Printing", "Cutting", "Finishing", "Packing"],
                defaultValue: "Garments",
              },
              { name: "qty", label: "Target qty", type: "number", defaultValue: "5000" },
              {
                name: "plant",
                label: "Plant",
                type: "select",
                options: ["SITE Karachi Plant", "Karachi FG Warehouse", "Online Fulfillment Hub"],
                defaultValue: "SITE Karachi Plant",
              },
              { name: "start", label: "Start date", type: "date", defaultValue: "2026-09-01" },
              { name: "finish", label: "Finish date", type: "date", defaultValue: "2026-09-25" },
            ]}
            onCreate={(values) => {
              setRows((prev) => [
                {
                  id: `PRO-${7004 + prev.length}`,
                  so: values.so,
                  product: values.product,
                  process: values.process,
                  qty: Number(values.qty) || 0,
                  completed: 0,
                  plant: values.plant,
                  start: values.start,
                  finish: values.finish,
                  status: "Released",
                  efficiency: 0,
                },
                ...prev,
              ]);
            }}
          />
        }
      />

      <KpiGrid
        columns={4}
        items={[
          {
            id: "ip",
            label: "In progress",
            value: String(rows.filter((p) => p.status === "In Progress").length),
            tone: "warning",
          },
          {
            id: "rel",
            label: "Released",
            value: String(rows.filter((p) => p.status === "Released").length),
            tone: "info",
          },
          {
            id: "done",
            label: "Completed",
            value: String(rows.filter((p) => p.status === "Completed").length),
            tone: "success",
          },
          {
            id: "pcs",
            label: "Output (open)",
            value: formatNumber(
              rows
                .filter((p) => p.status !== "Completed")
                .reduce((s, p) => s + Number(p.completed), 0),
            ),
          },
        ]}
      />

      <DataTable
        data={rows as unknown as Record<string, unknown>[]}
        searchKeys={["id", "so", "product", "process", "plant", "status"]}
        searchPlaceholder="Search PROs..."
        statusKey="status"
        filterKey="status"
        exportName="production-orders"
        rowHref={(row) => `/production/orders/${row.id}`}
        columns={[
          { key: "id", label: "PRO #" },
          { key: "so", label: "Sales order" },
          { key: "product", label: "Product" },
          { key: "process", label: "Process" },
          {
            key: "qty",
            label: "Target",
            render: (row) => formatNumber(Number(row.qty)),
          },
          {
            key: "completed",
            label: "Completed",
            render: (row) => formatNumber(Number(row.completed)),
          },
          {
            key: "efficiency",
            label: "Efficiency",
            render: (row) => formatPercent(Number(row.efficiency)),
          },
          { key: "start", label: "Start" },
          { key: "finish", label: "Finish" },
          { key: "status", label: "Status" },
        ]}
      />
    </div>
  );
}
