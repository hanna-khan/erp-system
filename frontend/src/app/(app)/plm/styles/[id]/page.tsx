"use client";

import { use } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatPill } from "@/components/shared/kpi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { colorSizeMatrix, bomLines, statusTone } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";

export default function StyleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  const styleId = id || "ST-BASIC-27";

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title={styleId}
        description="Men's Basic Tee · SS27 · linked to SO-1024 / PRO-7001"
        breadcrumbs={[{ label: "PLM", href: "/plm" }, { label: "Styles", href: "/plm/styles" }, { label: styleId }]}
        badge="Approved"
        actions={
          <>
            <Button variant="outline" asChild><Link href="/plm/techpacks">Tech pack</Link></Button>
            <Button onClick={() => toast({ title: "Style published", tone: "success" })}>Publish</Button>
          </>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatPill label="Season" value="SS27" tone="info" />
        <StatPill label="GSM" value="180" />
        <StatPill label="Colors" value={colorSizeMatrix.colors.length} />
        <StatPill label="BOM lines" value={bomLines.length} tone="success" />
      </div>
      <Tabs defaultValue="matrix">
        <TabsList>
          <TabsTrigger value="matrix">Color × size</TabsTrigger>
          <TabsTrigger value="bom">BOM</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
        </TabsList>
        <TabsContent value="matrix">
          <Card>
            <CardContent className="overflow-x-auto pt-6">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase text-[var(--muted)]">
                    <th className="px-3 py-2">Color</th>
                    {colorSizeMatrix.sizes.map((s) => <th key={s} className="px-3 py-2">{s}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {colorSizeMatrix.colors.map((c) => (
                    <tr key={c} className="border-t border-[var(--border)]">
                      <td className="px-3 py-2 font-medium">{c}</td>
                      {colorSizeMatrix.sizes.map((s) => (
                        <td key={s} className="px-3 py-2">{colorSizeMatrix.quantities[c]?.[s] ?? 0}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bom">
          <Card>
            <CardHeader><CardTitle>Bill of materials</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {bomLines.map((b) => (
                <div key={b.id} className="flex justify-between border-b border-[var(--border)] py-2">
                  <span>{b.component}</span>
                  <span className="text-[var(--muted)]">{b.qty} {b.unit}</span>
                </div>
              ))}
              <Button variant="outline" asChild className="mt-2"><Link href="/products/bom">Open BOM module</Link></Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="links">
          <Card>
            <CardContent className="flex flex-wrap gap-2 pt-6">
              <Badge variant={statusTone("Approved")}>SO-1024</Badge>
              <Button size="sm" variant="outline" asChild><Link href="/sales/orders/SO-1024">Sales order</Link></Button>
              <Button size="sm" variant="outline" asChild><Link href="/production/orders/PRO-7001">Production</Link></Button>
              <Button size="sm" variant="outline" asChild><Link href="/plm/samples">Samples</Link></Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
