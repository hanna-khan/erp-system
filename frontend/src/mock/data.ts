import type { AuditEvent, Branch, Company, KpiCard, Plant, User, UserRole, WorkflowStep } from "@/types";

/** Demo tenant: Cocoon Clothing — https://www.cocoon.pk/ */
export const company: Company = {
  id: "co-cocoon",
  name: "Cocoon Clothing",
  shortName: "Cocoon",
  ntn: "4278912-3",
  strn: "3277876456789",
  currency: "PKR",
  fiscalYear: "FY 2025-26",
  address: "E-1/K S.I.T.E Area, Karachi, Sindh 75700",
  city: "Karachi",
  phone: "0331 5144883",
  email: "wecare@cocoon.pk",
};

export const plants: Plant[] = [
  { id: "pl-khi", companyId: "co-cocoon", name: "SITE Karachi Plant", city: "Karachi", type: "Garments / RTW" },
  { id: "pl-wh", companyId: "co-cocoon", name: "Karachi FG Warehouse", city: "Karachi", type: "Finished Goods" },
  { id: "pl-ecom", companyId: "co-cocoon", name: "Online Fulfillment Hub", city: "Karachi", type: "E-commerce" },
];

export const branches: Branch[] = [
  { id: "br-khi", companyId: "co-cocoon", name: "Karachi Head Office (SITE)", city: "Karachi" },
  { id: "br-web", companyId: "co-cocoon", name: "cocoon.pk Online Store", city: "Karachi" },
  { id: "br-export", companyId: "co-cocoon", name: "Export Desk (UAE / UK / KSA / CA / US)", city: "Karachi" },
];

export const users: Record<UserRole, User> = {
  super_admin: {
    id: "u-sa",
    name: "Platform Admin",
    email: "admin@zendrock.com",
    role: "super_admin",
    title: "Super Admin",
  },
  tenant_admin: {
    id: "u-ta",
    name: "Nargis Imran",
    email: "nargis@cocoon.pk",
    role: "tenant_admin",
    title: "Senior Manager",
    plantId: "pl-khi",
  },
  ceo: {
    id: "u-ceo",
    name: "Salman Sabir",
    email: "salman@cocoon.pk",
    role: "ceo",
    title: "CEO",
    plantId: "pl-khi",
  },
  production_manager: {
    id: "u-pm",
    name: "Farhan Siddiqui",
    email: "farhan@cocoon.pk",
    role: "production_manager",
    title: "Production Manager",
    plantId: "pl-khi",
  },
  production_supervisor: {
    id: "u-ps",
    name: "Sanaullah Khan",
    email: "sanaullah@cocoon.pk",
    role: "production_supervisor",
    title: "Stitching Supervisor",
    plantId: "pl-khi",
  },
  quality_manager: {
    id: "u-qm",
    name: "Mehreen Qazi",
    email: "mehreen@cocoon.pk",
    role: "quality_manager",
    title: "Quality Manager",
    plantId: "pl-khi",
  },
  procurement_manager: {
    id: "u-pr",
    name: "Asad Bukhari",
    email: "asad@cocoon.pk",
    role: "procurement_manager",
    title: "Procurement Manager",
    plantId: "pl-khi",
  },
  warehouse_manager: {
    id: "u-wh",
    name: "Hira Nadeem",
    email: "hira@cocoon.pk",
    role: "warehouse_manager",
    title: "Warehouse Manager",
    plantId: "pl-wh",
  },
  accountant: {
    id: "u-ac",
    name: "Waqas Anwar",
    email: "waqas@cocoon.pk",
    role: "accountant",
    title: "Finance Controller",
    plantId: "pl-khi",
  },
  hr_manager: {
    id: "u-hr",
    name: "Rabia Sheikh",
    email: "rabia@cocoon.pk",
    role: "hr_manager",
    title: "HR Manager",
    plantId: "pl-khi",
  },
  sales_manager: {
    id: "u-sm",
    name: "Areeba Malik",
    email: "areeba@cocoon.pk",
    role: "sales_manager",
    title: "Sales & E-commerce Manager",
    plantId: "pl-ecom",
  },
  maintenance_manager: {
    id: "u-mm",
    name: "Junaid Ansari",
    email: "junaid@cocoon.pk",
    role: "maintenance_manager",
    title: "Maintenance Head",
    plantId: "pl-khi",
  },
  factory_worker: {
    id: "u-fw",
    name: "Nazia Bibi",
    email: "nazia@cocoon.pk",
    role: "factory_worker",
    title: "Sewing Operator",
    plantId: "pl-khi",
  },
};

