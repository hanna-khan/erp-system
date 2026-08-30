# Zendrock ERP

Enterprise textile manufacturing ERP mockup for Pakistani mills, garment factories, traders, and integrated groups.

## Structure

```
zendrock-erp/
├── frontend/   # Next.js interactive UI mockup (this app)
└── backend/    # Placeholder for future Laravel API
```

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → sign in (any password + 6-digit MFA).

## Demo highlights

- Soft premium UI (blue / white / lavender)
- Role switcher in the top bar (CEO, Production, QC, Warehouse, Worker, Super Admin, …)
- Plant / branch / fiscal year context
- End-to-end workflows: **Demo Workflows** in the sidebar
  - 10,000 T-Shirts order → production → dispatch → finance
  - Weaving yarn → grey fabric → dyeing → delivery
  - Dyeing batch → recipe → inspection → rework
- Production Floor MES at `/production-floor` (tablet-oriented)
- Zendrock AI assistant with mock answers
- Super Admin tenant / subscription screens

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Recharts
- Lucide icons
- Mock data only (no real backend)
