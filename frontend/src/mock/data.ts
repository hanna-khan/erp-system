import type { AuditEvent, Branch, Company, KpiCard, Plant, User, UserRole, WorkflowStep } from "@/types";

export const company: Company = {
  id: "co-abc",
  name: "ABC Textile Mills (Pvt) Ltd",
  shortName: "ABC Textiles",
  ntn: "1234567-8",
  strn: "3277876123456",
  currency: "PKR",
  fiscalYear: "FY 2025-26",
  address: "Plot 42, Korangi Industrial Area",
  city: "Karachi",
  phone: "+92 21 3512 4488",
  email: "ops@abctextiles.pk",
};

export const plants: Plant[] = [
  { id: "pl-khi", companyId: "co-abc", name: "Karachi Plant", city: "Karachi", type: "Integrated" },
  { id: "pl-lhr", companyId: "co-abc", name: "Lahore Plant", city: "Lahore", type: "Garments" },
  { id: "pl-fsd", companyId: "co-abc", name: "Faisalabad Plant", city: "Faisalabad", type: "Weaving & Dyeing" },
];

export const branches: Branch[] = [
  { id: "br-khi", companyId: "co-abc", name: "Karachi Head Office", city: "Karachi" },
  { id: "br-lhr", companyId: "co-abc", name: "Lahore Sales Office", city: "Lahore" },
  { id: "br-fsd", companyId: "co-abc", name: "Faisalabad Ops", city: "Faisalabad" },
];

export const users: Record<UserRole, User> = {
  super_admin: { id: "u-sa", name: "Platform Admin", email: "admin@zendrock.com", role: "super_admin", title: "Super Admin" },
  tenant_admin: { id: "u-ta", name: "Sara Khan", email: "sara@abctextiles.pk", role: "tenant_admin", title: "Tenant Admin", plantId: "pl-khi" },
  ceo: { id: "u-ceo", name: "Imran Malik", email: "imran@abctextiles.pk", role: "ceo", title: "CEO", plantId: "pl-khi" },
  production_manager: { id: "u-pm", name: "Ahmed Raza", email: "ahmed@abctextiles.pk", role: "production_manager", title: "Production Manager", plantId: "pl-fsd" },
  production_supervisor: { id: "u-ps", name: "Bilal Hussain", email: "bilal@abctextiles.pk", role: "production_supervisor", title: "Shift Supervisor", plantId: "pl-fsd" },
  quality_manager: { id: "u-qm", name: "Nadia Sheikh", email: "nadia@abctextiles.pk", role: "quality_manager", title: "Quality Manager", plantId: "pl-khi" },
  procurement_manager: { id: "u-pr", name: "Omar Farooq", email: "omar@abctextiles.pk", role: "procurement_manager", title: "Procurement Manager", plantId: "pl-khi" },
  warehouse_manager: { id: "u-wh", name: "Fatima Ali", email: "fatima@abctextiles.pk", role: "warehouse_manager", title: "Warehouse Manager", plantId: "pl-khi" },
  accountant: { id: "u-ac", name: "Hassan Qureshi", email: "hassan@abctextiles.pk", role: "accountant", title: "Finance Controller", plantId: "pl-khi" },
  hr_manager: { id: "u-hr", name: "Ayesha Noor", email: "ayesha@abctextiles.pk", role: "hr_manager", title: "HR Manager", plantId: "pl-khi" },
  sales_manager: { id: "u-sm", name: "Zainab Rizvi", email: "zainab@abctextiles.pk", role: "sales_manager", title: "Sales Manager", plantId: "pl-khi" },
  maintenance_manager: { id: "u-mm", name: "Kamran Shah", email: "kamran@abctextiles.pk", role: "maintenance_manager", title: "Maintenance Head", plantId: "pl-fsd" },
  factory_worker: { id: "u-fw", name: "Usman Tariq", email: "usman@abctextiles.pk", role: "factory_worker", title: "Machine Operator", plantId: "pl-fsd" },
};

