"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send } from "lucide-react";

type Msg = { id: string; role: "user" | "assistant"; text: string };

const answers: Record<string, string> = {
  greige: "Greige fabric is unfinished cloth from weaving/knitting before dyeing or finishing. Track it as WIP in inventory with GSM, width and lot.",
  gsm: "GSM (grams per square meter) measures fabric weight. For tees, 160–180 GSM is common; polos often 200–220 GSM.",
  oee: "OEE = Availability × Performance × Quality. In Zendrock, machine downtime, target vs actual pcs and rejection rate feed OEE KPIs.",
  ntn: "NTN is the National Tax Number for Pakistani companies. Set it under Settings → Tax / NTN for invoices and statutory reports.",
  dyeing: "Dyeing workflow: batch create → recipe → chemical issue → dye → wash → dry → QC. Failed shade batches route to rework/CAPA.",
  default:
    "I can help with textile ERP topics — greige, GSM, OEE, dyeing, MRP shortages, NTN/STRN, costing and dispatch docs. Try asking about GSM or dyeing workflow.",
};

function replyFor(q: string) {
  const s = q.toLowerCase();
  if (s.includes("greige")) return answers.greige;
  if (s.includes("gsm")) return answers.gsm;
  if (s.includes("oee")) return answers.oee;
  if (s.includes("ntn") || s.includes("strn") || s.includes("tax")) return answers.ntn;
  if (s.includes("dye")) return answers.dyeing;
  return answers.default;
}

export default function AiPage() {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: "m0",
      role: "assistant",
      text: "Hi — I'm Zendrock AI. Ask about greige fabric, GSM, OEE, dyeing, NTN or MRP.",
    },
  ]);

  const send = () => {
    const q = input.trim();
    if (!q) return;
    const userMsg: Msg = { id: "u-" + Date.now(), role: "user", text: q };
    const botMsg: Msg = { id: "a-" + Date.now(), role: "assistant", text: replyFor(q) };
    setMsgs((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Zendrock AI"
        description="Mock textile Q&A assistant for operators and planners."
        breadcrumbs={[{ label: "Zendrock AI" }]}
        badge="Beta"
      />
      <Card className="overflow-hidden">
        <CardContent className="flex h-[min(70vh,640px)] flex-col p-0">
          <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--brand-primary-soft)]/50 px-4 py-3">
            <Sparkles className="size-4 text-[var(--brand-primary)]" />
            <p className="text-sm font-semibold">Chat</p>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {msgs.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    m.role === "user"
                      ? "ml-auto bg-[var(--brand-primary)] text-white"
                      : "bg-[var(--surface-muted)] text-[var(--foreground)]"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex gap-2 border-t border-[var(--border)] p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about GSM, dyeing, OEE..."
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <Button onClick={send}><Send className="size-4" /></Button>
          </div>
          <div className="flex flex-wrap gap-2 px-3 pb-3">
            {["What is greige?", "Explain GSM", "How is OEE calculated?", "Dyeing workflow"].map((q) => (
              <Button key={q} size="sm" variant="outline" onClick={() => { setInput(q); }}>
                {q}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
