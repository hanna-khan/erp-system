import type { NavGroup, UserRole } from "@/types";

const allOps: UserRole[] = [
  "tenant_admin",
  "ceo",
  "production_manager",
  "production_supervisor",
  "quality_manager",
  "procurement_manager",
  "warehouse_manager",
  "accountant",
  "hr_manager",
  "sales_manager",
  "maintenance_manager",
];

const exec: UserRole[] = ["tenant_admin", "ceo"];
const salesRoles: UserRole[] = [...exec, "sales_manager"];
const prodRoles: UserRole[] = [...exec, "production_manager", "production_supervisor"];
const qcRoles: UserRole[] = [...exec, "quality_manager", "production_manager"];
const procRoles: UserRole[] = [...exec, "procurement_manager"];
const whRoles: UserRole[] = [...exec, "warehouse_manager", "procurement_manager"];
const finRoles: UserRole[] = [...exec, "accountant"];
const hrRoles: UserRole[] = [...exec, "hr_manager"];
const maintRoles: UserRole[] = [...exec, "maintenance_manager", "production_manager"];

export const APP_NAV: NavGroup[] = [
  {
    id: "overview",
    label: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
      { id: "workflows", label: "Demo Workflows", href: "/workflows", icon: "GitBranch", roles: allOps },
      { id: "ai", label: "Zendrock AI", href: "/ai", icon: "Sparkles", roles: allOps, badge: "Beta" },
    ],
  },
  {
    id: "commercial",
    label: "Commercial",
    items: [
      {
        id: "crm",
        label: "CRM",
        href: "/crm",
        icon: "Handshake",
        roles: salesRoles,
        children: [
          { id: "crm-leads", label: "Leads", href: "/crm/leads", icon: "UserPlus" },
          { id: "crm-opportunities", label: "Opportunities", href: "/crm/opportunities", icon: "Target" },
          { id: "crm-customers", label: "Customers", href: "/crm/customers", icon: "Building2" },
          { id: "crm-activities", label: "Activities", href: "/crm/activities", icon: "Phone" },
        ],
      },
      {
        id: "sales",
        label: "Sales",
        href: "/sales",
        icon: "ShoppingCart",
        roles: salesRoles,
        children: [
          { id: "sales-quotations", label: "Quotations", href: "/sales/quotations", icon: "FileText" },
          { id: "sales-orders", label: "Sales Orders", href: "/sales/orders", icon: "ClipboardList" },
          { id: "sales-deliveries", label: "Delivery Orders", href: "/sales/deliveries", icon: "Truck" },
          { id: "sales-invoices", label: "Invoices", href: "/sales/invoices", icon: "Receipt" },
          { id: "sales-returns", label: "Returns", href: "/sales/returns", icon: "Undo2" },
        ],
      },
    ],
  },
  {
    id: "product",
    label: "Product",
    items: [
      {
        id: "products",
        label: "Product Master",
        href: "/products",
        icon: "Package",
        roles: [...salesRoles, ...prodRoles, ...qcRoles],
        children: [
          { id: "products-list", label: "Products", href: "/products", icon: "Boxes" },
          { id: "products-matrix", label: "Color × Size Matrix", href: "/products/matrix", icon: "Grid3x3" },
          { id: "products-bom", label: "BOM", href: "/products/bom", icon: "Layers" },
          { id: "products-process", label: "Process Templates", href: "/products/processes", icon: "Workflow" },
        ],
      },
      {
        id: "plm",
        label: "PLM",
        href: "/plm",
        icon: "Shirt",
        roles: [...salesRoles, ...prodRoles],
        children: [
          { id: "plm-styles", label: "Styles", href: "/plm/styles", icon: "Palette" },
          { id: "plm-samples", label: "Samples", href: "/plm/samples", icon: "FlaskConical" },
          { id: "plm-techpacks", label: "Tech Packs", href: "/plm/techpacks", icon: "FileStack" },
        ],
      },
    ],
  },
  {
    id: "supply",
    label: "Supply Chain",
    items: [
      {
        id: "procurement",
        label: "Procurement",
        href: "/procurement",
        icon: "ShoppingBag",
        roles: procRoles,
        children: [
          { id: "proc-suppliers", label: "Suppliers", href: "/procurement/suppliers", icon: "Factory" },
          { id: "proc-pr", label: "Requisitions", href: "/procurement/requisitions", icon: "FilePlus" },
          { id: "proc-rfq", label: "RFQs", href: "/procurement/rfqs", icon: "MessagesSquare" },
          { id: "proc-po", label: "Purchase Orders", href: "/procurement/orders", icon: "ClipboardCheck" },
          { id: "proc-grn", label: "Goods Receipts", href: "/procurement/receipts", icon: "PackageCheck" },
        ],
      },
      {
        id: "inventory",
        label: "Inventory",
        href: "/inventory",
        icon: "Warehouse",
        roles: whRoles,
        children: [
          { id: "inv-overview", label: "Stock Overview", href: "/inventory", icon: "Boxes" },
          { id: "inv-ledger", label: "Stock Ledger", href: "/inventory/ledger", icon: "BookOpen" },
          { id: "inv-movements", label: "Movements", href: "/inventory/movements", icon: "ArrowLeftRight" },
          { id: "inv-batches", label: "Batches & Lots", href: "/inventory/batches", icon: "Hash" },
          { id: "inv-valuation", label: "Valuation", href: "/inventory/valuation", icon: "Coins" },
        ],
      },
      {
        id: "warehouse",
        label: "Warehouse",
        href: "/warehouse",
        icon: "Building",
        roles: whRoles,
        children: [
          { id: "wh-dashboard", label: "Dashboard", href: "/warehouse", icon: "LayoutGrid" },
          { id: "wh-locations", label: "Locations", href: "/warehouse/locations", icon: "MapPin" },
          { id: "wh-picking", label: "Pick Lists", href: "/warehouse/picking", icon: "ListChecks" },
          { id: "wh-scan", label: "Barcode Scan", href: "/warehouse/scan", icon: "ScanBarcode" },
        ],
      },
    ],
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    items: [
      {
        id: "production",
        label: "Production",
        href: "/production",
        icon: "Factory",
        roles: prodRoles,
        children: [
          { id: "prod-dashboard", label: "Dashboard", href: "/production", icon: "Gauge" },
          { id: "prod-orders", label: "Production Orders", href: "/production/orders", icon: "ClipboardList" },
          { id: "prod-workorders", label: "Work Orders", href: "/production/work-orders", icon: "Wrench" },
          { id: "prod-jobcards", label: "Job Cards", href: "/production/job-cards", icon: "IdCard" },
          { id: "prod-floor", label: "Production Floor", href: "/production-floor", icon: "MonitorSmartphone" },
        ],
      },
      {
        id: "planning",
        label: "Planning & MRP",
        href: "/planning",
        icon: "CalendarRange",
        roles: [...prodRoles, ...procRoles],
        children: [
          { id: "plan-mps", label: "Master Schedule", href: "/planning", icon: "Calendar" },
          { id: "plan-mrp", label: "MRP", href: "/planning/mrp", icon: "Calculator" },
          { id: "plan-capacity", label: "Capacity", href: "/planning/capacity", icon: "Activity" },
          { id: "plan-calendar", label: "Planning Calendar", href: "/planning/calendar", icon: "CalendarDays" },
        ],
      },
      {
        id: "quality",
        label: "Quality Control",
        href: "/quality",
        icon: "ShieldCheck",
        roles: qcRoles,
        children: [
          { id: "qc-dashboard", label: "Dashboard", href: "/quality", icon: "Shield" },
          { id: "qc-inspections", label: "Inspections", href: "/quality/inspections", icon: "SearchCheck" },
          { id: "qc-defects", label: "Defects", href: "/quality/defects", icon: "Bug" },
          { id: "qc-ncr", label: "NCR / CAPA", href: "/quality/ncr", icon: "AlertTriangle" },
          { id: "qc-fabric", label: "Fabric Inspection", href: "/quality/fabric", icon: "Scan" },
        ],
      },
      {
        id: "costing",
        label: "Costing",
        href: "/costing",
        icon: "Calculator",
        roles: [...exec, "accountant", "production_manager"],
        children: [
          { id: "cost-dashboard", label: "Dashboard", href: "/costing", icon: "PieChart" },
          { id: "cost-sheets", label: "Cost Sheets", href: "/costing/sheets", icon: "Table" },
          { id: "cost-profitability", label: "Profitability", href: "/costing/profitability", icon: "TrendingUp" },
        ],
      },
    ],
  },
  {
    id: "assets-ops",
    label: "Assets & Ops",
    items: [
      {
        id: "machines",
        label: "Machines",
        href: "/machines",
        icon: "Cog",
        roles: maintRoles,
      },
      {
        id: "maintenance",
        label: "Maintenance",
        href: "/maintenance",
        icon: "Hammer",
        roles: maintRoles,
      },
      {
        id: "subcontracting",
        label: "Subcontracting",
        href: "/subcontracting",
        icon: "Network",
        roles: [...prodRoles, ...procRoles],
      },
      {
        id: "dispatch",
        label: "Dispatch & Logistics",
        href: "/dispatch",
        icon: "Truck",
        roles: [...whRoles, ...salesRoles],
      },
      {
        id: "assets",
        label: "Assets",
        href: "/assets",
        icon: "Landmark",
        roles: [...finRoles, ...maintRoles],
      },
    ],
  },
  {
    id: "enterprise",
    label: "Enterprise",
    items: [
      {
        id: "finance",
        label: "Finance",
        href: "/finance",
        icon: "Wallet",
        roles: finRoles,
        children: [
          { id: "fin-dashboard", label: "Dashboard", href: "/finance", icon: "LineChart" },
          { id: "fin-coa", label: "Chart of Accounts", href: "/finance/coa", icon: "BookMarked" },
          { id: "fin-gl", label: "General Ledger", href: "/finance/gl", icon: "BookOpen" },
          { id: "fin-ar", label: "Receivables", href: "/finance/ar", icon: "ArrowDownLeft" },
          { id: "fin-ap", label: "Payables", href: "/finance/ap", icon: "ArrowUpRight" },
          { id: "fin-reports", label: "Financial Reports", href: "/finance/reports", icon: "FileBarChart" },
        ],
      },
      {
        id: "hr",
        label: "HR & Payroll",
        href: "/hr",
        icon: "Users",
        roles: hrRoles,
        children: [
          { id: "hr-dashboard", label: "Dashboard", href: "/hr", icon: "UserRound" },
          { id: "hr-employees", label: "Employees", href: "/hr/employees", icon: "BadgeCheck" },
          { id: "hr-attendance", label: "Attendance", href: "/hr/attendance", icon: "Clock" },
          { id: "hr-payroll", label: "Payroll", href: "/hr/payroll", icon: "Banknote" },
          { id: "hr-shifts", label: "Shifts", href: "/hr/shifts", icon: "CalendarClock" },
        ],
      },
      {
        id: "reports",
        label: "Reports & Analytics",
        href: "/reports",
        icon: "BarChart3",
        roles: allOps,
      },
      {
        id: "notifications",
        label: "Notifications",
        href: "/notifications",
        icon: "Bell",
      },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      {
        id: "organization",
        label: "Organization",
        href: "/organization",
        icon: "Building2",
        roles: exec,
      },
      {
        id: "approvals",
        label: "Approvals",
        href: "/approvals",
        icon: "CheckCheck",
        roles: allOps,
      },
      {
        id: "workflow-builder",
        label: "Workflow Builder",
        href: "/admin/workflows",
        icon: "GitMerge",
        roles: exec,
      },
      {
        id: "admin",
        label: "Administration",
        href: "/admin",
        icon: "Shield",
        roles: exec,
        children: [
          { id: "admin-users", label: "Users", href: "/admin/users", icon: "UserCog" },
          { id: "admin-roles", label: "Roles", href: "/admin/roles", icon: "KeyRound" },
          { id: "admin-audit", label: "Audit Logs", href: "/admin/audit", icon: "ScrollText" },
        ],
      },
      {
        id: "settings",
        label: "Settings",
        href: "/settings",
        icon: "Settings",
        roles: exec,
      },
      {
        id: "super-admin",
        label: "Super Admin",
        href: "/super-admin",
        icon: "Crown",
        roles: ["super_admin"],
      },
    ],
  },
];