export const dashboardKpis: {
  financial: KpiCard[];
  production: KpiCard[];
  machines: KpiCard[];
  inventory: KpiCard[];
  sales: KpiCard[];
} = {
  financial: [
    { id: "rev", label: "Revenue (MTD)", value: "PKR 184.2M", change: "+8.4%", trend: "up" },
    { id: "gp", label: "Gross Profit", value: "PKR 46.8M", change: "+3.1%", trend: "up" },
    { id: "np", label: "Net Profit", value: "PKR 21.4M", change: "+1.8%", trend: "up" },
    { id: "ar", label: "Receivables", value: "PKR 62.5M", change: "-4.2%", trend: "down", tone: "warning" },
    { id: "ap", label: "Payables", value: "PKR 38.1M", change: "+2.0%", trend: "up" },
    { id: "cash", label: "Cash Balance", value: "PKR 29.7M", change: "+5.6%", trend: "up", tone: "success" },
  ],
  production: [
    { id: "today", label: "Today's Production", value: "48,620 pcs", change: "96% of target", trend: "up" },
    { id: "target", label: "Production Target", value: "50,500 pcs", hint: "All plants" },
    { id: "eff", label: "Efficiency", value: "87.4%", change: "+1.2%", trend: "up", tone: "success" },
    { id: "wip", label: "WIP Value", value: "PKR 41.2M", tone: "info" },
    { id: "rej", label: "Rejection Rate", value: "2.8%", change: "-0.4%", trend: "down", tone: "success" },
    { id: "rew", label: "Rework Rate", value: "1.6%", change: "+0.2%", trend: "up", tone: "warning" },
  ],
  machines: [
    { id: "util", label: "Utilization", value: "82%", trend: "up" },
    { id: "run", label: "Running", value: "146", tone: "success" },
    { id: "idle", label: "Idle", value: "18", tone: "warning" },
    { id: "bd", label: "Breakdown", value: "4", tone: "error" },
    { id: "dt", label: "Downtime (Today)", value: "6.4 hrs", tone: "warning" },
  ],
  inventory: [
    { id: "rm", label: "Raw Material", value: "PKR 78.4M" },
    { id: "wip", label: "WIP Stock", value: "PKR 41.2M" },
    { id: "fg", label: "Finished Goods", value: "PKR 92.6M" },
    { id: "low", label: "Low Stock Items", value: "23", tone: "warning" },
    { id: "val", label: "Total Stock Value", value: "PKR 212.2M", tone: "info" },
  ],
  sales: [
    { id: "open", label: "Open Orders", value: "86" },
    { id: "pend", label: "Pending Delivery", value: "34", tone: "warning" },
    { id: "del", label: "Delivered (MTD)", value: "128" },
    { id: "od", label: "Overdue", value: "7", tone: "error" },
    { id: "ff", label: "Fulfillment", value: "91.2%", tone: "success" },
  ],
};

export const revenueTrend = [
  { month: "Mar", revenue: 142, production: 38, sales: 128 },
  { month: "Apr", revenue: 151, production: 41, sales: 136 },
  { month: "May", revenue: 148, production: 39, sales: 132 },
  { month: "Jun", revenue: 167, production: 44, sales: 149 },
  { month: "Jul", revenue: 172, production: 46, sales: 155 },
  { month: "Aug", revenue: 184, production: 49, sales: 168 },
];

export const customers = [
  { id: "CU-1001", name: "Fashion Retailer A", type: "Domestic", city: "Lahore", outstanding: 8450000, orders: 24, status: "Active", contact: "Sana Iqbal", phone: "+92 42 3577 1200", email: "orders@fashionretailera.pk" },
  { id: "CU-1002", name: "Export Customer B", type: "Export", city: "Dubai", outstanding: 22150000, orders: 18, status: "Active", contact: "James Cole", phone: "+971 4 555 8890", email: "buying@exportb.com" },
  { id: "CU-1003", name: "Local Distributor C", type: "Domestic", city: "Karachi", outstanding: 4120000, orders: 41, status: "Active", contact: "Rizwan Ahmed", phone: "+92 21 3456 7788", email: "rizwan@distributorc.pk" },
  { id: "CU-1004", name: "Nordic Apparel AS", type: "Export", city: "Oslo", outstanding: 15780000, orders: 9, status: "Active", contact: "Ingrid Solberg", phone: "+47 22 00 1122", email: "procurement@nordicap.com" },
  { id: "CU-1005", name: "Home Textiles Plus", type: "Domestic", city: "Faisalabad", outstanding: 980000, orders: 12, status: "On Hold", contact: "Mehwish Tariq", phone: "+92 41 2611 3344", email: "mehwish@hometextiles.pk" },
];

