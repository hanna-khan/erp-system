"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export interface FormField {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "number" | "date" | "email" | "select";
  options?: string[];
  required?: boolean;
  defaultValue?: string;
}

interface CreateRecordDialogProps {
  triggerLabel: string;
  title: string;
  description?: string;
  fields: FormField[];
  successTitle?: string;
  onCreate?: (values: Record<string, string>) => void;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
}

export function CreateRecordDialog({
  triggerLabel,
  title,
  description = "Fill the form. This is a mockup — data stays in this session.",
  fields,
  successTitle = "Record created",
  onCreate,
  variant = "default",
  size = "sm",
}: CreateRecordDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, f.defaultValue ?? ""])),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reset = () => {
    setValues(Object.fromEntries(fields.map((f) => [f.name, f.defaultValue ?? ""])));
    setErrors({});
  };

  const submit = () => {
    const nextErrors: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.required !== false && !String(values[f.name] ?? "").trim()) {
        nextErrors[f.name] = "Required";
      }
    });
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      toast({ title: "Please complete required fields", tone: "error" });
      return;
    }
    onCreate?.(values);
    toast({
      title: successTitle,
      description: "Saved successfully in this mockup session.",
      tone: "success",
    });
    setOpen(false);
    reset();
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className="rounded-xl"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-3.5" /> {triggerLabel}
      </Button>
      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) reset();
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.name}
                className={field.type === "select" || field.name.includes("name") || field.name.includes("notes") ? "sm:col-span-2 space-y-2" : "space-y-2"}
              >
                <Label htmlFor={field.name}>
                  {field.label}
                  {field.required !== false ? " *" : ""}
                </Label>
                {field.type === "select" && field.options ? (
                  <select
                    id={field.name}
                    className="flex h-10 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm"
                    value={values[field.name] ?? ""}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                    }
                  >
                    <option value="">Select…</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id={field.name}
                    type={field.type ?? "text"}
                    placeholder={field.placeholder}
                    value={values[field.name] ?? ""}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                    }
                    className="rounded-xl"
                  />
                )}
                {errors[field.name] ? (
                  <p className="text-xs text-rose-500">{errors[field.name]}</p>
                ) : null}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              className="rounded-xl"
              onClick={() => {
                toast({ title: "Draft saved", description: "You can continue later.", tone: "info" });
                setOpen(false);
              }}
            >
              Save draft
            </Button>
            <Button className="rounded-xl" onClick={submit}>
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface ConfirmActionProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  confirmLabel?: string;
  tone?: "default" | "destructive";
  onConfirm: () => void;
}

export function ConfirmAction({
  trigger,
  title,
  description = "This action is simulated in the mockup.",
  confirmLabel = "Confirm",
  tone = "default",
  onConfirm,
}: ConfirmActionProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <span onClick={() => setOpen(true)} className="inline-flex cursor-pointer">
        {trigger}
      </span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={tone === "destructive" ? "destructive" : "default"}
              className="rounded-xl"
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