export const dashboardKpis: {
  financial: KpiCard[];
  production: KpiCard[];
  machines: KpiCard[];
  inventory: KpiCard[];
  sales: KpiCard[];
} = {
  financial: [
    { id: "rev", label: "Revenue (MTD)", value: "PKR 28.4M", change: "+12.1%", trend: "up" },
    { id: "gp", label: "Gross Profit", value: "PKR 11.6M", change: "+4.8%", trend: "up" },
    { id: "np", label: "Net Profit", value: "PKR 4.9M", change: "+2.2%", trend: "up" },
    { id: "ar", label: "Receivables", value: "PKR 6.8M", change: "-3.1%", trend: "down", tone: "warning" },
    { id: "ap", label: "Payables", value: "PKR 4.2M", change: "+1.4%", trend: "up" },
    { id: "cash", label: "Cash Balance", value: "PKR 8.1M", change: "+6.0%", trend: "up", tone: "success" },
  ],
  production: [
    { id: "today", label: "Today's Production", value: "1,240 pcs", change: "94% of target", trend: "up" },
    { id: "target", label: "Production Target", value: "1,320 pcs", hint: "SITE Karachi" },
    { id: "eff", label: "Efficiency", value: "89.2%", change: "+1.5%", trend: "up", tone: "success" },
    { id: "wip", label: "WIP Value", value: "PKR 5.4M", tone: "info" },
    { id: "rej", label: "Rejection Rate", value: "2.1%", change: "-0.3%", trend: "down", tone: "success" },
    { id: "rew", label: "Rework Rate", value: "1.4%", change: "+0.1%", trend: "up", tone: "warning" },
  ],
  machines: [
    { id: "util", label: "Utilization", value: "86%", trend: "up" },
    { id: "run", label: "Running lines", value: "12", tone: "success" },
    { id: "idle", label: "Idle", value: "2", tone: "warning" },
    { id: "bd", label: "Breakdown", value: "1", tone: "error" },
    { id: "dt", label: "Downtime (Today)", value: "1.8 hrs", tone: "warning" },
  ],
  inventory: [
    { id: "rm", label: "Lawn / Fabric stock", value: "PKR 9.8M" },
    { id: "wip", label: "WIP (cutting/stitch)", value: "PKR 5.4M" },
    { id: "fg", label: "Finished RTW", value: "PKR 14.2M" },
    { id: "low", label: "Low stock SKUs", value: "18", tone: "warning" },
    { id: "val", label: "Total stock value", value: "PKR 29.4M", tone: "info" },
  ],
  sales: [
    { id: "open", label: "Open web + wholesale", value: "214" },
    { id: "pend", label: "Pending dispatch", value: "46", tone: "warning" },
    { id: "del", label: "Delivered (MTD)", value: "1,860" },
    { id: "od", label: "Overdue", value: "5", tone: "error" },
    { id: "ff", label: "Fulfillment", value: "93.5%", tone: "success" },
  ],
};

export const revenueTrend = [
  { month: "Mar", revenue: 18, production: 22, sales: 16 },
  { month: "Apr", revenue: 21, production: 24, sales: 19 },
  { month: "May", revenue: 23, production: 26, sales: 21 },
  { month: "Jun", revenue: 25, production: 28, sales: 23 },
  { month: "Jul", revenue: 26, production: 29, sales: 24 },
  { month: "Aug", revenue: 28, production: 31, sales: 26 },
];

export const customers = [
  { id: "CU-1001", name: "Boutique Collective PK", type: "Domestic", city: "Lahore", outstanding: 1850000, orders: 32, status: "Active", contact: "Sana Iqbal", phone: "+92 42 3577 1200", email: "orders@boutiquecollective.pk" },
  { id: "CU-1002", name: "Gulf Style Trading (UAE)", type: "Export", city: "Dubai", outstanding: 4200000, orders: 14, status: "Active", contact: "Farah Al-Hassan", phone: "+971 4 555 2200", email: "buying@gulfstyle.ae" },
  { id: "CU-1003", name: "cocoon.pk Retail Customers", type: "E-commerce", city: "Karachi", outstanding: 0, orders: 2860, status: "Active", contact: "Online Care", phone: "0331 5144883", email: "wecare@cocoon.pk" },
  { id: "CU-1004", name: "UK Desi Wear Ltd", type: "Export", city: "London", outstanding: 2680000, orders: 8, status: "Active", contact: "Amina Shah", phone: "+44 20 7946 0123", email: "procurement@ukdesiwear.co.uk" },
  { id: "CU-1005", name: "KSA Modest Fashion Co.", type: "Export", city: "Riyadh", outstanding: 980000, orders: 6, status: "On Hold", contact: "Layla Al-Rashid", phone: "+966 11 200 4488", email: "orders@ksamodest.sa" },
];