export const leads = [
  { id: "LD-2201", company: "Urban Wear Co.", contact: "Ali Rehman", source: "Exhibition", industry: "Garments", status: "Qualified", owner: "Zainab Rizvi", value: 12500000, closeDate: "2026-09-15" },
  { id: "LD-2202", company: "Gulf Retail Group", contact: "Farah Al-Najjar", source: "Referral", industry: "Retail", status: "New", owner: "Zainab Rizvi", value: 28000000, closeDate: "2026-10-01" },
  { id: "LD-2203", company: "Denim House PK", contact: "Shahid Mehmood", source: "Website", industry: "Denim", status: "Contacted", owner: "Imran Sales", value: 8200000, closeDate: "2026-09-28" },
];

export const opportunities = [
  { id: "OP-3101", name: "SS27 Basic Tee Program", customer: "Fashion Retailer A", stage: "Negotiation", probability: 70, revenue: 18500000, closeDate: "2026-09-20" },
  { id: "OP-3102", name: "Dyed Fabric Contract Q4", customer: "Export Customer B", stage: "Proposal", probability: 55, revenue: 42000000, closeDate: "2026-10-12" },
  { id: "OP-3103", name: "Polo Shirt Bulk Order", customer: "Nordic Apparel AS", stage: "Won", probability: 100, revenue: 24600000, closeDate: "2026-08-18" },
];

export const products = [
  { id: "PR-Y30", code: "YRN-CTN-30S", name: "Cotton Yarn 30s", type: "Yarn", category: "Spinning", unit: "KG", gsm: null, width: null, status: "Active", stock: 84200, price: 620 },
  { id: "PR-F180", code: "FAB-CTN-180", name: "Cotton Fabric 180 GSM", type: "Fabric", category: "Weaving", unit: "MTR", gsm: 180, width: 58, status: "Active", stock: 126500, price: 285 },
  { id: "PR-PF", code: "FAB-PES-140", name: "Polyester Fabric", type: "Fabric", category: "Weaving", unit: "MTR", gsm: 140, width: 60, status: "Active", stock: 64200, price: 210 },
  { id: "PR-DF", code: "FAB-DYE-200", name: "Dyed Fabric Reactive", type: "Fabric", category: "Dyeing", unit: "MTR", gsm: 200, width: 58, status: "Active", stock: 38900, price: 420 },
  { id: "PR-TS", code: "GAR-TSH-MENS", name: "Men's T-Shirt", type: "Garment", category: "Apparel", unit: "PCS", gsm: 180, width: null, status: "Active", stock: 28400, price: 890 },
  { id: "PR-PO", code: "GAR-POL-MENS", name: "Polo Shirt", type: "Garment", category: "Apparel", unit: "PCS", gsm: 220, width: null, status: "Active", stock: 15200, price: 1450 },
];

export const salesOrders = [
  { id: "SO-1024", customer: "Fashion Retailer A", product: "Men's T-Shirt", style: "TS-BASIC-27", qty: 10000, delivered: 0, unit: "PCS", value: 8900000, deliveryDate: "2026-09-25", status: "In Production", plant: "Lahore Plant", color: "Black/White", gsm: 180 },
  { id: "SO-1025", customer: "Export Customer B", product: "Dyed Fabric Reactive", style: "DF-REAC-58", qty: 45000, delivered: 12000, unit: "MTR", value: 18900000, deliveryDate: "2026-09-10", status: "Partial Delivery", plant: "Faisalabad Plant", color: "Navy", gsm: 200 },
  { id: "SO-1026", customer: "Nordic Apparel AS", product: "Polo Shirt", style: "POLO-CORE-26", qty: 6000, delivered: 6000, unit: "PCS", value: 8700000, deliveryDate: "2026-08-20", status: "Delivered", plant: "Lahore Plant", color: "Assorted", gsm: 220 },
  { id: "SO-1027", customer: "Local Distributor C", product: "Cotton Fabric 180 GSM", style: "GREY-180", qty: 25000, delivered: 0, unit: "MTR", value: 7125000, deliveryDate: "2026-09-18", status: "Approved", plant: "Faisalabad Plant", color: "Grey", gsm: 180 },
  { id: "SO-1028", customer: "Fashion Retailer A", product: "Men's T-Shirt", style: "TS-BASIC-27", qty: 5000, delivered: 0, unit: "PCS", value: 4450000, deliveryDate: "2026-08-28", status: "Overdue", plant: "Lahore Plant", color: "White", gsm: 180 },
];