export function getNavigationForRole(role: UserRole): NavGroup[] {
  if (role === "super_admin") {
    return [
      {
        id: "platform",
        label: "Platform",
        items: [
          { id: "sa-dashboard", label: "Platform Dashboard", href: "/super-admin", icon: "LayoutDashboard" },
          { id: "sa-tenants", label: "Tenants", href: "/super-admin/tenants", icon: "Building" },
          { id: "sa-plans", label: "Subscriptions", href: "/super-admin/subscriptions", icon: "CreditCard" },
          { id: "sa-billing", label: "Billing", href: "/super-admin/billing", icon: "Receipt" },
          { id: "sa-support", label: "Support", href: "/super-admin/support", icon: "LifeBuoy" },
        ],
      },
    ];
  }

  if (role === "factory_worker") {
    return [
      {
        id: "ops",
        label: "My Work",
        items: [
          { id: "floor", label: "Production Floor", href: "/production-floor", icon: "MonitorSmartphone" },
          { id: "my-jobs", label: "My Job Cards", href: "/production/job-cards", icon: "IdCard" },
          { id: "attendance", label: "Attendance", href: "/hr/attendance", icon: "Clock" },
        ],
      },
    ];
  }

  return APP_NAV.map((group) => ({
    ...group,
    items: group.items
      .filter((item) => !item.roles || item.roles.includes(role))
      .map((item) => ({
        ...item,
        children: item.children?.filter((c) => !c.roles || c.roles.includes(role)),
      })),
  })).filter((group) => group.items.length > 0);
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  tenant_admin: "Tenant Admin",
  ceo: "CEO / Director",
  production_manager: "Production Manager",
  production_supervisor: "Production Supervisor",
  quality_manager: "Quality Manager",
  procurement_manager: "Procurement Manager",
  warehouse_manager: "Warehouse Manager",
  accountant: "Accountant",
  hr_manager: "HR Manager",
  sales_manager: "Sales Manager",
  maintenance_manager: "Maintenance Manager",
  factory_worker: "Factory Worker",
};
