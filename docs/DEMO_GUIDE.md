# Zendrock ERP — Simple Demo Guide

Use this when you show the system to anyone.  
Everything is a **mockup** (demo data). Buttons work on screen, but there is no real backend yet.

**Demo tenant:** [Cocoon Clothing](https://www.cocoon.pk/) — women’s ready-to-wear / lawn from SITE Karachi.  
**CEO:** Salman Sabir · **Senior Manager:** Nargis Imran

---

## How to start a demo (2 minutes)

1. Open the app → **Login**
2. Enter any email/password → Continue
3. Enter any **6 digits** for MFA → you land on **Dashboard**
4. Top bar: switch **role** (CEO, Sales, Production…) to show different menus
5. Top bar: switch **plant** (SITE Karachi / Karachi FG Warehouse / Online Fulfillment Hub)
6. Best story path: open **Demo Workflows** in the sidebar

---

## What is Zendrock ERP? (one sentence)

It is one software where an apparel brand like **Cocoon Clothing** manages **customers → orders → buying materials → making products → quality check → warehouse → delivery → money → people**.

Think of it like this:

> Boutique Collective PK wants 10,000 Prism Kaftaan 2-Piece sets  
> → Sales takes the order  
> → Planning checks what lawn fabric / hang tags are needed  
> → Purchase buys missing items  
> → Factory cuts & stitches  
> → Quality checks  
> → Warehouse packs  
> → Dispatch delivers  
> → Finance makes invoice and collects payment  

That full journey is the ERP.

---

## Soft colors & UI

We kept soft **blue / white / lavender**.  
Tables now have working:

- **Search** — type to find rows  
- **Filters** — open dialog, pick status  
- **Columns** — hide/show columns  
- **Export** — downloads a CSV file  
- **New / Add** — opens a form, creates a row in the list (session mock)  
- **Select + Delete/Export** — bulk actions  

---

# Module-by-module (simple words + examples)

## 1) Dashboard
**Purpose:** Big picture for bosses.  
**What you see:** Money, production, machines, stock, sales numbers + charts.  
**Demo:** “Today we made 1,240 pieces, efficiency 89%, 1 sewing line down.”  
**Example:** CEO Salman Sabir opens morning dashboard before the meeting.

## 2) Demo Workflows
**Purpose:** Ready-made stories that click through the system.  
**Three stories:**
1. **Prism Kaftaan order** (10,000 pcs) — garments  
2. **Lawn RTW** — Fairy Meadows / Honey & Daisies style flow  
3. **Ombre print** — Blush Ombre shade CAPA  
**Demo tip:** Start every presentation here.

## 3) Zendrock AI
**Purpose:** Ask questions in plain English.  
**Example questions:**  
- “Which machines have high downtime?”  
- “Which customer is most profitable?”  
**Note:** Answers are mock (demo only).

## 4) CRM (Customer Relationship)
**Purpose:** Find and nurture buyers **before** they place an order.

### Leads
Someone interested, not a customer yet.  
**Example:** Canada Desi Closet asks for lawn wholesale prices → create Lead (owner Areeba Malik).

### Opportunities
Serious deal being negotiated.  
**Example:** “Lawn 2026 Wholesale Drop — 70% chance — Boutique Collective PK”

### Customers
Companies you already sell to.  
**Example:** Boutique Collective PK, Gulf Style Trading (UAE), UK Desi Wear Ltd, cocoon.pk Retail Customers.

### Activities
Calls, meetings, follow-ups.  
**Example:** “Call Boutique Collective about hang-tag / packing specs.”

**Flow:** Lead → Opportunity → Quotation → Customer / Sales Order

## 5) Sales
**Purpose:** Turn deals into confirmed orders and invoices.

### Quotations
Price offer. “We can supply Lawn 2026 assortment for PKR 4.72M.”

### Sales Orders
Customer said yes. This is the main order.  
**Demo star:** open **SO-1024** (10,000 Prism Kaftaan 2-Piece · CCN-KAFT-PRISM).

### Delivery Orders
What to ship.

### Invoices
Bill the customer.

### Returns
Customer sends goods back.

**Flow:** Quotation → Sales Order → Production → Delivery → Invoice → Payment

## 6) Product Master
**Purpose:** Master list of everything you make/sell.  
**Examples:** Prism Kaftaan 2-Piece, Matcha | 2-Piece, Fairy Meadows 2-Piece, Printed Lawn Fabric (60").

### Color × Size Matrix
For garments: XS–XL each combo is an SKU.  
**Example:** Order needs size M = 900 pcs.

### BOM (Bill of Materials)
Recipe of a product.  
**Example Prism Kaftaan needs:**
- printed lawn fabric  
- thread  
- Cocoon hang tags  
- polybag  

### Process Templates
Steps for Cutting / Print / Stitch / Finishing / Packing.  
Admin can configure factory type (not hard-coded to one factory).

## 7) PLM (Product Lifecycle)
**Purpose:** Design & sample before mass production.  
**Flow:** Concept → Design → Sample → Review → Approval → Production  
**Example:** New Fairy Meadows lawn style, tech pack, sample approved by UK Desi Wear.

## 8) Procurement (Buying)
**Purpose:** Buy lawn fabric, print jobs, embroidery, hang tags.

**Flow:**  
Need material → Requisition → RFQ (ask suppliers) → Compare quotes → Purchase Order → Goods Receipt → Pay supplier

**Example:** Need Cocoon hang tags → PR → PO-4404 to Label & Packaging Hub → receive into KHI-ACC-01.

### Suppliers
Who you buy from + rating / quality / lead time.  
**Examples:** Faisalabad Lawn Mills, SITE Dye & Print Works, Karachi Embroidery House.

## 9) Inventory
**Purpose:** Know what stock you have and where.  
Categories: Lawn / fabric, WIP, Finished RTW, Accessories.

**Example:** Cocoon Hang Tags are **Critical** (1,850 / min 5,000) → buy more.

### Ledger / Movements / Batches / Valuation
History of stock, transfers, batch/lot tracking, stock value in PKR.

## 10) Warehouse
**Purpose:** Physical store management.  
**Flow:** Receive → Inspect → Put away → Pick → Pack → Dispatch  
**Barcode scan:** type a SKU (e.g. `CCN-KAFT-PRISM` or `FAB-LAWN-60`) and see stock.  
**FG warehouse code:** KHI-FG-01

## 11) Production
**Purpose:** Make the product on the factory floor (SITE Karachi Plant).

### Production Orders
Big job linked to sales order.  
**Demo:** **PRO-7001** = make 10,000 Prism Kaftaan for SO-1024.

### Work Orders / Job Cards
Smaller steps: Cutting, Stitching, Finishing.

**Statuses:** Draft → Planned → Released → In Progress → Completed

## 12) Production Floor (MES)
**Purpose:** Tablet screen for operators (big buttons).  
Start / Pause / Complete job, report quantity, scrap, defect, downtime.  
Open from sidebar or `/production-floor`.

## 13) Planning & MRP
**Purpose:** Plan *what* to make and *what materials* are missing.

### MPS
Master schedule: orders vs capacity vs deadlines.

### MRP (Material Requirements Planning)
**Simple meaning:** “For this order, what do we need, what do we have, what must we buy?”

**Example for 10,000 Prism Kaftaan:**
- Lawn fabric short → **Purchase**  
- Hang tags incoming on PO-4404 → **OK**  
- E-com cartons short → **Purchase**

### Capacity
Are machines/people overloaded?

### Calendar
Visual week plan.

## 14) Quality Control
**Purpose:** Catch bad material / bad production early.

- **Incoming QC** — check purchased lawn / embroidery  
- **In-process QC** — check during stitching / print  
- **Final QC** — check finished RTW  

**Fabric inspection:** mark defects on a fabric map.  
**NCR / CAPA:** problem report + corrective action.  
**Example:** Batch BT-OMBRE-441 failed shade → rework or reject.

## 15) Costing
**Purpose:** Know if a product makes profit.

Cost = Material + Labor + Machine + Utilities + Overhead + Packaging + Waste + Subcontract

**Example Prism Kaftaan:**
- Standard cost vs actual cost  
- Variance = you spent more than planned  

## 16) Machines
**Purpose:** Machine list + status (Running / Idle / Breakdown / Maintenance).  
**Example:** Sewing Line-02 is **Breakdown** for 2.4 hours (Junaid Ansari assigned).

## 17) Maintenance
**Purpose:** Fix machines before/after they break.  
Preventive / Corrective / Breakdown work orders.  
KPIs: Downtime, MTBF, MTTR.

## 18) Subcontracting
**Purpose:** Send work outside (e.g. SITE Dye & Print), track send/receive/loss/cost.  
**Example:** Send lawn fabric for blush ombre print → receive printed fabric → check loss %.

## 19) Dispatch & Logistics
**Purpose:** Ship finished goods to customer (local, UAE, UK, or cocoon.pk).  
Packing list, transporter, container, commercial invoice for export.

## 20) Finance & Accounting
**Purpose:** Money in / money out.

- **AR (Receivables):** customers owe you  
- **AP (Payables):** you owe suppliers  
- **GL / COA:** accounting books  
- **Reports:** P&L, Balance Sheet, Cash Flow  

**Example:** Boutique Collective PK owes PKR 1.85M (overdue).

## 21) HR & Payroll
**Purpose:** People — employees, shifts, attendance, leave, salary.  
Factory needs: shift A/B, overtime, worker assignment to lines.  
**Example operators:** Nazia Bibi (sewing), leadership: Salman Sabir / Nargis Imran.

## 22) Assets
**Purpose:** Company assets register (machines, vehicles, equipment), depreciation, disposal.

## 23) Reports & Analytics
**Purpose:** Ready reports for sales, purchase, stock, production, quality, finance.  
Filter + export PDF/Excel/CSV (mock).

## 24) Notifications
**Purpose:** Alerts.  
Examples: PO needs approval (Nargis Imran / Finance), sewing line down, hang tags low, late production, failed QC.

## 25) Organization
**Purpose:** Company structure: Cocoon Clothing, SITE Karachi Plant, Karachi FG Warehouse, Online Fulfillment Hub, departments, cost centers.

## 26) Approvals
**Purpose:** Pending approvals (PO, PR, leave, discount). Approve / Reject with confirmation.  
**Approvers often:** Salman Sabir (CEO), Nargis Imran (Senior Manager).

## 27) Workflow Builder
**Purpose:** Configure who must approve what.  
**Example:** PR → Dept Manager → Purchase → Finance → Director.

## 28) Administration
Users, roles/permissions, audit logs (who changed what).

## 29) Settings
Currency PKR, NTN/STRN, fiscal year, tax, units, email (wecare@cocoon.pk), soft theme options.

## 30) Super Admin
Zendrock platform owner view: tenants (incl. Cocoon Clothing), plans (Trial/Starter/Pro/Enterprise), billing, support.  
Switch role to **Super Admin** in top bar to see it.

---

# Best 10-minute demo script

1. **Login + MFA**  
2. **Dashboard** — show KPIs  
3. **Demo Workflows → Prism Kaftaan** — click each step  
4. Open **SO-1024** — order detail (approvers Areeba Malik / Salman Sabir)  
5. Open **PRO-7001** — production progress  
6. Open **MRP** — shortages (hang tags)  
7. Open **Inventory** — low stock Cocoon Hang Tags  
8. Open **Production Floor** — operator buttons  
9. Open **Finance AR** — who owes money  
10. Switch role to **Factory Worker** — show simple menu  

---

# One example end-to-end (memorize this)

**Boutique Collective PK orders 10,000 Prism Kaftaan 2-Piece (SO-1024)**

1. Sales creates order with style CCN-KAFT-PRISM, colors/sizes  
2. BOM says lawn fabric + Cocoon hang tags needed  
3. MRP finds hang tags short → Purchase Order PO-4404  
4. Goods received into KHI-ACC-01 / Karachi FG Warehouse  
5. Production order PRO-7001: Cutting → Stitching → Finishing  
6. QC checks samples/final goods  
7. Finished goods go to KHI-FG-01  
8. Dispatch ships to customer  
9. Invoice issued  
10. Finance collects payment  
11. Costing shows profit per piece  

That is the whole ERP story.

---

# Tip for demos

- Keep language simple: “This screen is where we buy lawn fabric”, not “procurement requisition conversion”.  
- Always connect screens: “Order creates production, production uses stock, stock comes from purchase.”  
- Use the **role switcher** to prove the same system works for CEO Salman Sabir and sewing operator Nazia Bibi.