export const quotations = [
  { id: "QT-8801", customer: "Gulf Retail Group", product: "Polo Shirt", qty: 8000, value: 11600000, validTill: "2026-09-12", status: "Sent" },
  { id: "QT-8802", customer: "Urban Wear Co.", product: "Men's T-Shirt", qty: 15000, value: 12750000, validTill: "2026-09-05", status: "Draft" },
  { id: "QT-8803", customer: "Denim House PK", product: "Cotton Yarn 30s", qty: 20000, value: 12400000, validTill: "2026-09-20", status: "Accepted" },
];

export const suppliers = [
  { id: "SU-501", name: "Cotton Supplier A", category: "Fiber", city: "Multan", rating: 4.6, leadDays: 7, qualityScore: 94, onTime: 91, paymentTerms: "Net 30", status: "Approved" },
  { id: "SU-502", name: "Yarn Supplier B", category: "Yarn", city: "Faisalabad", rating: 4.2, leadDays: 5, qualityScore: 89, onTime: 86, paymentTerms: "Net 45", status: "Approved" },
  { id: "SU-503", name: "Chemical Supplier C", category: "Chemicals", city: "Karachi", rating: 4.8, leadDays: 3, qualityScore: 97, onTime: 95, paymentTerms: "Net 15", status: "Preferred" },
  { id: "SU-504", name: "Accessories Hub", category: "Accessories", city: "Sialkot", rating: 4.0, leadDays: 4, qualityScore: 88, onTime: 82, paymentTerms: "Net 30", status: "Approved" },
];

export const purchaseOrders = [
  { id: "PO-4401", supplier: "Cotton Supplier A", item: "Raw Cotton Grade A", qty: 50000, unit: "KG", value: 18500000, status: "Open", eta: "2026-09-04", plant: "Karachi Plant" },
  { id: "PO-4402", supplier: "Chemical Supplier C", item: "Reactive Dye Navy", qty: 1200, unit: "KG", value: 3600000, status: "Partial", eta: "2026-08-31", plant: "Faisalabad Plant" },
  { id: "PO-4403", supplier: "Yarn Supplier B", item: "Cotton Yarn 30s", qty: 15000, unit: "KG", value: 9300000, status: "Received", eta: "2026-08-22", plant: "Faisalabad Plant" },
  { id: "PO-4404", supplier: "Accessories Hub", item: "Neck Labels + Tags", qty: 25000, unit: "PCS", value: 875000, status: "Approved", eta: "2026-09-08", plant: "Lahore Plant" },
];

export const requisitions = [
  { id: "PR-3301", requester: "Ahmed Raza", department: "Production", item: "Raw Cotton Grade A", qty: 50000, unit: "KG", status: "Approved", neededBy: "2026-09-02" },
  { id: "PR-3302", requester: "Nadia Sheikh", department: "Quality", item: "Lab Chemicals Kit", qty: 12, unit: "SET", status: "Pending", neededBy: "2026-09-10" },
  { id: "PR-3303", requester: "Fatima Ali", department: "Warehouse", item: "Carton Boxes 5-ply", qty: 8000, unit: "PCS", status: "Converted", neededBy: "2026-09-05" },
];

export const stockItems = [
  { id: "ST-01", sku: "RM-CTN-A", name: "Raw Cotton Grade A", category: "Raw Materials", warehouse: "KHI-RM-01", qty: 62400, unit: "KG", value: 23088000, min: 20000, status: "OK" },
  { id: "ST-02", sku: "YRN-CTN-30S", name: "Cotton Yarn 30s", category: "Raw Materials", warehouse: "FSD-RM-02", qty: 84200, unit: "KG", value: 52204000, min: 25000, status: "OK" },
  { id: "ST-03", sku: "FAB-GREY-180", name: "Grey Fabric 180 GSM", category: "WIP", warehouse: "FSD-WIP-01", qty: 38500, unit: "MTR", value: 7315000, min: 10000, status: "OK" },
  { id: "ST-04", sku: "CHM-DYE-NVY", name: "Reactive Dye Navy", category: "Chemicals", warehouse: "FSD-CHM-01", qty: 480, unit: "KG", value: 1440000, min: 600, status: "Low" },
  { id: "ST-05", sku: "GAR-TSH-MENS", name: "Men's T-Shirt FG", category: "Finished Goods", warehouse: "LHR-FG-01", qty: 28400, unit: "PCS", value: 25276000, min: 5000, status: "OK" },
  { id: "ST-06", sku: "ACC-LABEL", name: "Neck Labels", category: "Accessories", warehouse: "LHR-ACC-01", qty: 1250, unit: "PCS", value: 43750, min: 5000, status: "Critical" },
];