export const leads = [
  { id: "LD-2201", company: "Canada Desi Closet", contact: "Nadia Khan", source: "Website", industry: "Retail", status: "Qualified", owner: "Areeba Malik", value: 3200000, closeDate: "2026-09-15" },
  { id: "LD-2202", company: "USA South Asian Boutique", contact: "Priya Mehta", source: "Instagram", industry: "Retail", status: "New", owner: "Areeba Malik", value: 5100000, closeDate: "2026-10-01" },
  { id: "LD-2203", company: "Karachi Multi-Brand Store", contact: "Hammad Ali", source: "Referral", industry: "Retail", status: "Contacted", owner: "Nargis Imran", value: 1450000, closeDate: "2026-09-28" },
];

export const opportunities = [
  { id: "OP-3101", name: "Lawn 2026 Wholesale Drop", customer: "Boutique Collective PK", stage: "Negotiation", probability: 70, revenue: 6200000, closeDate: "2026-09-20" },
  { id: "OP-3102", name: "Festive 2026 UAE Program", customer: "Gulf Style Trading (UAE)", stage: "Proposal", probability: 55, revenue: 9800000, closeDate: "2026-10-12" },
  { id: "OP-3103", name: "Prism Kaftaan Bulk Reorder", customer: "UK Desi Wear Ltd", stage: "Won", probability: 100, revenue: 3750000, closeDate: "2026-08-18" },
];

/** Ready-to-wear styles inspired by cocoon.pk catalog */
export const products = [
  { id: "PR-PK", code: "CCN-KAFT-PRISM", name: "Prism Kaftaan 2-Piece", type: "Garment", category: "Ready to Wear", unit: "PCS", gsm: 120, width: null, status: "Active", stock: 840, price: 7500 },
  { id: "PR-LS", code: "CCN-RTW-LIME", name: "Lime Sorbet 2-Piece", type: "Garment", category: "Ready to Wear", unit: "PCS", gsm: 120, width: null, status: "Active", stock: 620, price: 7500 },
  { id: "PR-EC", code: "CCN-RTW-ECLAIR", name: "Éclair 2-Piece", type: "Garment", category: "Ready to Wear", unit: "PCS", gsm: 120, width: null, status: "Active", stock: 510, price: 7500 },
  { id: "PR-MT", code: "CCN-RTW-MATCHA", name: "Matcha | 2-Piece", type: "Garment", category: "Ready to Wear", unit: "PCS", gsm: 115, width: null, status: "Active", stock: 1180, price: 5990 },
  { id: "PR-RM", code: "CCN-RTW-ROSY", name: "Rosy Mist 2-Piece", type: "Garment", category: "Ready to Wear", unit: "PCS", gsm: 120, width: null, status: "Active", stock: 430, price: 7500 },
  { id: "PR-ST", code: "CCN-RTW-STELLA", name: "Stella | 2-Piece", type: "Garment", category: "Ready to Wear", unit: "PCS", gsm: 115, width: null, status: "Active", stock: 960, price: 5990 },
  { id: "PR-PW", code: "CCN-RTW-PETAL", name: "Petal & Wings | 2-Piece", type: "Garment", category: "Ready to Wear", unit: "PCS", gsm: 118, width: null, status: "Active", stock: 705, price: 6000 },
  { id: "PR-SM", code: "CCN-RTW-STRM", name: "Strawberry Matcha 2-Piece", type: "Garment", category: "Ready to Wear", unit: "PCS", gsm: 115, width: null, status: "Active", stock: 880, price: 5900 },
  { id: "PR-FM", code: "CCN-LAWN-FAIRY", name: "Fairy Meadows 2-Piece", type: "Garment", category: "Lawn 2026", unit: "PCS", gsm: 80, width: null, status: "Active", stock: 1420, price: 5900 },
  { id: "PR-HD", code: "CCN-LAWN-HONEY", name: "Honey & Daisies 2-Piece", type: "Garment", category: "Lawn 2026", unit: "PCS", gsm: 80, width: null, status: "Active", stock: 1260, price: 5900 },
  { id: "PR-CB", code: "CCN-LAWN-CREME", name: "Creme Brulée 2-Piece", type: "Garment", category: "Lawn 2026", unit: "PCS", gsm: 80, width: null, status: "Active", stock: 980, price: 5900 },
  { id: "PR-FR", code: "CCN-OMBRE-FROST", name: "Frosty 2-Piece", type: "Garment", category: "Ombre", unit: "PCS", gsm: 110, width: null, status: "Active", stock: 640, price: 5900 },
  { id: "PR-BO", code: "CCN-OMBRE-BLUSH", name: "Blush Ombre 2-Piece", type: "Garment", category: "Ombre", unit: "PCS", gsm: 110, width: null, status: "Active", stock: 710, price: 5900 },
  { id: "PR-LAWN", code: "FAB-LAWN-60", name: "Printed Lawn Fabric (60\")", type: "Fabric", category: "Raw Materials", unit: "MTR", gsm: 80, width: 60, status: "Active", stock: 18500, price: 420 },
  { id: "PR-DUP", code: "CCN-DUP-SOLIDS", name: "Dupatta — Solids", type: "Accessory", category: "Dupatta", unit: "PCS", gsm: null, width: null, status: "Active", stock: 2400, price: 1200 },
];

