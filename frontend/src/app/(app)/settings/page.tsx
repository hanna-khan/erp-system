"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { company } from "@/mock/data";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/hooks/use-app";

const themes = [
  { id: "soft-blue", label: "Soft blue", swatch: "#6b8cff" },
  { id: "soft-teal", label: "Soft teal", swatch: "#5bb8a8" },
  { id: "soft-slate", label: "Soft slate", swatch: "#64748b" },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const { language, setLanguage } = useApp();
  const [currency, setCurrency] = useState(company.currency);
  const [ntn, setNtn] = useState(company.ntn);
  const [strn, setStrn] = useState(company.strn);
  const [uom, setUom] = useState("KG / MTR / PCS");
  const [email, setEmail] = useState(company.email);
  const [theme, setTheme] = useState("soft-blue");

  const save = (section: string) =>
    toast({ title: "Settings saved", description: section + " updated.", tone: "success" });

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Settings"
        description="Tax (PKR / NTN), currency, UOM, email and soft theme colors."
        breadcrumbs={[{ label: "Settings" }]}
      />

      <Tabs defaultValue="localization">
        <TabsList>
          <TabsTrigger value="localization">Localization</TabsTrigger>
          <TabsTrigger value="tax">Tax / NTN</TabsTrigger>
          <TabsTrigger value="uom">UOM</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
        </TabsList>

        <TabsContent value="localization">
          <Card>
            <CardHeader>
              <CardTitle>Localization</CardTitle>
              <CardDescription>Currency and language for Cocoon Clothing.</CardDescription>
            </CardHeader>
            <CardContent className="grid max-w-lg gap-4">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Input value={currency} onChange={(e) => setCurrency(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Input value={language} onChange={(e) => setLanguage(e.target.value)} />
              </div>
              <Button onClick={() => save("Localization")}>Save</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax">
          <Card>
            <CardHeader>
              <CardTitle>Pakistan tax</CardTitle>
              <CardDescription>NTN / STRN for FBR compliance.</CardDescription>
            </CardHeader>
            <CardContent className="grid max-w-lg gap-4">
              <div className="space-y-2"><Label>NTN</Label><Input value={ntn} onChange={(e) => setNtn(e.target.value)} /></div>
              <div className="space-y-2"><Label>STRN</Label><Input value={strn} onChange={(e) => setStrn(e.target.value)} /></div>
              <Button onClick={() => save("Tax")}>Save</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="uom">
          <Card>
            <CardHeader>
              <CardTitle>Units of measure</CardTitle>
              <CardDescription>Default textile UOMs.</CardDescription>
            </CardHeader>
            <CardContent className="grid max-w-lg gap-4">
              <div className="space-y-2"><Label>Default UOM set</Label><Input value={uom} onChange={(e) => setUom(e.target.value)} /></div>
              <Button onClick={() => save("UOM")}>Save</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email</CardTitle>
              <CardDescription>Outbound notifications and document mail.</CardDescription>
            </CardHeader>
            <CardContent className="grid max-w-lg gap-4">
              <div className="space-y-2"><Label>From address</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <Button onClick={() => save("Email")}>Save</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle>Soft theme colors</CardTitle>
              <CardDescription>Premium soft palette (no harsh dark neon).</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {themes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTheme(t.id);
                    toast({ title: "Theme applied", description: t.label, tone: "success" });
                  }}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-3 ${theme === t.id ? "border-[var(--brand-primary)] bg-[var(--brand-primary-soft)]" : "border-[var(--border)]"}`}
                >
                  <span className="size-4 rounded-full" style={{ background: t.swatch }} />
                  <span className="text-sm font-medium">{t.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