export const productionOrders = [
  { id: "PRO-7001", so: "SO-1024", product: "Men's T-Shirt", process: "Garments", qty: 10000, completed: 4200, plant: "Lahore Plant", start: "2026-08-25", finish: "2026-09-20", status: "In Progress", efficiency: 86 },
  { id: "PRO-7002", so: "SO-1025", product: "Dyed Fabric Reactive", process: "Dyeing", qty: 45000, completed: 28000, plant: "Faisalabad Plant", start: "2026-08-18", finish: "2026-09-08", status: "In Progress", efficiency: 91 },
  { id: "PRO-7003", so: "SO-1027", product: "Cotton Fabric 180 GSM", process: "Weaving", qty: 25000, completed: 0, plant: "Faisalabad Plant", start: "2026-09-01", finish: "2026-09-16", status: "Released", efficiency: 0 },
  { id: "PRO-7004", so: "—", product: "Cotton Yarn 30s", process: "Spinning", qty: 30000, completed: 30000, plant: "Karachi Plant", start: "2026-08-01", finish: "2026-08-20", status: "Completed", efficiency: 94 },
];

export const workOrders = [
  { id: "WO-9101", productionOrder: "PRO-7001", operation: "Cutting", workCenter: "CUT-LINE-01", target: 10000, actual: 10000, status: "Completed", operator: "Usman Tariq" },
  { id: "WO-9102", productionOrder: "PRO-7001", operation: "Stitching", workCenter: "SEW-LINE-01", target: 10000, actual: 4200, status: "In Progress", operator: "Shift A Team" },
  { id: "WO-9103", productionOrder: "PRO-7001", operation: "Finishing", workCenter: "FIN-01", target: 10000, actual: 0, status: "Pending", operator: "—" },
  { id: "WO-9104", productionOrder: "PRO-7002", operation: "Dyeing", workCenter: "DYE-01", target: 45000, actual: 28000, status: "In Progress", operator: "Kamran Operator" },
];

export const machines = [
  { id: "M-L001", name: "Loom-001", type: "Weaving Loom", plant: "Faisalabad Plant", status: "Running", utilization: 92, operator: "Rashid Ali", job: "PRO-7003", downtimeHrs: 1.2 },
  { id: "M-L002", name: "Loom-002", type: "Weaving Loom", plant: "Faisalabad Plant", status: "Idle", utilization: 0, operator: "—", job: "—", downtimeHrs: 0 },
  { id: "M-D01", name: "Dyeing Machine-01", type: "Jet Dyeing", plant: "Faisalabad Plant", status: "Running", utilization: 88, operator: "Kamran Operator", job: "PRO-7002", downtimeHrs: 0.5 },
  { id: "M-K03", name: "Knitting Machine-03", type: "Circular Knitting", plant: "Karachi Plant", status: "Maintenance", utilization: 0, operator: "—", job: "PM-WO-112", downtimeHrs: 4.0 },
  { id: "M-S01", name: "Sewing Line-01", type: "Garment Line", plant: "Lahore Plant", status: "Running", utilization: 84, operator: "Shift A Team", job: "PRO-7001", downtimeHrs: 0.8 },
  { id: "M-S02", name: "Sewing Line-02", type: "Garment Line", plant: "Lahore Plant", status: "Breakdown", utilization: 0, operator: "—", job: "BD-441", downtimeHrs: 2.4 },
];

export const inspections = [
  { id: "QC-1201", type: "Incoming", item: "Raw Cotton Grade A", batch: "BT-CTN-882", result: "Pass", inspector: "Nadia Sheikh", date: "2026-08-28", defects: 0 },
  { id: "QC-1202", type: "In-Process", item: "Men's T-Shirt", batch: "BT-TS-1024", result: "Conditional", inspector: "QC Team A", date: "2026-08-29", defects: 42 },
  { id: "QC-1203", type: "Final", item: "Dyed Fabric Reactive", batch: "BT-DYE-441", result: "Fail", inspector: "Lab FSD", date: "2026-08-29", defects: 18 },
  { id: "QC-1204", type: "Final", item: "Polo Shirt", batch: "BT-PO-990", result: "Pass", inspector: "QC Team B", date: "2026-08-20", defects: 6 },
];