export const salesOrders = [
  { id: "SO-1024", customer: "Boutique Collective PK", product: "Prism Kaftaan 2-Piece", style: "CCN-KAFT-PRISM", qty: 10000, delivered: 0, unit: "PCS", value: 75000000, deliveryDate: "2026-09-25", status: "In Production", plant: "SITE Karachi Plant", color: "Prism Multi", gsm: 120 },
  { id: "SO-1025", customer: "Gulf Style Trading (UAE)", product: "Fairy Meadows 2-Piece", style: "CCN-LAWN-FAIRY", qty: 2500, delivered: 800, unit: "PCS", value: 14750000, deliveryDate: "2026-09-10", status: "Partial Delivery", plant: "SITE Karachi Plant", color: "Floral Lawn", gsm: 80 },
  { id: "SO-1026", customer: "UK Desi Wear Ltd", product: "Matcha | 2-Piece", style: "CCN-RTW-MATCHA", qty: 1200, delivered: 1200, unit: "PCS", value: 7188000, deliveryDate: "2026-08-20", status: "Delivered", plant: "Online Fulfillment Hub", color: "Matcha Green", gsm: 115 },
  { id: "SO-1027", customer: "cocoon.pk Retail Customers", product: "Honey & Daisies 2-Piece", style: "CCN-LAWN-HONEY", qty: 1800, delivered: 0, unit: "PCS", value: 10620000, deliveryDate: "2026-09-18", status: "Approved", plant: "Online Fulfillment Hub", color: "Honey Floral", gsm: 80 },
  { id: "SO-1028", customer: "Boutique Collective PK", product: "Stella | 2-Piece", style: "CCN-RTW-STELLA", qty: 900, delivered: 0, unit: "PCS", value: 5391000, deliveryDate: "2026-08-28", status: "Overdue", plant: "SITE Karachi Plant", color: "Stella Print", gsm: 115 },
];

export const quotations = [
  { id: "QT-8801", customer: "Canada Desi Closet", product: "Lawn 2026 Assortment", qty: 800, value: 4720000, validTill: "2026-09-12", status: "Sent" },
  { id: "QT-8802", customer: "USA South Asian Boutique", product: "Prism Kaftaan 2-Piece", qty: 400, value: 3000000, validTill: "2026-09-05", status: "Draft" },
  { id: "QT-8803", customer: "Karachi Multi-Brand Store", product: "Summer Essentials Mix", qty: 600, value: 3540000, validTill: "2026-09-20", status: "Accepted" },
];

export const suppliers = [
  { id: "SU-501", name: "Faisalabad Lawn Mills", category: "Lawn Fabric", city: "Faisalabad", rating: 4.7, leadDays: 10, qualityScore: 95, onTime: 92, paymentTerms: "Net 30", status: "Preferred" },
  { id: "SU-502", name: "Karachi Embroidery House", category: "Embroidery", city: "Karachi", rating: 4.4, leadDays: 7, qualityScore: 91, onTime: 88, paymentTerms: "Net 15", status: "Approved" },
  { id: "SU-503", name: "SITE Dye & Print Works", category: "Printing / Dyeing", city: "Karachi", rating: 4.6, leadDays: 5, qualityScore: 93, onTime: 90, paymentTerms: "Net 21", status: "Approved" },
  { id: "SU-504", name: "Label & Packaging Hub", category: "Accessories", city: "Karachi", rating: 4.2, leadDays: 4, qualityScore: 89, onTime: 85, paymentTerms: "Net 15", status: "Approved" },
];

export const purchaseOrders = [
  { id: "PO-4401", supplier: "Faisalabad Lawn Mills", item: "Printed Lawn Fabric (60\")", qty: 12000, unit: "MTR", value: 5040000, status: "Open", eta: "2026-09-04", plant: "SITE Karachi Plant" },
  { id: "PO-4402", supplier: "SITE Dye & Print Works", item: "Ombre Print Job — Blush", qty: 3500, unit: "MTR", value: 2100000, status: "Partial", eta: "2026-08-31", plant: "SITE Karachi Plant" },
  { id: "PO-4403", supplier: "Karachi Embroidery House", item: "Origin Embroidery Panels", qty: 2000, unit: "PCS", value: 1600000, status: "Received", eta: "2026-08-22", plant: "SITE Karachi Plant" },
  { id: "PO-4404", supplier: "Label & Packaging Hub", item: "Cocoon Hang Tags + Polybags", qty: 25000, unit: "PCS", value: 875000, status: "Approved", eta: "2026-09-08", plant: "Karachi FG Warehouse" },
];

