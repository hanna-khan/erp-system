export type UserRole =
  | "super_admin"
  | "tenant_admin"
  | "ceo"
  | "production_manager"
  | "production_supervisor"
  | "quality_manager"
  | "procurement_manager"
  | "warehouse_manager"
  | "accountant"
  | "hr_manager"
  | "sales_manager"
  | "maintenance_manager"
  | "factory_worker";

export type StatusTone = "default" | "success" | "warning" | "error" | "info" | "outline";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  roles?: UserRole[];
  children?: NavItem[];
  badge?: string;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export interface Company {
  id: string;
  name: string;
  shortName: string;
  ntn: string;
  strn: string;
  currency: string;
  fiscalYear: string;
  address: string;
  city: string;
  phone: string;
  email: string;
}

export interface Plant {
  id: string;
  companyId: string;
  name: string;
  city: string;
  type: string;
}

export interface Branch {
  id: string;
  companyId: string;
  name: string;
  city: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatar?: string;
  plantId?: string;
}

export interface KpiCard {
  id: string;
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  tone?: StatusTone;
  hint?: string;
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

export interface WorkflowStep {
  id: string;
  label: string;
  status: "completed" | "current" | "upcoming" | "failed";
  href?: string;
  meta?: string;
}

export interface AuditEvent {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  previousValue?: string;
  newValue?: string;
}