export const employees = [
  { id: "EMP-1001", name: "Usman Tariq", department: "Production", designation: "Machine Operator", plant: "Faisalabad Plant", shift: "A", status: "Active", joinDate: "2022-03-14" },
  { id: "EMP-1002", name: "Saba Fatima", department: "Quality", designation: "Inspector", plant: "Lahore Plant", shift: "A", status: "Active", joinDate: "2021-07-01" },
  { id: "EMP-1003", name: "Rashid Ali", department: "Weaving", designation: "Loom Operator", plant: "Faisalabad Plant", shift: "B", status: "Active", joinDate: "2020-11-22" },
  { id: "EMP-1004", name: "Hina Kazmi", department: "HR", designation: "HR Executive", plant: "Karachi Plant", shift: "General", status: "Active", joinDate: "2023-01-09" },
  { id: "EMP-1005", name: "Tariq Mehmood", department: "Maintenance", designation: "Technician", plant: "Faisalabad Plant", shift: "A", status: "On Leave", joinDate: "2019-05-18" },
];

export const notifications = [
  { id: "N1", title: "Purchase Order requires approval", body: "PO-4404 worth PKR 875,000 awaits Finance review.", time: "12 min ago", type: "approval", unread: true },
  { id: "N2", title: "Machine M-S02 breakdown", body: "Sewing Line-02 has been down for 2.4 hours.", time: "35 min ago", type: "alert", unread: true },
  { id: "N3", title: "Low stock alert", body: "Neck Labels below minimum (1,250 / 5,000).", time: "1 hr ago", type: "inventory", unread: true },
  { id: "N4", title: "Production order delayed", body: "PRO-7001 stitching is 8% behind schedule.", time: "2 hr ago", type: "production", unread: false },
  { id: "N5", title: "Customer payment overdue", body: "Fashion Retailer A — PKR 8.45M overdue by 12 days.", time: "Yesterday", type: "finance", unread: false },
  { id: "N6", title: "Quality inspection failed", body: "QC-1203 Dyed Fabric batch BT-DYE-441 failed shade match.", time: "Yesterday", type: "quality", unread: false },
];

export const tshirtWorkflow: WorkflowStep[] = [
  { id: "1", label: "Customer", status: "completed", href: "/crm/customers/CU-1001", meta: "Fashion Retailer A" },
  { id: "2", label: "Sales Order", status: "completed", href: "/sales/orders/SO-1024", meta: "SO-1024 · 10,000 pcs" },
  { id: "3", label: "Style / BOM", status: "completed", href: "/products/bom/BOM-TS-27", meta: "TS-BASIC-27" },
  { id: "4", label: "MRP", status: "completed", href: "/planning/mrp", meta: "Shortage: Labels" },
  { id: "5", label: "Purchase", status: "completed", href: "/procurement/orders/PO-4404", meta: "PO-4404" },
  { id: "6", label: "Goods Receipt", status: "current", href: "/procurement/receipts", meta: "Awaiting GRN" },
  { id: "7", label: "Production", status: "current", href: "/production/orders/PRO-7001", meta: "42% complete" },
  { id: "8", label: "Quality", status: "upcoming", href: "/quality/inspections", meta: "Final QC" },
  { id: "9", label: "Warehouse", status: "upcoming", href: "/warehouse", meta: "FG put-away" },
  { id: "10", label: "Dispatch", status: "upcoming", href: "/dispatch", meta: "DO pending" },
  { id: "11", label: "Invoice", status: "upcoming", href: "/sales/invoices", meta: "INV pending" },
  { id: "12", label: "Payment", status: "upcoming", href: "/finance/ar", meta: "AR" },
];

export const weavingWorkflow: WorkflowStep[] = [
  { id: "1", label: "Yarn Issue", status: "completed", href: "/inventory", meta: "YRN-CTN-30S" },
  { id: "2", label: "Warping", status: "completed", href: "/production/orders/PRO-7003", meta: "Done" },
  { id: "3", label: "Sizing", status: "completed", href: "/production/work-orders", meta: "Done" },
  { id: "4", label: "Weaving", status: "current", href: "/production/orders/PRO-7003", meta: "Released" },
  { id: "5", label: "Grey QC", status: "upcoming", href: "/quality/fabric", meta: "Pending" },
  { id: "6", label: "Dyeing", status: "upcoming", href: "/production", meta: "Next" },
  { id: "7", label: "Finished Fabric", status: "upcoming", href: "/warehouse", meta: "FG" },
  { id: "8", label: "Delivery", status: "upcoming", href: "/dispatch", meta: "SO-1027" },
];