export const requisitions = [
  { id: "PR-3301", requester: "Farhan Siddiqui", department: "Production", item: "Printed Lawn Fabric (60\")", qty: 12000, unit: "MTR", status: "Approved", neededBy: "2026-09-02" },
  { id: "PR-3302", requester: "Mehreen Qazi", department: "Quality", item: "Shade Cards & Lab Dip Kit", qty: 8, unit: "SET", status: "Pending", neededBy: "2026-09-10" },
  { id: "PR-3303", requester: "Hira Nadeem", department: "Warehouse", item: "E-com Cartons (Cocoon branded)", qty: 5000, unit: "PCS", status: "Converted", neededBy: "2026-09-05" },
];

export const stockItems = [
  { id: "ST-01", sku: "FAB-LAWN-60", name: "Printed Lawn Fabric (60\")", category: "Raw Materials", warehouse: "KHI-RM-01", qty: 18500, unit: "MTR", value: 7770000, min: 8000, status: "OK" },
  { id: "ST-02", sku: "FAB-OMBRE-BLUSH", name: "Blush Ombre Fabric", category: "WIP", warehouse: "KHI-WIP-01", qty: 2400, unit: "MTR", value: 1440000, min: 1000, status: "OK" },
  { id: "ST-03", sku: "CCN-KAFT-PRISM", name: "Prism Kaftaan 2-Piece FG", category: "Finished Goods", warehouse: "KHI-FG-01", qty: 840, unit: "PCS", value: 6300000, min: 200, status: "OK" },
  { id: "ST-04", sku: "CCN-LAWN-FAIRY", name: "Fairy Meadows 2-Piece FG", category: "Finished Goods", warehouse: "KHI-FG-01", qty: 1420, unit: "PCS", value: 8378000, min: 300, status: "OK" },
  { id: "ST-05", sku: "ACC-TAG-CCN", name: "Cocoon Hang Tags", category: "Accessories", warehouse: "KHI-ACC-01", qty: 1850, unit: "PCS", value: 55500, min: 5000, status: "Critical" },
  { id: "ST-06", sku: "CCN-RTW-MATCHA", name: "Matcha | 2-Piece FG", category: "Finished Goods", warehouse: "ECOM-FG-01", qty: 1180, unit: "PCS", value: 7068200, min: 250, status: "OK" },
];

export const productionOrders = [
  { id: "PRO-7001", so: "SO-1024", product: "Prism Kaftaan 2-Piece", process: "Garments", qty: 10000, completed: 4200, plant: "SITE Karachi Plant", start: "2026-08-25", finish: "2026-09-20", status: "In Progress", efficiency: 86 },
  { id: "PRO-7002", so: "SO-1025", product: "Fairy Meadows 2-Piece", process: "Garments", qty: 2500, completed: 1600, plant: "SITE Karachi Plant", start: "2026-08-18", finish: "2026-09-08", status: "In Progress", efficiency: 91 },
  { id: "PRO-7003", so: "SO-1027", product: "Honey & Daisies 2-Piece", process: "Garments", qty: 1800, completed: 0, plant: "SITE Karachi Plant", start: "2026-09-01", finish: "2026-09-16", status: "Released", efficiency: 0 },
  { id: "PRO-7004", so: "—", product: "Blush Ombre 2-Piece", process: "Printing + Stitch", qty: 900, completed: 900, plant: "SITE Karachi Plant", start: "2026-08-01", finish: "2026-08-20", status: "Completed", efficiency: 94 },
];

export const workOrders = [
  { id: "WO-9101", productionOrder: "PRO-7001", operation: "Cutting", workCenter: "CUT-LINE-01", target: 10000, actual: 10000, status: "Completed", operator: "Nazia Bibi" },
  { id: "WO-9102", productionOrder: "PRO-7001", operation: "Stitching", workCenter: "SEW-LINE-01", target: 10000, actual: 4200, status: "In Progress", operator: "Shift A Team" },
  { id: "WO-9103", productionOrder: "PRO-7001", operation: "Finishing / Packing", workCenter: "FIN-01", target: 10000, actual: 0, status: "Pending", operator: "—" },
  { id: "WO-9104", productionOrder: "PRO-7002", operation: "Stitching", workCenter: "SEW-LINE-02", target: 2500, actual: 1600, status: "In Progress", operator: "Shift B Team" },
];

