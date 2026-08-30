"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Factory } from "lucide-react";
import { cn } from "@/lib/utils";
import { getNavigationForRole } from "@/config/navigation";
import { useApp } from "@/hooks/use-app";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getNavIcon } from "@/components/navigation/nav-icons";
import { Badge } from "@/components/ui/badge";

export function Sidebar() {
  const pathname = usePathname();
  const { user, sidebarCollapsed, company, plant } = useApp();
  const navigation = getNavigationForRole(user.role);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    crm: true,
    sales: true,
    production: true,
  });

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] transition-all duration-200 lg:flex",
        sidebarCollapsed ? "w-[72px]" : "w-64",
      )}
    >
      <div className="flex items-center gap-3 px-4 pt-5 pb-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6b8cff] to-[#b8a9e8] text-sm font-bold text-white shadow-[var(--shadow-sm)]">
          Z
        </div>
        {!sidebarCollapsed ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-tight text-[var(--foreground)]">
              Zendrock ERP
            </p>
            <p className="truncate text-xs text-[var(--sidebar-muted)]">Textile Platform</p>
          </div>
        ) : null}
      </div>

      {!sidebarCollapsed ? (
        <div className="mx-3 mb-3 rounded-2xl bg-[var(--brand-primary-soft)] p-3">
          <div className="flex items-center gap-2">
            <Factory className="size-4 text-[var(--brand-primary)]" />
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-[var(--foreground)]">
                {company.shortName}
              </p>
              <p className="truncate text-[10px] text-[var(--muted)]">{plant.name}</p>
            </div>
          </div>
        </div>
      ) : null}

      <ScrollArea className="flex-1 px-3 py-2">
        <nav className="space-y-5 pb-6">
          {navigation.map((group) => (
            <div key={group.id}>
              {!sidebarCollapsed ? (
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--sidebar-muted)]">
                  {group.label}
                </p>
              ) : null}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = getNavIcon(item.icon);
                  const isActive =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const hasChildren = Boolean(item.children?.length);
                  const isExpanded = expanded[item.id] ?? isActive;

                  return (
                    <li key={item.id}>
                      <Link
                        href={hasChildren ? item.children![0].href : item.href}
                        onClick={
                          hasChildren
                            ? (e) => {
                                if (!sidebarCollapsed) {
                                  e.preventDefault();
                                  setExpanded((c) => ({ ...c, [item.id]: !c[item.id] }));
                                }
                              }
                            : undefined
                        }
                        className={cn(
                          "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[13px] font-medium transition-colors",
                          isActive
                            ? "bg-[var(--sidebar-active)] text-[var(--brand-primary)]"
                            : "text-slate-600 hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)]",
                          sidebarCollapsed && "justify-center px-0",
                        )}
                        title={sidebarCollapsed ? item.label : undefined}
                      >
                        <Icon className="size-[18px] shrink-0" />
                        {!sidebarCollapsed ? (
                          <>
                            <span className="min-w-0 flex-1 truncate">{item.label}</span>
                            {item.badge ? (
                              <Badge variant="info" className="text-[9px]">
                                {item.badge}
                              </Badge>
                            ) : null}
                            {hasChildren ? (
                              <ChevronDown
                                className={cn(
                                  "size-4 opacity-50 transition-transform",
                                  isExpanded && "rotate-180",
                                )}
                              />
                            ) : null}
                          </>
                        ) : null}
                      </Link>
                      {hasChildren && isExpanded && !sidebarCollapsed ? (
                        <ul className="mt-1 space-y-0.5 border-l border-[var(--border)] ml-5 pl-3">
                          {item.children!.map((child) => {
                            const childActive =
                              pathname === child.href || pathname.startsWith(`${child.href}/`);
                            return (
                              <li key={child.id}>
                                <Link
                                  href={child.href}
                                  className={cn(
                                    "block rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                                    childActive
                                      ? "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]"
                                      : "text-slate-500 hover:text-[var(--foreground)]",
                                  )}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