export const dyeingWorkflow: WorkflowStep[] = [
  { id: "1", label: "Batch Create", status: "completed", href: "/inventory/batches", meta: "BT-DYE-441" },
  { id: "2", label: "Recipe", status: "completed", href: "/production/orders/PRO-7002", meta: "Navy Reactive" },
  { id: "3", label: "Chemicals", status: "completed", href: "/procurement/orders/PO-4402", meta: "Issued" },
  { id: "4", label: "Dyeing", status: "current", href: "/production-floor", meta: "62% done" },
  { id: "5", label: "Washing", status: "upcoming", href: "/production/work-orders", meta: "Queued" },
  { id: "6", label: "Drying", status: "upcoming", href: "/production/work-orders", meta: "Queued" },
  { id: "7", label: "Inspection", status: "upcoming", href: "/quality/inspections/QC-1203", meta: "Failed shade" },
  { id: "8", label: "Rework / Approve", status: "upcoming", href: "/quality/defects", meta: "CAPA" },
];

export const bomLines = [
  { id: "1", component: "Cotton Fabric 180 GSM", qty: 1.35, unit: "MTR", scrap: 3, waste: 2, cost: 385 },
  { id: "2", component: "Sewing Thread", qty: 0.08, unit: "KG", scrap: 1, waste: 1, cost: 45 },
  { id: "3", component: "Neck Label", qty: 1, unit: "PCS", scrap: 0, waste: 2, cost: 8 },
  { id: "4", component: "Hang Tag", qty: 1, unit: "PCS", scrap: 0, waste: 1, cost: 12 },
  { id: "5", component: "Polybag", qty: 1, unit: "PCS", scrap: 0, waste: 1, cost: 15 },
];

export const processTemplates = [
  { id: "PT-SPIN", name: "Spinning", steps: ["Fiber", "Blow Room", "Carding", "Drawing", "Combing", "Roving", "Spinning", "Winding"] },
  { id: "PT-WEAVE", name: "Weaving", steps: ["Yarn", "Warping", "Sizing", "Weaving", "Grey Fabric"] },
  { id: "PT-KNIT", name: "Knitting", steps: ["Yarn", "Knitting", "Grey Fabric"] },
  { id: "PT-DYE", name: "Dyeing", steps: ["Grey Fabric", "Pretreatment", "Dyeing", "Washing", "Drying", "Finishing"] },
  { id: "PT-PRINT", name: "Printing", steps: ["Fabric", "Printing", "Drying", "Finishing"] },
  { id: "PT-GAR", name: "Garments", steps: ["Fabric", "Cutting", "Stitching", "Finishing", "Packing"] },
];

export const colorSizeMatrix = {
  style: "TS-BASIC-27",
  colors: ["Black", "White", "Navy", "Heather Grey"],
  sizes: ["S", "M", "L", "XL", "XXL"],
  quantities: {
    Black: { S: 400, M: 900, L: 1100, XL: 700, XXL: 200 },
    White: { S: 350, M: 850, L: 1000, XL: 650, XXL: 150 },
    Navy: { S: 300, M: 700, L: 800, XL: 500, XXL: 100 },
    "Heather Grey": { S: 250, M: 600, L: 700, XL: 450, XXL: 100 },
  } as Record<string, Record<string, number>>,
};

export const mrpRows = [
  { item: "Cotton Fabric 180 GSM", required: 13500, available: 8200, incoming: 0, shortage: 5300, action: "Purchase", neededBy: "2026-09-02" },
  { item: "Neck Labels", required: 10200, available: 1250, incoming: 25000, shortage: 0, action: "OK (Incoming)", neededBy: "2026-09-08" },
  { item: "Sewing Thread", required: 820, available: 1100, incoming: 0, shortage: 0, action: "OK", neededBy: "2026-09-02" },
  { item: "Reactive Dye Navy", required: 900, available: 480, incoming: 720, shortage: 0, action: "Watch", neededBy: "2026-08-31" },
  { item: "Carton Boxes 5-ply", required: 420, available: 180, incoming: 0, shortage: 240, action: "Purchase", neededBy: "2026-09-15" },
];

export const costSheet = {
  product: "Men's T-Shirt",
  style: "TS-BASIC-27",
  standard: { material: 465, labor: 95, machine: 42, utilities: 28, overhead: 55, packaging: 35, waste: 18, subcontract: 0, total: 738 },
  actual: { material: 492, labor: 102, machine: 48, utilities: 31, overhead: 55, packaging: 35, waste: 24, subcontract: 0, total: 787 },
};