export const machines = [
  { id: "M-C01", name: "Cutting Table-01", type: "Cutting", plant: "SITE Karachi Plant", status: "Running", utilization: 90, operator: "Cutting Team", job: "PRO-7001", downtimeHrs: 0.4 },
  { id: "M-S01", name: "Sewing Line-01", type: "Garment Line", plant: "SITE Karachi Plant", status: "Running", utilization: 88, operator: "Shift A Team", job: "PRO-7001", downtimeHrs: 0.6 },
  { id: "M-S02", name: "Sewing Line-02", type: "Garment Line", plant: "SITE Karachi Plant", status: "Breakdown", utilization: 0, operator: "—", job: "BD-441", downtimeHrs: 2.4 },
  { id: "M-S03", name: "Sewing Line-03", type: "Garment Line", plant: "SITE Karachi Plant", status: "Running", utilization: 84, operator: "Shift B Team", job: "PRO-7002", downtimeHrs: 0.8 },
  { id: "M-P01", name: "Print Table-01", type: "Fabric Print", plant: "SITE Karachi Plant", status: "Idle", utilization: 0, operator: "—", job: "—", downtimeHrs: 0 },
  { id: "M-F01", name: "Finishing Press-01", type: "Finishing", plant: "SITE Karachi Plant", status: "Maintenance", utilization: 0, operator: "—", job: "PM-WO-112", downtimeHrs: 3.0 },
];

export const inspections = [
  { id: "QC-1201", type: "Incoming", item: "Printed Lawn Fabric (60\")", batch: "BT-LAWN-882", result: "Pass", inspector: "Mehreen Qazi", date: "2026-08-28", defects: 0 },
  { id: "QC-1202", type: "In-Process", item: "Prism Kaftaan 2-Piece", batch: "BT-PK-1024", result: "Conditional", inspector: "QC Team A", date: "2026-08-29", defects: 28 },
  { id: "QC-1203", type: "Final", item: "Blush Ombre Fabric", batch: "BT-OMBRE-441", result: "Fail", inspector: "Lab SITE", date: "2026-08-29", defects: 14 },
  { id: "QC-1204", type: "Final", item: "Matcha | 2-Piece", batch: "BT-MT-990", result: "Pass", inspector: "QC Team B", date: "2026-08-20", defects: 4 },
];

export const employees = [
  { id: "EMP-1001", name: "Nazia Bibi", department: "Production", designation: "Sewing Operator", plant: "SITE Karachi Plant", shift: "A", status: "Active", joinDate: "2022-03-14" },
  { id: "EMP-1002", name: "Saba Fatima", department: "Quality", designation: "Inspector", plant: "SITE Karachi Plant", shift: "A", status: "Active", joinDate: "2021-07-01" },
  { id: "EMP-1003", name: "Imran Cutting", department: "Cutting", designation: "Cutter", plant: "SITE Karachi Plant", shift: "B", status: "Active", joinDate: "2020-11-22" },
  { id: "EMP-1004", name: "Hina Kazmi", department: "HR", designation: "HR Executive", plant: "SITE Karachi Plant", shift: "General", status: "Active", joinDate: "2023-01-09" },
  { id: "EMP-1005", name: "Tariq Mehmood", department: "Maintenance", designation: "Technician", plant: "SITE Karachi Plant", shift: "A", status: "On Leave", joinDate: "2019-05-18" },
  { id: "EMP-1006", name: "Salman Sabir", department: "Leadership", designation: "CEO", plant: "SITE Karachi Plant", shift: "General", status: "Active", joinDate: "2018-01-01" },
  { id: "EMP-1007", name: "Nargis Imran", department: "Leadership", designation: "Senior Manager", plant: "SITE Karachi Plant", shift: "General", status: "Active", joinDate: "2019-04-15" },
];

export const notifications = [
  { id: "N1", title: "Purchase Order requires approval", body: "PO-4404 Cocoon hang tags (PKR 875,000) awaits Nargis Imran / Finance.", time: "12 min ago", type: "approval", unread: true },
  { id: "N2", title: "Sewing Line-02 breakdown", body: "Line-02 has been down for 2.4 hours — Prism Kaftaan output at risk.", time: "35 min ago", type: "alert", unread: true },
  { id: "N3", title: "Low stock alert", body: "Cocoon Hang Tags below minimum (1,850 / 5,000).", time: "1 hr ago", type: "inventory", unread: true },
  { id: "N4", title: "Production order delayed", body: "PRO-7001 Prism Kaftaan stitching is 8% behind schedule.", time: "2 hr ago", type: "production", unread: false },
  { id: "N5", title: "Customer payment overdue", body: "Boutique Collective PK — PKR 1.85M overdue by 12 days.", time: "Yesterday", type: "finance", unread: false },
  { id: "N6", title: "Quality inspection failed", body: "QC-1203 Blush Ombre batch failed shade match.", time: "Yesterday", type: "quality", unread: false },
];

export const tshirtWorkflow: WorkflowStep[] = [
  { id: "1", label: "Customer", status: "completed", href: "/crm/customers/CU-1001", meta: "Boutique Collective PK" },
  { id: "2", label: "Sales Order", status: "completed", href: "/sales/orders/SO-1024", meta: "SO-1024 · 10,000 Prism Kaftaan" },
  { id: "3", label: "Style / BOM", status: "completed", href: "/products/bom/BOM-TS-27", meta: "CCN-KAFT-PRISM" },
  { id: "4", label: "MRP", status: "completed", href: "/planning/mrp", meta: "Shortage: Hang tags" },
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
  { id: "1", label: "Lawn Issue", status: "completed", href: "/inventory", meta: "FAB-LAWN-60" },
  { id: "2", label: "Cutting", status: "completed", href: "/production/orders/PRO-7003", meta: "Done" },
  { id: "3", label: "Stitching", status: "completed", href: "/production/work-orders", meta: "Queued" },
  { id: "4", label: "Finishing", status: "current", href: "/production/orders/PRO-7003", meta: "Released" },
  { id: "5", label: "QC", status: "upcoming", href: "/quality/fabric", meta: "Pending" },
  { id: "6", label: "Packing", status: "upcoming", href: "/warehouse", meta: "E-com ready" },
  { id: "7", label: "FG Warehouse", status: "upcoming", href: "/warehouse", meta: "KHI-FG-01" },
  { id: "8", label: "Online Dispatch", status: "upcoming", href: "/dispatch", meta: "SO-1027" },
];

export const dyeingWorkflow: WorkflowStep[] = [
  { id: "1", label: "Batch Create", status: "completed", href: "/inventory/batches", meta: "BT-OMBRE-441" },
  { id: "2", label: "Print Recipe", status: "completed", href: "/production/orders/PRO-7004", meta: "Blush Ombre" },
  { id: "3", label: "Vendor Print", status: "completed", href: "/procurement/orders/PO-4402", meta: "Issued" },
  { id: "4", label: "Print / Dye", status: "current", href: "/production-floor", meta: "In process" },
  { id: "5", label: "Wash / Finish", status: "upcoming", href: "/production/work-orders", meta: "Queued" },
  { id: "6", label: "Cut & Stitch", status: "upcoming", href: "/production/work-orders", meta: "Queued" },
  { id: "7", label: "Inspection", status: "upcoming", href: "/quality/inspections/QC-1203", meta: "Shade check" },
  { id: "8", label: "Rework / Approve", status: "upcoming", href: "/quality/defects", meta: "CAPA" },
];

export const bomLines = [
  { id: "1", component: "Printed Lawn / RTW Fabric", qty: 4.2, unit: "MTR", scrap: 4, waste: 3, cost: 1764 },
  { id: "2", component: "Matching Dupatta / Trouser fabric", qty: 2.5, unit: "MTR", scrap: 3, waste: 2, cost: 1050 },
  { id: "3", component: "Sewing Thread", qty: 0.06, unit: "KG", scrap: 1, waste: 1, cost: 55 },
  { id: "4", component: "Cocoon Hang Tag + Label", qty: 1, unit: "SET", scrap: 0, waste: 2, cost: 35 },
  { id: "5", component: "Branded Polybag", qty: 1, unit: "PCS", scrap: 0, waste: 1, cost: 45 },
];

export const processTemplates = [
  { id: "PT-LAWN", name: "Lawn RTW", steps: ["Fabric In", "Cutting", "Stitching", "Finishing", "QC", "Packing"] },
  { id: "PT-KAFT", name: "Kaftan / Ready to Wear", steps: ["Fabric In", "Cutting", "Stitching", "Finishing", "Press", "Packing"] },
  { id: "PT-OMBRE", name: "Ombre Collection", steps: ["Greige / Base", "Ombre Print", "Wash", "Cut", "Stitch", "Pack"] },
  { id: "PT-EMB", name: "Origin Embroidery", steps: ["Panel Issue", "Embroidery", "QC", "Assemble", "Finish"] },
  { id: "PT-PRINT", name: "Print Job", steps: ["Fabric", "Printing", "Drying", "Finishing"] },
  { id: "PT-GAR", name: "Garments (Generic)", steps: ["Fabric", "Cutting", "Stitching", "Finishing", "Packing"] },
];

export const colorSizeMatrix = {
  style: "CCN-KAFT-PRISM",
  colors: ["Prism Multi", "Lime Accent", "Soft Blush", "Matcha Tint"],
  sizes: ["XS", "S", "M", "L", "XL"],
  quantities: {
    "Prism Multi": { XS: 200, S: 800, M: 1400, L: 1100, XL: 500 },
    "Lime Accent": { XS: 150, S: 600, M: 1000, L: 800, XL: 350 },
    "Soft Blush": { XS: 180, S: 700, M: 1200, L: 900, XL: 400 },
    "Matcha Tint": { XS: 120, S: 500, M: 900, L: 700, XL: 300 },
  } as Record<string, Record<string, number>>,
};