export const auditTrail: AuditEvent[] = [
  { id: "A1", user: "Zainab Rizvi", action: "Created sales order", timestamp: "2026-08-20 09:14", newValue: "SO-1024 Draft" },
  { id: "A2", user: "Zainab Rizvi", action: "Edited quantity", timestamp: "2026-08-20 09:22", previousValue: "8,000", newValue: "10,000" },
  { id: "A3", user: "Imran Malik", action: "Approved sales order", timestamp: "2026-08-20 11:05", newValue: "Approved" },
  { id: "A4", user: "Ahmed Raza", action: "Created production order", timestamp: "2026-08-21 08:40", newValue: "PRO-7001" },
  { id: "A5", user: "Bilal Hussain", action: "Released to floor", timestamp: "2026-08-25 07:55", newValue: "In Progress" },
];

export const tenants = [
  { id: "T-01", name: "ABC Textile Mills", plan: "Enterprise", users: 186, storage: "842 GB", status: "Active", mrr: 485000, trial: false },
  { id: "T-02", name: "Sunrise Knits", plan: "Professional", users: 48, storage: "120 GB", status: "Active", mrr: 145000, trial: false },
  { id: "T-03", name: "Pearl Dyeing Works", plan: "Starter", users: 12, storage: "28 GB", status: "Trial", mrr: 0, trial: true },
  { id: "T-04", name: "Indus Garments", plan: "Professional", users: 64, storage: "210 GB", status: "Past Due", mrr: 145000, trial: false },
];

export const subscriptionPlans = [
  { id: "free", name: "Free Trial", price: 0, users: 5, storage: "5 GB", modules: "Core only", cycle: "14 days" },
  { id: "starter", name: "Starter", price: 45000, users: 15, storage: "50 GB", modules: "Sales + Inventory + Finance", cycle: "Monthly" },
  { id: "pro", name: "Professional", price: 145000, users: 75, storage: "250 GB", modules: "+ Production + QC + MRP", cycle: "Monthly" },
  { id: "ent", name: "Enterprise", price: 485000, users: "Unlimited", storage: "1 TB+", modules: "All modules + AI + MES", cycle: "Monthly" },
];

export const globalSearchIndex = [
  { type: "Customer", id: "CU-1001", title: "Fashion Retailer A", href: "/crm/customers/CU-1001" },
  { type: "Supplier", id: "SU-501", title: "Cotton Supplier A", href: "/procurement/suppliers/SU-501" },
  { type: "Product", id: "PR-TS", title: "Men's T-Shirt", href: "/products/PR-TS" },
  { type: "Sales Order", id: "SO-1024", title: "SO-1024 · 10,000 T-Shirts", href: "/sales/orders/SO-1024" },
  { type: "Purchase Order", id: "PO-4404", title: "PO-4404 · Neck Labels", href: "/procurement/orders/PO-4404" },
  { type: "Production Order", id: "PRO-7001", title: "PRO-7001 · Men's T-Shirt", href: "/production/orders/PRO-7001" },
  { type: "Invoice", id: "INV-5501", title: "INV-5501 · Nordic Apparel", href: "/sales/invoices" },
  { type: "Employee", id: "EMP-1001", title: "Usman Tariq", href: "/hr/employees/EMP-1001" },
  { type: "Machine", id: "M-S01", title: "Sewing Line-01", href: "/machines/M-S01" },
  { type: "Batch", id: "BT-DYE-441", title: "BT-DYE-441 · Navy Reactive", href: "/inventory/batches" },
  { type: "Warehouse", id: "LHR-FG-01", title: "Lahore FG Warehouse", href: "/warehouse" },
];

export function statusTone(status: string): "default" | "success" | "warning" | "error" | "info" | "outline" {
  const s = status.toLowerCase();
  if (["active", "approved", "completed", "delivered", "pass", "running", "won", "ok", "received", "preferred"].some((x) => s.includes(x))) return "success";
  if (["pending", "draft", "idle", "partial", "conditional", "watch", "on hold", "sent", "released", "in production", "in progress"].some((x) => s.includes(x))) return "warning";
  if (["overdue", "fail", "breakdown", "critical", "rejected", "past due", "cancelled"].some((x) => s.includes(x))) return "error";
  if (["maintenance", "trial", "new", "contacted", "qualified"].some((x) => s.includes(x))) return "info";
  return "default";
}