export const mrpRows = [
  { item: "Printed Lawn Fabric (60\")", required: 42000, available: 18500, incoming: 12000, shortage: 11500, action: "Purchase", neededBy: "2026-09-02" },
  { item: "Cocoon Hang Tags", required: 10200, available: 1850, incoming: 25000, shortage: 0, action: "OK (Incoming)", neededBy: "2026-09-08" },
  { item: "Sewing Thread", required: 620, available: 900, incoming: 0, shortage: 0, action: "OK", neededBy: "2026-09-02" },
  { item: "Ombre Print Job — Blush", required: 3500, available: 2400, incoming: 1100, shortage: 0, action: "Watch", neededBy: "2026-08-31" },
  { item: "E-com Cartons (Cocoon branded)", required: 2200, available: 680, incoming: 0, shortage: 1520, action: "Purchase", neededBy: "2026-09-15" },
];

export const costSheet = {
  product: "Prism Kaftaan 2-Piece",
  style: "CCN-KAFT-PRISM",
  standard: { material: 2860, labor: 420, machine: 180, utilities: 95, overhead: 320, packaging: 80, waste: 145, subcontract: 200, total: 4300 },
  actual: { material: 3010, labor: 455, machine: 195, utilities: 102, overhead: 320, packaging: 80, waste: 168, subcontract: 220, total: 4550 },
};

export const auditTrail: AuditEvent[] = [
  { id: "A1", user: "Areeba Malik", action: "Created sales order", timestamp: "2026-08-20 09:14", newValue: "SO-1024 Draft" },
  { id: "A2", user: "Areeba Malik", action: "Edited quantity", timestamp: "2026-08-20 09:22", previousValue: "8,000", newValue: "10,000" },
  { id: "A3", user: "Nargis Imran", action: "Reviewed & forwarded for CEO approval", timestamp: "2026-08-20 10:40", newValue: "Pending CEO" },
  { id: "A4", user: "Salman Sabir", action: "Approved sales order", timestamp: "2026-08-20 11:05", newValue: "Approved" },
  { id: "A5", user: "Farhan Siddiqui", action: "Created production order", timestamp: "2026-08-21 08:40", newValue: "PRO-7001" },
  { id: "A6", user: "Sanaullah Khan", action: "Released to floor", timestamp: "2026-08-25 07:55", newValue: "In Progress" },
];

export const tenants = [
  { id: "T-01", name: "Cocoon Clothing", plan: "Enterprise", users: 86, storage: "210 GB", status: "Active", mrr: 485000, trial: false },
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
  { type: "Customer", id: "CU-1001", title: "Boutique Collective PK", href: "/crm/customers/CU-1001" },
  { type: "Supplier", id: "SU-501", title: "Faisalabad Lawn Mills", href: "/procurement/suppliers/SU-501" },
  { type: "Product", id: "PR-PK", title: "Prism Kaftaan 2-Piece", href: "/products/PR-PK" },
  { type: "Sales Order", id: "SO-1024", title: "SO-1024 · 10,000 Prism Kaftaan", href: "/sales/orders/SO-1024" },
  { type: "Purchase Order", id: "PO-4404", title: "PO-4404 · Cocoon Hang Tags", href: "/procurement/orders/PO-4404" },
  { type: "Production Order", id: "PRO-7001", title: "PRO-7001 · Prism Kaftaan", href: "/production/orders/PRO-7001" },
  { type: "Invoice", id: "INV-5501", title: "INV-5501 · UK Desi Wear", href: "/sales/invoices" },
  { type: "Employee", id: "EMP-1006", title: "Salman Sabir (CEO)", href: "/hr/employees/EMP-1006" },
  { type: "Employee", id: "EMP-1007", title: "Nargis Imran (Senior Manager)", href: "/hr/employees/EMP-1007" },
  { type: "Machine", id: "M-S01", title: "Sewing Line-01", href: "/machines/M-S01" },
  { type: "Batch", id: "BT-OMBRE-441", title: "BT-OMBRE-441 · Blush Ombre", href: "/inventory/batches" },
  { type: "Warehouse", id: "KHI-FG-01", title: "Karachi FG Warehouse", href: "/warehouse" },
  { type: "Product", id: "PR-FM", title: "Fairy Meadows 2-Piece", href: "/products/PR-FM" },
];

export function statusTone(status: string): "default" | "success" | "warning" | "error" | "info" | "outline" {
  const s = status.toLowerCase();
  if (["active", "approved", "completed", "delivered", "pass", "running", "won", "ok", "received", "preferred"].some((x) => s.includes(x))) return "success";
  if (["pending", "draft", "idle", "partial", "conditional", "watch", "on hold", "sent", "released", "in production", "in progress", "e-commerce"].some((x) => s.includes(x))) return "warning";
  if (["overdue", "fail", "breakdown", "critical", "rejected", "past due", "cancelled"].some((x) => s.includes(x))) return "error";
  if (["maintenance", "trial", "new", "contacted", "qualified"].some((x) => s.includes(x))) return "info";
  return "default";
}
