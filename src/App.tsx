import { useState, useRef, useEffect } from "react";
import altriumLogo from "@/imports/Altrium-logo-1-1024x268.png";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "Sales Manager" | "Sales Rep" | "Tech Lead" | "Finance Officer" | "Admin";
type View = "dashboard" | "leads" | "deals" | "users" | "assessments" | "resources";

const ROLES: Role[] = ["Sales Manager", "Sales Rep", "Tech Lead", "Finance Officer", "Admin"];

const ROLE_COLORS: Record<Role, string> = {
  "Sales Manager": "#1ed760",
  "Sales Rep": "#34d399",
  "Tech Lead": "#1a6fe8",
  "Finance Officer": "#a78bfa",
  "Admin": "#fc4f37",
};

const ROLE_INITIALS: Record<Role, string> = {
  "Sales Manager": "SM",
  "Sales Rep": "SR",
  "Tech Lead": "TL",
  "Finance Officer": "FO",
  "Admin": "AD",
};

// ─── Nav config per role ──────────────────────────────────────────────────────

type NavItem = { label: string; view: View; icon: string };

const ROLE_NAV: Record<Role, NavItem[]> = {
  "Sales Manager": [
    { label: "Dashboard",    view: "dashboard",    icon: "⬡" },
    { label: "Leads",        view: "leads",        icon: "◎" },
    { label: "Assessments",  view: "assessments",  icon: "◉" },
    { label: "Deals",        view: "deals",        icon: "◈" },
  ],
  "Sales Rep": [
    { label: "Dashboard",    view: "dashboard",    icon: "⬡" },
    { label: "My Leads",     view: "leads",        icon: "◎" },
  ],
  "Tech Lead": [
    { label: "Dashboard",    view: "dashboard",    icon: "⬡" },
    { label: "Assessments",  view: "assessments",  icon: "◉" },
    { label: "Resources",    view: "resources",    icon: "◷" },
  ],
  "Finance Officer": [
    { label: "Dashboard",    view: "dashboard",    icon: "⬡" },
    { label: "Assessments",  view: "assessments",  icon: "◉" },
  ],
  "Admin": [
    { label: "Dashboard",    view: "dashboard",    icon: "⬡" },
    { label: "Users",        view: "users",        icon: "◎" },
  ],
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const SALES_REPS = ["Ishara Fonseka", "Nadeesha Perera", "Ruwani Peris", "Kamal Jayasuriya", "Sithara Mendis", "Dinesh Weerasinghe"];

const LEADS = [
  { id: 1, name: "Meridian Holdings",  contact: "Hashmath Fazli",  email: "hashmath@meridian.io",    phone: "+94 77 234 5678", industry: "IT Services",    source: "Referral",       value: "$124,000", status: "New",        assigned: "Yaqoob S.", rep: "Ishara Fonseka",    date: "Aug 12", priority: "High"   },
  { id: 2, name: "Vantage Systems",    contact: "Leo Chen",         email: "leo.chen@vantage.sg",     phone: "+65 81 234 5678", industry: "Cybersecurity",  source: "Cold Outreach",  value: "$87,500",  status: "Contacted",  assigned: "Yaqoob S.", rep: "Nadeesha Perera",  date: "Aug 10", priority: "Medium" },
  { id: 3, name: "Orbit Retail Ltd",  contact: "Michelle Tran",    email: "m.tran@orbitretail.com",  phone: "+60 12 345 6789", industry: "Retail",         source: "Website",        value: "$210,000", status: "Assessment", assigned: "Yaqoob S.", rep: "Ishara Fonseka",   date: "Aug 8",  priority: "Medium" },
  { id: 4, name: "Apex Dynamics",     contact: "Farhan Ali",       email: "farhan@apexdyn.ae",       phone: "+971 50 123 4567", industry: "Manufacturing", source: "Trade Show",     value: "$45,000",  status: "Assessment", assigned: "Yaqoob S.", rep: "Ruwani Peris",     date: "Aug 5",  priority: "Low"    },
  { id: 5, name: "CloudBridge Inc.",  contact: "Ananya Roy",       email: "ananya@cloudbridge.io",   phone: "+91 98 765 4321", industry: "Cloud Services", source: "Partner",        value: "$330,000", status: "Assessment", assigned: "Yaqoob S.", rep: "Nadeesha Perera",  date: "Aug 3",  priority: "High"   },
  { id: 6, name: "NexGen Pharma",     contact: "Ravidu Pasan",     email: "rpasan@nexgen.lk",        phone: "+94 71 345 6789", industry: "Healthcare",     source: "Referral",       value: "$178,000", status: "Assessment", assigned: "Yaqoob S.", rep: "Ishara Fonseka",   date: "Jul 30", priority: "Medium" },
  { id: 7, name: "Solaris Energy",    contact: "Senula Silva",     email: "senula@solaris.lk",       phone: "+94 76 543 2109", industry: "Energy",         source: "Inbound",        value: "$95,000",  status: "Closed",     assigned: "Yaqoob S.", rep: "Ruwani Peris",     date: "Jul 28", priority: "Low"    },
];

const DEALS = [
  { id: 1, name: "Meridian ERP Rollout",    client: "Meridian Holdings", value: "$124,000", rep: "Ishara Fonseka",   date: "Aug 12" },
  { id: 2, name: "CloudBridge Migration",   client: "CloudBridge Inc.", value: "$330,000", rep: "Nadeesha Perera",  date: "Aug 3"  },
  { id: 3, name: "NexGen CRM Setup",        client: "NexGen Pharma",    value: "$178,000", rep: "Ishara Fonseka",   date: "Jul 30" },
  { id: 4, name: "Orbit Analytics Suite",   client: "Orbit Retail Ltd", value: "$210,000", rep: "Ishara Fonseka",   date: "Aug 8"  },
  { id: 5, name: "Apex DevOps Pipeline",    client: "Apex Dynamics",    value: "$45,000",  rep: "Ruwani Peris",     date: "Aug 5"  },
  { id: 6, name: "Vantage Security Audit",  client: "Vantage Systems",  value: "$87,500",  rep: "Nadeesha Perera",  date: "Aug 10" },
];

const PROJECTS = [
  { id: 1, name: "Meridian ERP Rollout", status: "In Progress", progress: 62, lead: "Inshiraff Thaseem", deadline: "Nov 30", team: 4 },
  { id: 2, name: "CloudBridge Migration", status: "Planning", progress: 18, lead: "Yaqoob Sadikeen", deadline: "Dec 15", team: 6 },
  { id: 3, name: "Apex DevOps Pipeline", status: "Completed", progress: 100, lead: "Yaqoob S.", deadline: "Aug 20", team: 3 },
  { id: 4, name: "Orbit Analytics Suite", status: "On Hold", progress: 35, lead: "Hashmath F.", deadline: "Jan 10", team: 5 },
  { id: 5, name: "NexGen CRM Setup", status: "In Progress", progress: 44, lead: "Inshiraff Thaseem", deadline: "Oct 22", team: 4 },
];

const TASKS = [
  { id: 1, title: "Review technical assessment for Meridian", project: "Meridian ERP Rollout", priority: "High", status: "In Progress", due: "Aug 22" },
  { id: 2, title: "Assign team members to CloudBridge", project: "CloudBridge Migration", priority: "High", status: "To Do", due: "Aug 24" },
  { id: 3, title: "Upload financial documents", project: "NexGen CRM Setup", priority: "Medium", status: "To Do", due: "Aug 26" },
  { id: 4, title: "Perform product handover check", project: "Apex DevOps Pipeline", priority: "Low", status: "Done", due: "Aug 20" },
  { id: 5, title: "Monitor task progress — Orbit Analytics", project: "Orbit Analytics Suite", priority: "Medium", status: "In Progress", due: "Aug 28" },
  { id: 6, title: "Submit financial assessment", project: "CloudBridge Migration", priority: "High", status: "To Do", due: "Sep 1" },
];

const USERS = [
  { id: 1,  name: "Yaqoob Sadikeen",    email: "yaqoob.s@altrium.io",    role: "Sales Manager",   status: "Active",   lastLogin: "Today",     password: "Sales@123"   },
  { id: 2,  name: "Ishara Fonseka",     email: "ishara.f@altrium.io",    role: "Sales Rep",       status: "Active",   lastLogin: "Today",     password: "Rep@123"     },
  { id: 3,  name: "Nadeesha Perera",    email: "nadeesha.p@altrium.io",  role: "Sales Rep",       status: "Active",   lastLogin: "Yesterday", password: "Rep@456"     },
  { id: 4,  name: "Ruwani Peris",       email: "ruwani.p@altrium.io",    role: "Sales Rep",       status: "Active",   lastLogin: "Aug 18",    password: "Rep@789"     },
  { id: 5,  name: "Kamal Jayasuriya",   email: "kamal.j@altrium.io",     role: "Sales Rep",       status: "Active",   lastLogin: "Today",     password: "Rep@321"     },
  { id: 6,  name: "Sithara Mendis",     email: "sithara.m@altrium.io",   role: "Sales Rep",       status: "Active",   lastLogin: "Aug 17",    password: "Rep@654"     },
  { id: 7,  name: "Dinesh Weerasinghe", email: "dinesh.w@altrium.io",    role: "Sales Rep",       status: "Inactive", lastLogin: "Aug 12",    password: "Rep@000"     },
  { id: 8,  name: "Ravidu Pasan",       email: "ravidu.p@altrium.io",    role: "Tech Lead",       status: "Active",   lastLogin: "Today",     password: "Tech@123"    },
  { id: 9,  name: "Hashmath Fazli",     email: "hashmath.f@altrium.io",  role: "Finance Officer", status: "Active",   lastLogin: "Aug 17",    password: "Finance@123" },
  { id: 10, name: "Natalia Dilshani",   email: "natalia.d@altrium.io",   role: "Admin",           status: "Active",   lastLogin: "Yesterday", password: "Admin@123"   },
];

type AssessmentRecord = {
  id: number;
  leadName: string;
  type: "Technical" | "Financial";
  status: "Pending" | "In Review" | "Submitted";
  risk: "Low" | "Medium" | "High";
  assessor: string;
  date: string;
  notes: string;
  document?: string;
};

const ASSESSMENTS: AssessmentRecord[] = [
  { id: 1,  leadName: "Apex Dynamics",    type: "Technical",  status: "Submitted",  risk: "Low",    assessor: "Ravidu Pasan",   date: "Aug 6",  notes: "Clean requirements. Straightforward implementation." },
  { id: 2,  leadName: "Apex Dynamics",    type: "Financial",  status: "Pending",    risk: "Low",    assessor: "Hashmath Fazli", date: "—",      notes: "" },
  { id: 3,  leadName: "CloudBridge Inc.", type: "Technical",  status: "In Review",  risk: "High",   assessor: "Ravidu Pasan",   date: "Aug 4",  notes: "Reviewing cloud migration complexity and infra dependencies." },
  { id: 4,  leadName: "CloudBridge Inc.", type: "Financial",  status: "Submitted",  risk: "High",   assessor: "Hashmath Fazli", date: "Aug 5",  notes: "Revenue projections reviewed. High value, acceptable margins." },
  { id: 5,  leadName: "NexGen Pharma",    type: "Technical",  status: "Submitted",  risk: "Low",    assessor: "Ravidu Pasan",   date: "Aug 27", notes: "Reviewing integration requirements." },
  { id: 6,  leadName: "NexGen Pharma",    type: "Financial",  status: "Pending",    risk: "Low",    assessor: "Hashmath Fazli", date: "—",      notes: "" },
  { id: 7,  leadName: "Orbit Retail Ltd", type: "Technical",  status: "Pending",    risk: "Low",    assessor: "Ravidu Pasan",   date: "—",      notes: "" },
  { id: 8,  leadName: "Orbit Retail Ltd", type: "Financial",  status: "Submitted",  risk: "Low",    assessor: "Hashmath Fazli", date: "Aug 8",  notes: "Margins acceptable. Recommend proceeding." },
];

const RESOURCES = [
  { id: 1,  name: "Ravidu Pasan",        role: "Tech Lead",       skills: ["React", "Node.js", "AWS", "TypeScript"],        availability: "80%", project: "Meridian ERP" },
  { id: 4,  name: "Chamil Wijeratne",    role: "Senior Engineer", skills: ["Java", "Spring Boot", "Kubernetes", "CI/CD"],   availability: "70%", project: "Meridian ERP" },
  { id: 5,  name: "Dulith Abeywickrama", role: "Full-Stack Dev",  skills: ["Vue.js", "Django", "PostgreSQL", "Redis"],      availability: "60%", project: "NexGen CRM" },
  { id: 6,  name: "Thilini Gunarathna",  role: "Frontend Dev",    skills: ["React", "Figma", "TailwindCSS", "Storybook"],   availability: "90%", project: "—" },
  { id: 7,  name: "Nuwan Ekanayake",     role: "Backend Dev",     skills: ["Go", "gRPC", "MySQL", "Terraform"],             availability: "40%", project: "CloudBridge" },
  { id: 8,  name: "Rashmi Bandara",      role: "QA Engineer",     skills: ["Selenium", "Cypress", "Jest", "Postman"],       availability: "75%", project: "Orbit Analytics" },
  { id: 9,  name: "Lasith Maduwantha",   role: "DevOps Engineer", skills: ["AWS", "Docker", "Jenkins", "Ansible"],          availability: "55%", project: "Apex DevOps" },
  { id: 10, name: "Kaveesha Jayasena",   role: "Data Engineer",   skills: ["Spark", "Airflow", "Snowflake", "dbt"],         availability: "85%", project: "—" },
  { id: 11, name: "Prageeth Nissanka",   role: "Mobile Dev",      skills: ["React Native", "Swift", "Kotlin", "Firebase"],  availability: "65%", project: "NexGen CRM" },
];

// ─── Chips ────────────────────────────────────────────────────────────────────

function LeadStatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    New:         "bg-[#1ed76020] text-[#1ed760] border-[#1ed76030]",
    Contacted:   "bg-[#1a6fe820] text-[#60a5fa] border-[#1a6fe830]",
    Qualified:   "bg-[#a78bfa20] text-[#a78bfa] border-[#a78bfa30]",
    Assessment:  "bg-[#f59e0b20] text-[#f59e0b] border-[#f59e0b30]",
    Closed:      "bg-[#22222e] text-[#7a7a90] border-[#22222e]",
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${map[status] ?? "bg-muted text-muted-foreground border-border"}`}>
      {status}
    </span>
  );
}

function PriorityChip({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    High: "text-[#fc4f37]",
    Medium: "text-[#f59e0b]",
    Low: "text-[#7a7a90]",
  };
  return <span className={`text-xs font-semibold uppercase tracking-wider ${map[priority] ?? ""}`}>{priority}</span>;
}

function StatusDot({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "#1ed760",
    Inactive: "#7a7a90",
    "In Progress": "#1a6fe8",
    "To Do": "#7a7a90",
    Done: "#1ed760",
    "On Hold": "#fc4f37",
    Planning: "#f59e0b",
    Completed: "#1ed760",
    Submitted: "#1a6fe8",
    Pending: "#f59e0b",
    "In Review": "#a78bfa",
  };
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: map[status] ?? "#7a7a90" }} />
      <span className="text-sm text-[var(--foreground)]">{status}</span>
    </span>
  );
}

// ─── KPI Cards ────────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: string }) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl" style={{ background: accent }} />
      <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
        {label}
      </span>
      <span className="text-3xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
        {value}
      </span>
      <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
        {sub}
      </span>
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ value, color = "var(--primary)" }: { value: number; color?: string }) {
  return (
    <div className="w-full h-1.5 rounded-full" style={{ background: "var(--muted)" }}>
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

// ─── Views ────────────────────────────────────────────────────────────────────

function DashboardView({ role, activityLog, users, leads, deals, assessments }: {
  role: Role;
  activityLog: { time: string; event: string; type: string }[];
  users?: typeof USERS;
  leads?: typeof LEADS;
  deals?: typeof DEALS;
  assessments?: AssessmentRecord[];
}) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const allLeads = leads ?? LEADS;
  const allDeals = deals ?? DEALS;
  const allAssessments = assessments ?? [];

  const activeLeads = allLeads.filter((l) => l.status !== "Closed").length;
  const closedDeals = allDeals.length;
  const qualifiedLeads = allLeads.filter((l) => l.status === "Qualified").length;
  const inAssessment = allLeads.filter((l) => l.status === "Assessment").length;
  const pendingAssess = allAssessments.filter((a) => a.status === "Pending" || a.status === "In Review").length;
  const totalAssessValue = allAssessments
    .map((a) => allLeads.find((l) => l.name === a.leadName))
    .filter(Boolean)
    .reduce((s, l) => s + parseInt((l!.value ?? "0").replace(/[^0-9]/g, "") || "0"), 0);

  const kpiSets: Record<Role, { label: string; value: string; sub: string; accent: string }[]> = {
    "Sales Manager": [
      { label: "Active Leads",     value: String(activeLeads),    sub: `${qualifiedLeads} qualified`, accent: "#1ed760" },
      { label: "In Assessment",    value: String(inAssessment),   sub: `${pendingAssess} pending review`, accent: "#f59e0b" },
      { label: "Closed Deals",     value: String(closedDeals),    sub: "converted from leads",     accent: "#1a6fe8" },
      { label: "Closed Leads",     value: String(allLeads.filter((l) => l.status === "Closed").length), sub: "not converted", accent: "#7a7a90" },
    ],
    "Tech Lead": [
      { label: "Pending Assessments", value: String(allAssessments.filter((a) => a.type === "Technical" && ["Pending","In Review"].includes(a.status)).length), sub: "technical reviews", accent: "#1a6fe8" },
      { label: "Active Projects", value: "3", sub: "1 at risk", accent: "#fc4f37" },
      { label: "Skills Gaps Flagged", value: "7", sub: "across 2 projects", accent: "#f59e0b" },
      { label: "Docs Uploaded", value: "23", sub: "this month", accent: "#1ed760" },
    ],
    "Finance Officer": [
      { label: "Pending Reviews",  value: String(allAssessments.filter((a) => a.type === "Financial" && ["Pending","In Review"].includes(a.status)).length), sub: "financial assessments", accent: "#a78bfa" },
      { label: "Assessments Done", value: String(allAssessments.filter((a) => a.type === "Financial" && a.status === "Submitted").length), sub: "submitted", accent: "#1ed760" },
      { label: "Pending Approvals", value: String(allAssessments.filter((a) => a.type === "Financial" && a.status === "Submitted").length), sub: "awaiting SM approval", accent: "#f59e0b" },
      { label: "Total Assessed",   value: "$" + Math.round(totalAssessValue / 1000) + "K", sub: "in reviewed leads", accent: "#1a6fe8" },
    ],
    "Admin": [
      { label: "Total Users",      value: String((users ?? USERS).length), sub: `${(users ?? USERS).filter((u) => u.status === "Inactive").length} inactive`, accent: "#fc4f37" },
      { label: "Active Users",     value: String((users ?? USERS).filter((u) => u.status === "Active").length), sub: "currently active", accent: "#1ed760" },
      { label: "Roles Assigned",   value: "100%", sub: "all users have a role", accent: "#1a6fe8" },
      { label: "Password Resets",  value: "3", sub: "last 30 days", accent: "#f59e0b" },
    ],
    "Sales Rep": [
      { label: "My Open Leads",    value: "3", sub: "2 need follow-up", accent: "#34d399" },
      { label: "My Active Deals",  value: "2", sub: "$178K in pipeline", accent: "#1a6fe8" },
      { label: "Follow-ups Due",   value: "4", sub: "1 overdue", accent: "#fc4f37" },
      { label: "Closed This Month", value: "1", sub: "Apex DevOps Pipeline", accent: "#f59e0b" },
    ],
  };

  const kpis = kpiSets[role];

  const actColor: Record<string, string> = {
    lead: "#1ed760", deal: "#1a6fe8", assess: "#a78bfa", user: "#f59e0b", project: "#fc4f37",
  };

  const PIPELINE_STATUSES = ["New", "Contacted", "Qualified", "Assessment", "Closed"] as const;
  const pipelineStatusColors: Record<string, string> = {
    New: "#1ed760", Contacted: "#60a5fa", Qualified: "#a78bfa", Assessment: "#f59e0b", Closed: "#7a7a90",
  };
  const maxLeadCount = Math.max(1, ...PIPELINE_STATUSES.map((s) => allLeads.filter((l) => l.status === s).length));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-1">{greeting} 👋</h2>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Here's what's happening across your pipeline today.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      {role === "Admin" ? (
        /* ── Admin-specific bottom section ── */
        <div className="flex flex-col gap-4">
          {/* Role breakdown */}
          <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-5" style={{ color: "var(--muted-foreground)" }}>
              Users by Role
            </h3>
            {(["Sales Manager", "Sales Rep", "Tech Lead", "Finance Officer", "Admin"] as Role[]).map((r) => {
              const count = (users ?? USERS).filter((u) => u.role === r).length;
              const total = (users ?? USERS).length;
              const pct = total ? Math.round((count / total) * 100) : 0;
              const rColor = ROLE_COLORS[r];
              return (
                <div key={r} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{r}</span>
                    <span className="text-xs font-mono font-semibold" style={{ color: rColor }}>{count} user{count !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: rColor }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* User roster */}
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <div className="px-5 py-4" style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
              <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>All Users</h3>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {(users ?? USERS).map((u, i) => (
                  <tr key={u.id} style={{ background: i % 2 === 0 ? "var(--card)" : "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: ROLE_COLORS[u.role as Role] + "20", color: ROLE_COLORS[u.role as Role] }}>
                          {u.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                        </div>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3" style={{ color: "var(--muted-foreground)" }}>{u.email}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold" style={{ background: ROLE_COLORS[u.role as Role] + "18", color: ROLE_COLORS[u.role as Role] }}>{u.role}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: u.status === "Active" ? "#1ed76018" : "#7a7a9018", color: u.status === "Active" ? "#1ed760" : "#7a7a90" }}>{u.status}</span>
                    </td>
                    <td className="px-5 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>Last login: {u.lastLogin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* User activity log */}
          <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-5" style={{ color: "var(--muted-foreground)" }}>User Activity</h3>
            <div className="flex flex-col gap-4">
              {activityLog.filter((a) => a.type === "user").length === 0 ? (
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>No user activity recorded yet.</p>
              ) : (
                activityLog.filter((a) => a.type === "user").map((a, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: "#f59e0b" }} />
                    <div>
                      <p className="text-sm leading-snug">{a.event}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{a.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Lead pipeline by status (live) */}
          <div className="lg:col-span-2 rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-5" style={{ color: "var(--muted-foreground)" }}>
              Lead Pipeline
            </h3>
            {PIPELINE_STATUSES.map((status) => {
              const count = allLeads.filter((l) => l.status === status).length;
              const pct = Math.round((count / maxLeadCount) * 100);
              const color = pipelineStatusColors[status];
              return (
                <div key={status} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{status}</span>
                    <span className="font-mono text-xs font-semibold" style={{ color }}>{count} lead{count !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Activity feed */}
          <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-5" style={{ color: "var(--muted-foreground)" }}>
              Recent Activity
            </h3>
            <div className="flex flex-col gap-4">
              {activityLog.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>No activity yet.</p>
              ) : activityLog.slice(0, 9).map((a, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: actColor[a.type] ?? "#7a7a90" }} />
                  <div>
                    <p className="text-sm leading-snug">{a.event}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type CommEntry = { id: number; type: "Call" | "Meeting" | "Email"; summary: string; time: string };
type FollowUp = { id: number; date: string; purpose: string; status: "Upcoming" | "Completed" | "Cancelled" };
type LeadNote = { id: number; text: string; time: string };

const leadCommsMap: Record<number, CommEntry[]> = {};
const leadFollowUpsMap: Record<number, FollowUp[]> = {};
const leadNotesMap: Record<number, LeadNote[]> = {};

function LeadDetailPanel({
  lead,
  onClose,
  isSalesRep,
  isSalesManager,
  onQualifyLead,
  onSubmitForAssessment,
  onContactLead,
}: {
  lead: typeof LEADS[number] | null;
  onClose: () => void;
  isSalesRep?: boolean;
  isSalesManager?: boolean;
  onQualifyLead?: (leadId: number) => void;
  onSubmitForAssessment?: (leadId: number) => void;
  onContactLead?: (leadId: number) => void;
}) {
  const [tab, setTab] = useState<"overview" | "activity" | "notes">("overview");
  const [comms, setComms] = useState<CommEntry[]>(() => leadCommsMap[lead?.id ?? 0] ?? []);
  const [followUps, setFollowUps] = useState<FollowUp[]>(() => leadFollowUpsMap[lead?.id ?? 0] ?? []);
  const [notes, setNotes] = useState<LeadNote[]>(() => leadNotesMap[lead?.id ?? 0] ?? []);

  const [newCommType, setNewCommType] = useState<"Call" | "Meeting" | "Email">("Call");
  const [newCommText, setNewCommText] = useState("");
  const [addingComm, setAddingComm] = useState(false);
  const [newFUDate, setNewFUDate] = useState("");
  const [newFUPurpose, setNewFUPurpose] = useState("");
  const [addingFU, setAddingFU] = useState(false);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    if (lead) {
      setTab("overview");
      setComms(leadCommsMap[lead.id] ?? []);
      setFollowUps(leadFollowUpsMap[lead.id] ?? []);
      setNotes(leadNotesMap[lead.id] ?? []);
      setAddingComm(false);
      setAddingFU(false);
      setNewCommText("");
      setNewNote("");
    }
  }, [lead?.id]);

  if (!lead) return null;

  const statusColors: Record<string, string> = {
    New: "#1ed760", Contacted: "#60a5fa", Qualified: "#a78bfa", Assessment: "#f59e0b", Closed: "#7a7a90",
  };
  const priorityColors: Record<string, string> = { High: "#fc4f37", Medium: "#f59e0b", Low: "#7a7a90" };
  const color = statusColors[lead.status] ?? "#7a7a90";
  const pColor = priorityColors[(lead as any).priority ?? "Medium"] ?? "#f59e0b";

  const nowStr = () => new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  const PIPELINE_STEPS = ["New", "Contacted", "Qualified", "Assessment", "Closed"];
  const canEdit = !!isSalesRep;
  const currentStep = PIPELINE_STEPS.indexOf(lead.status);

  function addComm() {
    if (!newCommText.trim()) return;
    const entry: CommEntry = { id: Date.now(), type: newCommType, summary: newCommText.trim(), time: nowStr() };
    const updated = [entry, ...comms];
    setComms(updated);
    leadCommsMap[lead!.id] = updated;
    setNewCommText("");
    setAddingComm(false);
    // Auto-advance New → Contacted on first logged interaction
    if (lead!.status === "New" && onContactLead) onContactLead(lead!.id);
  }

  function addFollowUp() {
    if (!newFUDate || !newFUPurpose.trim()) return;
    const fu: FollowUp = { id: Date.now(), date: newFUDate, purpose: newFUPurpose.trim(), status: "Upcoming" };
    const updated = [fu, ...followUps];
    setFollowUps(updated);
    leadFollowUpsMap[lead!.id] = updated;
    setNewFUDate(""); setNewFUPurpose(""); setAddingFU(false);
  }

  function updateFUStatus(id: number, status: FollowUp["status"]) {
    const updated = followUps.map((f) => f.id === id ? { ...f, status } : f);
    setFollowUps(updated);
    leadFollowUpsMap[lead!.id] = updated;
  }

  function addNote() {
    if (!newNote.trim()) return;
    const entry: LeadNote = { id: Date.now(), text: newNote.trim(), time: nowStr() };
    const updated = [entry, ...notes];
    setNotes(updated);
    leadNotesMap[lead!.id] = updated;
    setNewNote("");
  }

  const commColors: Record<string, string> = { Call: "#1ed760", Meeting: "#1a6fe8", Email: "#a78bfa" };
  const fuStatusColors: Record<string, string> = { Upcoming: "#f59e0b", Completed: "#1ed760", Cancelled: "#7a7a90" };
  const l = lead as any;

  return (
    <div className="fixed inset-0 z-50 flex" style={{ background: "rgba(0,0,0,0.65)" }} onClick={onClose}>
      <div
        className="ml-auto h-full w-full flex flex-col"
        style={{ maxWidth: 760, background: "var(--card)", borderLeft: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── HEADER ── */}
        <div className="px-7 py-6 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-base font-bold shrink-0"
                style={{ background: "#1f2937", color: "var(--primary)", border: "1px solid #2d3748" }}
              >
                {lead.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">{lead.name}</h2>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-xs font-mono px-2 py-0.5 rounded font-semibold" style={{ background: "#1f2937", color: "var(--muted-foreground)" }}>
                    L-00{lead.id}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full font-semibold" style={{ background: color + "18", color, border: `1px solid ${color}35` }}>
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: color }} />
                    {lead.status}
                  </span>
                  {l.priority && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold tracking-wide" style={{ background: pColor + "15", color: pColor, border: `1px solid ${pColor}30` }}>
                      {l.priority.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* Sales Rep: qualify the lead */}
              {isSalesRep && onQualifyLead && lead.status === "Contacted" && (
                <button
                  onClick={() => { onQualifyLead(lead.id); onClose(); }}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-85"
                  style={{ background: "#a78bfa", color: "#fff" }}
                >
                  Submit as Qualified
                </button>
              )}
              {/* Sales Manager: send qualified lead to assessment */}
              {isSalesManager && onSubmitForAssessment && lead.status === "Qualified" && (
                <button
                  onClick={() => { onSubmitForAssessment(lead.id); onClose(); }}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-85"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  Submit for Assessment
                </button>
              )}
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#ffffff10] transition-colors" style={{ color: "var(--muted-foreground)" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex px-7 pt-0 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          {(["overview", "activity", "notes"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-3.5 text-sm font-semibold capitalize transition-all"
              style={{
                color: tab === t ? "var(--foreground)" : "var(--muted-foreground)",
                borderBottom: tab === t ? "2px solid var(--primary)" : "2px solid transparent",
              }}
            >
              {t === "activity" ? "Activity" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* ── CONTENT ── */}
        <div className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-5">

          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <>
              {/* Two-column cards */}
              <div className="grid grid-cols-2 gap-4">
                {/* Contact Info */}
                <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Contact Info</p>
                  {[
                    { label: "Contact", value: lead.contact },
                    { label: "Email", value: l.email ?? "—" },
                    { label: "Phone", value: l.phone ?? "—" },
                    { label: "Industry", value: l.industry ?? "—" },
                    { label: "Source", value: l.source ?? "—" },
                  ].map((f) => (
                    <div key={f.label}>
                      <p className="text-xs mb-0.5" style={{ color: "var(--muted-foreground)" }}>{f.label}</p>
                      <p className="text-sm font-semibold break-all">{f.value}</p>
                    </div>
                  ))}
                </div>

                {/* Deal Details */}
                <div className="rounded-2xl p-5 flex flex-col" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--muted-foreground)" }}>Deal Details</p>
                  <div className="flex flex-col gap-4 flex-1">
                    {[
                      { label: "Est. Value", value: lead.value, accent: true },
                      { label: "Assigned To", value: lead.rep || "Unassigned" },
                      { label: "Created", value: lead.date },
                      { label: "Last Activity", value: "Today" },
                    ].map((f) => (
                      <div key={f.label} className="flex items-center justify-between">
                        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{f.label}</p>
                        <p className="text-sm font-bold" style={f.accent ? { color: "var(--primary)", fontFamily: "monospace" } : {}}>{f.value}</p>
                      </div>
                    ))}
                  </div>
                  {/* Notes sub-section */}
                  <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                    <p className="text-xs mb-2" style={{ color: "var(--muted-foreground)" }}>Notes</p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                      {notes.length > 0 ? notes[0].text : <span style={{ color: "var(--muted-foreground)" }}>No notes added yet.</span>}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pipeline Progress */}
              <div className="rounded-2xl p-6" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: "var(--muted-foreground)" }}>Pipeline Progress</p>
                <div className="flex items-center">
                  {PIPELINE_STEPS.map((step, idx) => {
                    const done = idx < currentStep;
                    const active = idx === currentStep;
                    const stepColor = done || active ? "var(--primary)" : "#374151";
                    return (
                      <div key={step} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                            style={{
                              background: done ? "var(--primary)" : active ? "transparent" : "#1f2937",
                              border: active ? `2px solid var(--primary)` : done ? "none" : "2px solid #374151",
                              color: done ? "var(--primary-foreground)" : active ? "var(--primary)" : "#4b5563",
                            }}
                          >
                            {done ? (
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>
                          <span className="text-xs font-medium whitespace-nowrap" style={{ color: active ? "var(--primary)" : done ? "var(--foreground)" : "var(--muted-foreground)" }}>
                            {step}
                          </span>
                        </div>
                        {idx < PIPELINE_STEPS.length - 1 && (
                          <div className="flex-1 h-px mx-3 mb-5" style={{ background: done ? "var(--primary)" : "#1f2937" }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ── ACTIVITY ── */}
          {tab === "activity" && (
            <>
              {/* Follow-up scheduler */}
              {canEdit && (
                addingFU ? (
                  <div className="rounded-xl p-4 flex flex-col gap-3" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#60a5fa" }}>Schedule Follow-up</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Date</label>
                        <input type="date" value={newFUDate} onChange={(e) => setNewFUDate(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)", colorScheme: "dark" }} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Purpose</label>
                        <input placeholder="e.g. Demo call…" value={newFUPurpose} onChange={(e) => setNewFUPurpose(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setAddingFU(false)} className="px-3 py-1.5 text-xs rounded-lg" style={{ color: "var(--muted-foreground)" }}>Cancel</button>
                      <button onClick={addFollowUp} disabled={!newFUDate || !newFUPurpose.trim()} className="px-4 py-1.5 text-xs rounded-lg font-semibold disabled:opacity-50" style={{ background: "var(--secondary)", color: "#fff" }}>Schedule</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setAddingComm(true)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80" style={{ background: "#1ed76015", color: "#1ed760", border: "1px solid #1ed76030" }}>
                      + Log Interaction
                    </button>
                    <button onClick={() => setAddingFU(true)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80" style={{ background: "#1a6fe815", color: "#60a5fa", border: "1px solid #1a6fe830" }}>
                      + Schedule Follow-up
                    </button>
                  </div>
                )
              )}

              {/* Log interaction form */}
              {addingComm && (
                <div className="rounded-xl p-4 flex flex-col gap-3" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#1ed760" }}>Log Interaction</p>
                  <div className="flex gap-2">
                    {(["Call", "Meeting", "Email"] as const).map((t) => (
                      <button key={t} onClick={() => setNewCommType(t)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all" style={{ background: newCommType === t ? commColors[t] + "20" : "transparent", color: newCommType === t ? commColors[t] : "var(--muted-foreground)", border: newCommType === t ? `1px solid ${commColors[t]}40` : "1px solid var(--border)" }}>
                        {t}
                      </button>
                    ))}
                  </div>
                  <textarea placeholder="Summarise the interaction…" value={newCommText} onChange={(e) => setNewCommText(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none" style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }} onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")} onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")} />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setAddingComm(false)} className="px-3 py-1.5 text-xs rounded-lg" style={{ color: "var(--muted-foreground)" }}>Cancel</button>
                    <button onClick={addComm} disabled={!newCommText.trim()} className="px-4 py-1.5 text-xs rounded-lg font-semibold disabled:opacity-50" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>Log</button>
                  </div>
                </div>
              )}

              {/* Upcoming follow-ups */}
              {followUps.filter((f) => f.status === "Upcoming").length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#60a5fa" }}>Upcoming Follow-ups</p>
                  <div className="flex flex-col gap-2">
                    {followUps.filter((f) => f.status === "Upcoming").map((f) => (
                      <div key={f.id} className="rounded-xl p-4" style={{ background: "var(--muted)", border: "1px solid #1a6fe830" }}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold">{f.purpose}</p>
                            <p className="text-xs mt-0.5 font-mono" style={{ color: "var(--muted-foreground)" }}>{new Date(f.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                          </div>
                          {canEdit && (
                            <div className="flex gap-1.5 shrink-0">
                              <button onClick={() => updateFUStatus(f.id, "Completed")} className="px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ background: "#1ed76015", color: "#1ed760", border: "1px solid #1ed76030" }}>Done</button>
                              <button onClick={() => updateFUStatus(f.id, "Cancelled")} className="px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ background: "#fc4f3715", color: "#fc4f37", border: "1px solid #fc4f3730" }}>Cancel</button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comm log */}
              {comms.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>Interaction Log</p>
                  <div className="flex flex-col gap-2">
                    {comms.map((c) => (
                      <div key={c.id} className="rounded-xl p-4" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: commColors[c.type] + "20", color: commColors[c.type] }}>{c.type}</span>
                          <span className="text-xs ml-auto" style={{ color: "var(--muted-foreground)" }}>{c.time}</span>
                        </div>
                        <p className="text-sm">{c.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Past follow-ups */}
              {followUps.filter((f) => f.status !== "Upcoming").length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--muted-foreground)" }}>Past Follow-ups</p>
                  <div className="flex flex-col gap-2">
                    {followUps.filter((f) => f.status !== "Upcoming").map((f) => (
                      <div key={f.id} className="rounded-xl p-4" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold">{f.purpose}</p>
                            <p className="text-xs mt-0.5 font-mono" style={{ color: "var(--muted-foreground)" }}>{new Date(f.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0" style={{ background: fuStatusColors[f.status] + "20", color: fuStatusColors[f.status] }}>{f.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {comms.length === 0 && followUps.length === 0 && (
                <p className="text-sm text-center py-12" style={{ color: "var(--muted-foreground)" }}>No activity logged yet.</p>
              )}
            </>
          )}

          {/* ── NOTES ── */}
          {tab === "notes" && (
            <>
              {canEdit && (
                <div className="flex flex-col gap-2">
                  <textarea
                    placeholder="Add an observation or note about this lead…"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={4}
                    className="w-full px-3.5 py-3 rounded-xl text-sm outline-none resize-none leading-relaxed"
                    style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                  />
                  <button onClick={addNote} disabled={!newNote.trim()} className="self-end px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-50" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                    Add Note
                  </button>
                </div>
              )}
              {notes.length === 0 ? (
                <p className="text-sm text-center py-12" style={{ color: "var(--muted-foreground)" }}>No notes yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {notes.map((n) => (
                    <div key={n.id} className="rounded-xl p-4" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                      <p className="text-sm leading-relaxed">{n.text}</p>
                      <p className="text-xs mt-2" style={{ color: "var(--muted-foreground)" }}>{n.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}

function LeadsView({
  leads,
  onNewLead,
  onAssignRep,
  onDeleteLead,
  onConvertLead,
  onRejectLead,
  isSalesRep,
  isSalesManager,
  repName,
  onQualifyLead,
  onSubmitForAssessment,
  onUpdateStatus,
  onContactLead,
  assessments,
}: {
  leads: typeof LEADS;
  onNewLead: () => void;
  onAssignRep: (leadId: number, rep: string) => void;
  onDeleteLead?: (id: number) => void;
  onConvertLead?: (lead: typeof LEADS[number]) => void;
  onRejectLead?: (leadId: number) => void;
  isSalesRep?: boolean;
  isSalesManager?: boolean;
  repName?: string;
  onQualifyLead?: (leadId: number) => void;
  onSubmitForAssessment?: (leadId: number) => void;
  onUpdateStatus?: (leadId: number, status: string) => void;
  onContactLead?: (leadId: number) => void;
  assessments?: AssessmentRecord[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [repFilter, setRepFilter] = useState("All");
  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [detailLead, setDetailLead] = useState<typeof LEADS[number] | null>(null);

  const statuses = ["All", "New", "Contacted", "Qualified", "Assessment", "Closed"];

  function bothAssessmentsDone(leadName: string) {
    if (!assessments) return false;
    const leadAssessments = assessments.filter((a) => a.leadName === leadName);
    const tech = leadAssessments.find((a) => a.type === "Technical");
    const fin = leadAssessments.find((a) => a.type === "Financial");
    return (
      tech && fin &&
      tech.status === "Submitted" &&
      fin.status === "Submitted"
    );
  }

  const visibleLeads = isSalesRep ? leads.filter((l) => l.rep === repName) : leads;
  const filtered = visibleLeads.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.contact.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || l.status === statusFilter;
    const matchRep = repFilter === "All" || l.rep === repFilter;
    return matchSearch && matchStatus && matchRep;
  });

  return (
    <>
    <LeadDetailPanel lead={detailLead} onClose={() => setDetailLead(null)} isSalesRep={isSalesRep} isSalesManager={isSalesManager} onQualifyLead={onQualifyLead} onSubmitForAssessment={onSubmitForAssessment} onContactLead={onContactLead} />
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{isSalesRep ? "My Leads" : "Leads"}</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            {isSalesRep
              ? `${filtered.length} leads assigned to you`
              : `${leads.length} total leads in pipeline`}
          </p>
        </div>
        {isSalesManager && (
          <button
            onClick={onNewLead}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            + New Lead
          </button>
        )}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search by company or contact…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2.5 rounded-lg text-sm outline-none transition-colors"
          style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)", minWidth: 220 }}
        />
        {isSalesManager && (
          <>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: "var(--card)", border: "1px solid var(--border)", color: statusFilter === "All" ? "var(--muted-foreground)" : "var(--foreground)" }}
            >
              {statuses.map((s) => <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>)}
            </select>
            <select
              value={repFilter}
              onChange={(e) => setRepFilter(e.target.value)}
              className="px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: "var(--card)", border: "1px solid var(--border)", color: repFilter === "All" ? "var(--muted-foreground)" : "var(--foreground)" }}
            >
              <option value="All">All Reps</option>
              {SALES_REPS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            {(statusFilter !== "All" || repFilter !== "All") && (
              <button
                onClick={() => { setStatusFilter("All"); setRepFilter("All"); }}
                className="text-xs px-3 py-2.5 rounded-lg font-medium transition-colors hover:opacity-80"
                style={{ background: "var(--muted)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}
              >
                Clear filters
              </button>
            )}
          </>
        )}
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
              {(isSalesRep
                ? ["Company", "Contact", "Value", "Status", "Assigned Rep", "Date"]
                : ["Company", "Contact", "Value", "Status", "Sales Rep", "Date", "Action"]
              ).map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((l, i) => (
              <tr
                key={l.id}
                className="transition-colors hover:bg-[#1ed76008] cursor-pointer"
                style={{
                  background: i % 2 === 0 ? "var(--card)" : "var(--background)",
                  borderBottom: "1px solid var(--border)",
                }}
                onClick={() => setDetailLead(l)}
              >
                <td className="px-5 py-4 font-medium">{l.name}</td>
                <td className="px-5 py-4" style={{ color: "var(--muted-foreground)" }}>{l.contact}</td>
                <td className="px-5 py-4 font-mono font-semibold" style={{ color: "var(--primary)" }}>{l.value}</td>
                <td className="px-5 py-4">
                  {isSalesRep && l.status === "New" && onUpdateStatus ? (
                    <select
                      value={l.status}
                      onChange={(e) => onUpdateStatus(l.id, e.target.value)}
                      className="text-xs px-2 py-1 rounded-lg outline-none"
                      style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                    </select>
                  ) : (
                    <LeadStatusChip status={l.status} />
                  )}
                </td>
                <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                  {isSalesRep ? (
                    <span style={{ color: "var(--muted-foreground)" }}>{l.rep}</span>
                  ) : (
                    <div className="relative">
                      {assigningId === l.id ? (
                        <div className="flex items-center gap-1.5">
                          <select
                            autoFocus
                            defaultValue={l.rep}
                            onChange={(e) => { onAssignRep(l.id, e.target.value); setAssigningId(null); }}
                            onBlur={() => setAssigningId(null)}
                            className="text-xs px-2 py-1.5 rounded-lg outline-none"
                            style={{ background: "var(--muted)", border: "1px solid var(--primary)", color: "var(--foreground)" }}
                          >
                            <option value="">Unassigned</option>
                            {SALES_REPS.map((r) => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAssigningId(l.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors hover:bg-[#34d39920]"
                          style={{
                            color: l.rep ? "#34d399" : "var(--muted-foreground)",
                            border: "1px solid",
                            borderColor: l.rep ? "#34d39940" : "var(--border)",
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: l.rep ? "#34d399" : "var(--border)" }} />
                          {l.rep || "Assign rep"}
                        </button>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-5 py-4 font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>{l.date}</td>
                {!isSalesRep && (
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      {/* Approve to Deal + Reject Lead: only when Assessment status AND both assessments done */}
                      {isSalesManager && l.status === "Assessment" && bothAssessmentsDone(l.name) && (
                        <>
                          {onConvertLead && (
                            <button
                              onClick={() => onConvertLead(l)}
                              className="text-xs px-2.5 py-1 rounded-lg font-medium transition-all hover:opacity-80"
                              style={{ background: "#1ed76015", color: "#1ed760", border: "1px solid #1ed76030" }}
                            >
                              Approve to Deal
                            </button>
                          )}
                          {onRejectLead && (
                            <button
                              onClick={() => onRejectLead(l.id)}
                              className="text-xs px-2.5 py-1 rounded-lg font-medium transition-all hover:opacity-80"
                              style={{ background: "#fc4f3715", color: "#fc4f37", border: "1px solid #fc4f3730" }}
                            >
                              Reject Lead
                            </button>
                          )}
                        </>
                      )}
                      {/* Waiting indicator when in Assessment but not both done yet */}
                      {isSalesManager && l.status === "Assessment" && !bothAssessmentsDone(l.name) && (
                        <span className="text-xs px-2.5 py-1 rounded-lg" style={{ color: "var(--muted-foreground)", border: "1px solid var(--border)" }}>
                          Awaiting
                        </span>
                      )}
                      {isSalesManager && onDeleteLead && (
                        confirmDeleteId === l.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => { onDeleteLead(l.id); setConfirmDeleteId(null); }}
                              className="text-xs px-2 py-1 rounded-lg font-semibold"
                              style={{ background: "#fc4f37", color: "#fff" }}
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-xs px-2 py-1 rounded-lg"
                              style={{ color: "var(--muted-foreground)" }}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(l.id)}
                            className="w-6 h-6 flex items-center justify-center rounded-lg transition-colors hover:bg-[#fc4f3720] hover:text-[#fc4f37]"
                            style={{ color: "var(--muted-foreground)", border: "1px solid var(--border)" }}
                            title="Delete lead"
                          >
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M1.5 2.5h7M4 2.5V2a1 1 0 0 1 2 0v.5M8 2.5l-.5 6a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5L2 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                            </svg>
                          </button>
                        )
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}

function DealsView({
  deals,
  isSalesRep,
}: {
  deals: typeof DEALS;
  isSalesRep?: boolean;
}) {
  const totalValue = deals.reduce((sum, d) => sum + parseInt(d.value.replace(/[$,]/g, "") || "0"), 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{isSalesRep ? "My Deals" : "Deals"}</h2>
        <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          {deals.length} {isSalesRep ? "deals assigned to you" : "closed deals"} · ${(totalValue / 1000).toFixed(0)}K total value
        </p>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
              {["Deal Name", "Client", "Value", "Sales Rep", "Date Closed", "Certificate"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deals.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                  No deals yet. Convert a qualified lead to create one.
                </td>
              </tr>
            ) : deals.map((d, i) => (
              <tr
                key={d.id}
                className="transition-colors hover:bg-[#1ed76008]"
                style={{ background: i % 2 === 0 ? "var(--card)" : "var(--background)", borderBottom: "1px solid var(--border)" }}
              >
                <td className="px-5 py-4 font-semibold">{d.name}</td>
                <td className="px-5 py-4" style={{ color: "var(--muted-foreground)" }}>{d.client}</td>
                <td className="px-5 py-4 font-mono font-bold" style={{ color: "var(--primary)" }}>{d.value}</td>
                <td className="px-5 py-4">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: "#1ed76018", color: "#1ed760" }}>
                    {(d as any).rep || "—"}
                  </span>
                </td>
                <td className="px-5 py-4 font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>{(d as any).date || "—"}</td>
                <td className="px-5 py-4">
                  {(d as any).certificate ? (
                    <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#60a5fa" }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 1.5h5.5L10 4v6.5H2V1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M7 1.5V4h2.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                      {(d as any).certificate}
                    </span>
                  ) : (
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Not uploaded</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProjectsView({
  projects,
  isTechLead,
  onAllocate,
}: {
  projects: typeof PROJECTS;
  isTechLead?: boolean;
  onAllocate?: (project: typeof PROJECTS[number]) => void;
}) {
  const statusColors: Record<string, string> = {
    "In Progress": "#1a6fe8",
    "Planning": "#f59e0b",
    "Completed": "#1ed760",
    "On Hold": "#fc4f37",
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            {projects.filter((p) => p.status !== "Completed").length} active projects
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {projects.map((p) => (
          <div
            key={p.id}
            className="rounded-xl p-5 transition-all hover:scale-[1.01]"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-base">{p.name}</h3>
                <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                  Lead: {p.lead} · {p.team} members
                </p>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium shrink-0"
                style={{
                  background: (statusColors[p.status] ?? "#7a7a90") + "20",
                  color: statusColors[p.status] ?? "#7a7a90",
                }}
              >
                {p.status}
              </span>
            </div>
            <ProgressBar value={p.progress} color={statusColors[p.status] ?? "#7a7a90"} />
            <div className="flex items-center justify-between mt-2.5">
              <span className="text-xs font-semibold" style={{ color: statusColors[p.status] ?? "#7a7a90" }}>
                {p.progress}% complete
              </span>
              <span className="font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>
                Due {p.deadline}
              </span>
            </div>
            {isTechLead && onAllocate && p.status !== "Completed" && (
              <button
                onClick={() => onAllocate(p)}
                className="mt-4 w-full py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
                style={{ background: "#1a6fe815", color: "#60a5fa", border: "1px solid #1a6fe830" }}
              >
                Allocate Resources
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TasksView() {
  const [filter, setFilter] = useState<"All" | "To Do" | "In Progress" | "Done">("All");
  const tabs = ["All", "To Do", "In Progress", "Done"] as const;
  const filtered = filter === "All" ? TASKS : TASKS.filter((t) => t.status === filter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            {TASKS.filter((t) => t.status !== "Done").length} open tasks
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          + New Task
        </button>
      </div>

      <div className="flex gap-1 p-1 rounded-lg w-fit" style={{ background: "var(--muted)" }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
            style={{
              background: filter === t ? "var(--card)" : "transparent",
              color: filter === t ? "var(--foreground)" : "var(--muted-foreground)",
              border: filter === t ? "1px solid var(--border)" : "1px solid transparent",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {filtered.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-4 px-5 py-4 rounded-xl cursor-pointer transition-colors hover:bg-[#1ed76008]"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div
              className="w-4 h-4 rounded-full shrink-0 border-2 flex items-center justify-center"
              style={{
                borderColor: task.status === "Done" ? "var(--primary)" : "var(--border)",
                background: task.status === "Done" ? "var(--primary)" : "transparent",
              }}
            >
              {task.status === "Done" && (
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1 4l2 2 4-4" stroke="var(--primary-foreground)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ textDecoration: task.status === "Done" ? "line-through" : "none", opacity: task.status === "Done" ? 0.5 : 1 }}>
                {task.title}
              </p>
              <p className="text-xs mt-0.5 truncate" style={{ color: "var(--muted-foreground)" }}>
                {task.project}
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <PriorityChip priority={task.priority} />
              <StatusDot status={task.status} />
              <span className="font-mono text-xs w-14 text-right" style={{ color: "var(--muted-foreground)" }}>
                {task.due}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type UserRecord = typeof USERS[number];

function UsersView({
  users,
  onAddUser,
  onRemoveUser,
}: {
  users: UserRecord[];
  onAddUser: () => void;
  onRemoveUser: (id: number) => void;
}) {
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [showCredPw, setShowCredPw] = useState(false);
  const credOverlayRef = useRef<HTMLDivElement>(null);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  function handleRemove(id: number) {
    onRemoveUser(id);
    setConfirmId(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            {users.length} registered users · {users.filter((u) => u.status === "Active").length} active
          </p>
        </div>
        <button
          onClick={onAddUser}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          + Add User
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name, role or email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm px-4 py-2.5 rounded-lg text-sm outline-none"
        style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }}
      />

      <div className="flex flex-col gap-2">
        {filtered.map((u) => (
          <div
            key={u.id}
            className="flex items-center gap-4 px-5 py-4 rounded-xl transition-colors cursor-pointer hover:border-[#ffffff20]"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            onClick={() => { setSelectedUser(u); setShowCredPw(false); }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
              style={{
                background: (ROLE_COLORS[u.role as Role] ?? "#7a7a90") + "20",
                color: ROLE_COLORS[u.role as Role] ?? "#7a7a90",
              }}
            >
              {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{u.name}</p>
              <p className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>{u.email}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex flex-col items-end gap-1">
                <span
                  className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                  style={{
                    background: (ROLE_COLORS[u.role as Role] ?? "#7a7a90") + "20",
                    color: ROLE_COLORS[u.role as Role] ?? "#7a7a90",
                  }}
                >
                  {u.role}
                </span>
                <span className="text-xs" style={{ color: u.status === "Active" ? "#1ed760" : "#7a7a90" }}>
                  ● {u.status}
                </span>
              </div>
              {/* Remove / confirm */}
              {confirmId === u.id ? (
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleRemove(u.id)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors"
                    style={{ background: "#fc4f37", color: "#fff" }}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium transition-colors hover:bg-[#ffffff10]"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmId(u.id); }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-[#fc4f3720] hover:text-[#fc4f37]"
                  style={{ color: "var(--muted-foreground)", border: "1px solid var(--border)" }}
                  title="Remove user"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm py-8 text-center" style={{ color: "var(--muted-foreground)" }}>No users match your search.</p>
        )}
      </div>

      {/* Credentials panel */}
      {selectedUser && (() => {
        const cred = DEMO_CREDENTIALS.find((c) => c.email.toLowerCase() === selectedUser.email.toLowerCase());
        return (
          <div
            ref={credOverlayRef}
            className="fixed inset-0 z-50 flex justify-end"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={(e) => { if (e.target === credOverlayRef.current) setSelectedUser(null); }}
          >
            <div className="w-full max-w-md h-full flex flex-col shadow-2xl" style={{ background: "var(--card)", borderLeft: "1px solid var(--border)" }}>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ background: (ROLE_COLORS[selectedUser.role as Role] ?? "#7a7a90") + "25", color: ROLE_COLORS[selectedUser.role as Role] ?? "#7a7a90" }}>
                    {selectedUser.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-base font-bold tracking-tight">{selectedUser.name}</h2>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{selectedUser.role}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#ffffff10]" style={{ color: "var(--muted-foreground)" }}>✕</button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
                {/* Status */}
                <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                  <span className="text-sm font-medium">Account Status</span>
                  <span className="text-sm font-semibold" style={{ color: selectedUser.status === "Active" ? "#1ed760" : "#7a7a90" }}>
                    ● {selectedUser.status}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                  <span className="text-sm font-medium">Last Login</span>
                  <span className="text-sm font-mono" style={{ color: "var(--muted-foreground)" }}>{selectedUser.lastLogin}</span>
                </div>

                {/* Login credentials */}
                <div className="p-4 rounded-xl flex flex-col gap-4" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--primary)" }}>Login Credentials</p>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--muted-foreground)" }}>Email</p>
                    <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-mono text-sm" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                      {selectedUser.email}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--muted-foreground)" }}>Password</p>
                    {cred ? (
                      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-mono text-sm" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                        <span className="flex-1">{showCredPw ? cred.password : "•".repeat(cred.password.length)}</span>
                        <button
                          onClick={() => setShowCredPw((p) => !p)}
                          className="text-xs shrink-0 transition-opacity hover:opacity-80"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          {showCredPw ? "Hide" : "Show"}
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm px-3.5 py-2.5 rounded-xl" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                        No credentials on record
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ─── New User Panel ───────────────────────────────────────────────────────────

function NewUserPanel({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (u: Omit<UserRecord, "id" | "lastLogin">) => void }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Sales Rep" as Role, status: "Active" });
  const [showPw, setShowPw] = useState(false);
  const [saved, setSaved] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) { setForm({ name: "", email: "", password: "", role: "Sales Rep", status: "Active" }); setSaved(false); setShowPw(false); }
  }, [open]);

  function set<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    onSave({ name: form.name, email: form.email, password: form.password, role: form.role, status: form.status });
    setSaved(true);
    setTimeout(onClose, 1100);
  }

  if (!open) return null;

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all";
  const inputStyle = { background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)" };
  const labelCls = "text-xs font-semibold uppercase tracking-widest block mb-1.5";
  const labelStyle = { color: "var(--muted-foreground)" };

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex justify-end"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
      <div className="w-full max-w-md h-full flex flex-col shadow-2xl"
        style={{ background: "var(--card)", borderLeft: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between px-6 py-5 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Add User</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Create a new account and assign a role</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#ffffff10]" style={{ color: "var(--muted-foreground)" }}>✕</button>
        </div>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          <div className="p-4 rounded-xl flex flex-col gap-4" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--primary)" }}>Identity</p>
            <div>
              <label className={labelCls} style={labelStyle}>Full Name *</label>
              <input required value={form.name} onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Kamal Jayasuriya" className={inputCls} style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")} />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Email Address *</label>
              <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                placeholder="name@altrium.io" className={inputCls} style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")} />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Password *</label>
              <div className="relative">
                <input required type={showPw ? "text" : "password"} value={form.password} onChange={(e) => set("password", e.target.value)}
                  placeholder="Min. 6 characters" className={inputCls} style={{ ...inputStyle, paddingRight: "2.5rem" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")} />
                <button type="button" onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: "var(--muted-foreground)" }}>
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl flex flex-col gap-4" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#a78bfa" }}>Role & Access</p>
            <div>
              <label className={labelCls} style={labelStyle}>Role *</label>
              <div className="flex flex-wrap gap-2">
                {ROLES.map((r) => (
                  <button key={r} type="button" onClick={() => set("role", r)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: form.role === r ? ROLE_COLORS[r] + "25" : "var(--muted)",
                      color: form.role === r ? ROLE_COLORS[r] : "var(--muted-foreground)",
                      border: `1px solid ${form.role === r ? ROLE_COLORS[r] + "50" : "transparent"}`,
                    }}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Status</label>
              <div className="flex gap-2">
                {["Active", "Inactive"].map((s) => (
                  <button key={s} type="button" onClick={() => set("status", s)}
                    className="flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: form.status === s ? (s === "Active" ? "#1ed76025" : "#7a7a9025") : "var(--muted)",
                      color: form.status === s ? (s === "Active" ? "#1ed760" : "#7a7a90") : "var(--muted-foreground)",
                      border: `1px solid ${form.status === s ? (s === "Active" ? "#1ed76040" : "#7a7a9040") : "transparent"}`,
                    }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          {form.name && (
            <div className="p-4 rounded-xl" style={{ background: "#1ed76010", border: "1px solid #1ed76030" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--primary)" }}>Preview</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: ROLE_COLORS[form.role] + "25", color: ROLE_COLORS[form.role] }}>
                  {form.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{form.name}</p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{form.email || "no email yet"}</p>
                </div>
                <span className="ml-auto text-xs px-2.5 py-0.5 rounded-full font-medium"
                  style={{ background: ROLE_COLORS[form.role] + "20", color: ROLE_COLORS[form.role] }}>
                  {form.role}
                </span>
              </div>
            </div>
          )}
        </form>

        <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#ffffff08]" style={{ color: "var(--muted-foreground)" }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saved || !form.name || !form.email || form.password.length < 6}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: saved ? "#1ed76030" : "var(--primary)", color: saved ? "var(--primary)" : "var(--primary-foreground)" }}>
            {saved ? "✓ User Added" : "Add User"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AssessmentsView({
  assessments,
  role,
  leads = [],
  onSubmitAssessment,
}: {
  assessments: AssessmentRecord[];
  role: Role;
  leads?: typeof LEADS;
  onSubmitAssessment: (id: number, notes: string, risk: "Low" | "Medium" | "High", document?: string) => void;
}) {
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [risk, setRisk] = useState<"Low" | "Medium" | "High">("Low");
  const [docName, setDocName] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [logLead, setLogLead] = useState<typeof LEADS[number] | null>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const logOverlayRef = useRef<HTMLDivElement>(null);

  const isTechLead = role === "Tech Lead";
  const isFinance = role === "Finance Officer";
  const isManager = role === "Sales Manager";

  const riskColor: Record<string, string> = { High: "#fc4f37", Medium: "#f59e0b", Low: "#1ed760" };
  const typeColor: Record<string, string> = { Technical: "#1a6fe8", Financial: "#a78bfa" };
  const statusColor: Record<string, string> = {
    Pending: "#f59e0b", "In Review": "#a78bfa", Submitted: "#1a6fe8",
  };

  const visible = assessments.filter((a) => {
    if (isTechLead) return a.type === "Technical";
    if (isFinance) return a.type === "Financial";
    return true;
  });

  const filtered = search.trim()
    ? visible.filter((a) => a.leadName.toLowerCase().includes(search.toLowerCase()) || a.assessor.toLowerCase().includes(search.toLowerCase()))
    : visible;

  const title = isTechLead ? "Technical Assessments" : isFinance ? "Financial Assessments" : "All Assessments";
  const pendingCount = visible.filter((a) => a.status === "Pending" || a.status === "In Review").length;

  const companiesWithAssessments: string[] = isManager
    ? Array.from(new Set(filtered.map((a) => a.leadName)))
    : [];

  function cancelSubmit() {
    setSubmittingId(null);
    setNotes("");
    setDocName(undefined);
  }

  function AssessmentRow({ a }: { a: AssessmentRecord }) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: typeColor[a.type] + "20", color: typeColor[a.type] }}>
              {a.type}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: statusColor[a.status] + "20", color: statusColor[a.status] }}>
              {a.status}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: riskColor[a.risk] }}>
              {a.risk} risk
            </span>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs font-medium">{a.assessor}</p>
            {a.date !== "—" && <p className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>{a.date}</p>}
          </div>
        </div>
        {a.notes && (
          <p className="text-sm px-3 py-2 rounded-lg" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
            {a.notes}
          </p>
        )}
        {/* Document chip for Sales Manager */}
        {isManager && a.document && (
          <div className="flex items-center gap-2 mt-1">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M4 1h5.5L13 4.5V15H4V1z" stroke="#7a7a90" strokeWidth="1.2" strokeLinejoin="round"/>
              <path d="M9 1v4h4" stroke="#7a7a90" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{a.document}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            {pendingCount} pending · {visible.length} total
          </p>
        </div>
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="#7a7a90" strokeWidth="1.5"/>
            <path d="M11 11l3 3" stroke="#7a7a90" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by company or assessor…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-lg text-sm outline-none w-64"
            style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs"
              style={{ color: "var(--muted-foreground)" }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Sales Manager: merged view per company */}
        {isManager && companiesWithAssessments.map((company) => {
          const companyAssessments = filtered.filter((a) => a.leadName === company);
          const tech = companyAssessments.find((a) => a.type === "Technical");
          const fin = companyAssessments.find((a) => a.type === "Financial");
          const techDone = tech?.status === "Submitted";
          const finDone = fin?.status === "Submitted";
          const bothDone = techDone && finDone;
          const anySubmitted = companyAssessments.some((a) => a.status === "Submitted");

          // Pending labels
          const pendingLabels: string[] = [];
          if (!techDone) pendingLabels.push("Technical assessment pending");
          if (!finDone) pendingLabels.push("Financial assessment pending");

          return (
            <div
              key={company}
              className="rounded-xl p-5"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
                <div>
                  <h3 className="font-semibold text-base">{company}</h3>
                  {pendingLabels.length > 0 && !bothDone && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {pendingLabels.map((lbl) => (
                        <span key={lbl} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#f59e0b15", color: "#f59e0b", border: "1px solid #f59e0b30" }}>
                          {lbl}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {bothDone && (
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: "#1ed76015", color: "#1ed760", border: "1px solid #1ed76030" }}>
                      Both Complete
                    </span>
                  )}
                  {anySubmitted && (
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: "#1a6fe815", color: "#60a5fa", border: "1px solid #1a6fe830" }}>
                      Review Needed
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {tech && (
                  <div className="rounded-lg p-4" style={{ background: "#1a6fe808", border: "1px solid #1a6fe820" }}>
                    <AssessmentRow a={tech} />
                  </div>
                )}
                {fin && (
                  <div className="rounded-lg p-4" style={{ background: "#a78bfa08", border: "1px solid #a78bfa20" }}>
                    <AssessmentRow a={fin} />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Tech Lead / Finance Officer: individual cards with doc upload */}
        {!isManager && filtered.map((a) => {
          const cardLead = leads?.find((l) => l.name === a.leadName) ?? null;
          return (
          <div
            key={a.id}
            className="rounded-xl p-5"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <button
                  onClick={() => cardLead && setLogLead(cardLead)}
                  className="font-semibold text-base text-left hover:underline underline-offset-2 transition-all"
                  style={{ color: "var(--foreground)" }}
                  title="View interaction log"
                >{a.leadName}</button>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: typeColor[a.type] + "20", color: typeColor[a.type] }}>
                    {a.type}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: statusColor[a.status] + "20", color: statusColor[a.status] }}>
                    {a.status}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: riskColor[a.risk] }}>
                    {a.risk} risk
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Assessor</p>
                <p className="text-sm font-medium">{a.assessor}</p>
                {a.date !== "—" && <p className="text-xs font-mono mt-0.5" style={{ color: "var(--muted-foreground)" }}>{a.date}</p>}
              </div>
            </div>

            {a.notes && (
              <p className="text-sm px-4 py-3 rounded-lg mb-3" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                {a.notes}
              </p>
            )}
            {a.document && (
              <div className="flex items-center gap-2 mb-3 px-1">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path d="M4 1h5.5L13 4.5V15H4V1z" stroke="#7a7a90" strokeWidth="1.2" strokeLinejoin="round"/>
                  <path d="M9 1v4h4" stroke="#7a7a90" strokeWidth="1.2" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{a.document}</span>
              </div>
            )}

            {(isTechLead || isFinance) && (a.status === "Pending" || a.status === "In Review") && (
              submittingId === a.id ? (
                <div className="flex flex-col gap-3 mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                  <textarea
                    placeholder="Add assessment notes…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg text-sm outline-none resize-none"
                    style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                  />
                  {/* Document upload */}
                  <input
                    ref={docInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                    className="hidden"
                    onChange={(e) => setDocName(e.target.files?.[0]?.name)}
                  />
                  <button
                    onClick={() => docInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-fit transition-opacity hover:opacity-80"
                    style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M4 1h5.5L13 4.5V15H4V1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                      <path d="M9 1v4h4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                      <path d="M8 7v4M6 9l2-2 2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {docName ? docName : "Attach document (optional)"}
                    {docName && (
                      <span
                        onClick={(e) => { e.stopPropagation(); setDocName(undefined); }}
                        className="ml-1 opacity-60 hover:opacity-100"
                      >✕</span>
                    )}
                  </button>
                  <div className="flex items-center gap-3">
                    <select
                      value={risk}
                      onChange={(e) => setRisk(e.target.value as "Low" | "Medium" | "High")}
                      className="px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                    >
                      <option value="Low">Low Risk</option>
                      <option value="Medium">Medium Risk</option>
                      <option value="High">High Risk</option>
                    </select>
                    <div className="flex gap-2 ml-auto">
                      <button onClick={cancelSubmit} className="px-4 py-2 rounded-lg text-sm" style={{ color: "var(--muted-foreground)" }}>
                        Cancel
                      </button>
                      <button
                        onClick={() => { onSubmitAssessment(a.id, notes, risk, docName); cancelSubmit(); }}
                        disabled={!notes.trim()}
                        className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                        style={{ background: "var(--secondary)", color: "#fff" }}
                      >
                        Submit Assessment
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setSubmittingId(a.id); setNotes(a.notes); setRisk(a.risk); setDocName(undefined); }}
                  className="mt-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{ background: "#1a6fe815", color: "#60a5fa", border: "1px solid #1a6fe830" }}
                >
                  {a.status === "In Review" ? "Continue Assessment" : "Start Assessment"}
                </button>
              )
            )}
          </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-16 text-center" style={{ color: "var(--muted-foreground)" }}>
            {search ? (
              <>
                <p className="text-lg mb-1">No results for "{search}"</p>
                <p className="text-sm">Try a different company or assessor name.</p>
              </>
            ) : (
              <>
                <p className="text-lg mb-1">No assessments</p>
                <p className="text-sm">Assessments will appear here when leads are submitted.</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Interaction Log Panel */}
      {logLead && (
        <div
          ref={logOverlayRef}
          className="fixed inset-0 z-50 flex justify-end"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === logOverlayRef.current) setLogLead(null); }}
        >
          <div className="w-full max-w-md h-full flex flex-col shadow-2xl" style={{ background: "var(--card)", borderLeft: "1px solid var(--border)" }}>
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
              <div>
                <h2 className="text-lg font-bold tracking-tight">{logLead.name}</h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  {logLead.industry} · {logLead.source}
                </p>
              </div>
              <button onClick={() => setLogLead(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#ffffff10]" style={{ color: "var(--muted-foreground)" }}>✕</button>
            </div>

            {/* Lead value — shown for Finance Officer */}
            {isFinance && (
              <div className="mx-6 mt-5 px-4 py-3 rounded-xl flex items-center justify-between" style={{ background: "#a78bfa12", border: "1px solid #a78bfa30" }}>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: "#a78bfa" }}>Lead Value</p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Original negotiated value</p>
                </div>
                <span className="text-xl font-bold font-mono" style={{ color: "var(--foreground)" }}>{logLead.value}</span>
              </div>
            )}

            {/* Contact quick-ref */}
            <div className="mx-6 mt-4 px-4 py-3 rounded-xl" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--muted-foreground)" }}>Contact</p>
              <p className="text-sm font-medium">{logLead.contact}</p>
              <p className="text-xs mt-0.5 font-mono" style={{ color: "var(--muted-foreground)" }}>{logLead.email} · {logLead.phone}</p>
            </div>

            {/* Interaction log */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--muted-foreground)" }}>Interaction Log</p>
              {(() => {
                const comms = leadCommsMap[logLead.id] ?? [];
                const typeIcon: Record<string, string> = { Call: "📞", Meeting: "🤝", Email: "✉️" };
                const typeColor: Record<string, string> = { Call: "#1ed760", Meeting: "#1a6fe8", Email: "#a78bfa" };
                if (comms.length === 0) {
                  return (
                    <div className="py-10 text-center" style={{ color: "var(--muted-foreground)" }}>
                      <p className="text-sm">No interactions logged yet.</p>
                      <p className="text-xs mt-1">The Sales Rep will log calls, meetings and emails here.</p>
                    </div>
                  );
                }
                return (
                  <div className="flex flex-col gap-3">
                    {comms.map((c) => (
                      <div key={c.id} className="flex gap-3 items-start p-3 rounded-xl" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0" style={{ background: typeColor[c.type] + "20" }}>
                          {typeIcon[c.type]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-semibold" style={{ color: typeColor[c.type] }}>{c.type}</span>
                            <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>{c.time}</span>
                          </div>
                          <p className="text-sm leading-snug">{c.summary}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function availabilityColor(pct: number): string {
  if (pct >= 75) return "#1ed760";
  if (pct >= 50) return "#f59e0b";
  if (pct >= 25) return "#fc8c37";
  return "#fc4f37";
}

function ResourcesView({ resources }: { resources: ResourceRecord[] }) {
  const techResources = resources.filter((r) => TECH_ROLES.includes(r.role));
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Resources</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            {techResources.length} technical team members
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs" style={{ color: "var(--muted-foreground)" }}>
          {[{ label: "≥75%", color: "#1ed760" }, { label: "50–74%", color: "#f59e0b" }, { label: "25–49%", color: "#fc8c37" }, { label: "<25%", color: "#fc4f37" }].map((l) => (
            <span key={l.label} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {techResources.map((r) => {
          const pct = parseInt(r.availability);
          const avColor = availabilityColor(pct);
          return (
            <div
              key={r.id}
              className="flex items-center gap-5 px-5 py-4 rounded-xl"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                style={{
                  background: (ROLE_COLORS[r.role as Role] ?? "#7a7a90") + "20",
                  color: ROLE_COLORS[r.role as Role] ?? "#7a7a90",
                }}
              >
                {r.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{r.name}</p>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{r.role}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 flex-1">
                {r.skills.map((s) => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-md" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0 w-28">
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Availability</span>
                  <span className="text-xs font-semibold" style={{ color: avColor }}>{r.availability}</span>
                </div>
                <ProgressBar value={pct} color={avColor} />
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  {r.project !== "—" ? `On: ${r.project}` : "Available"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Login Page ──────────────────────────────────────────────────────────────

let DEMO_CREDENTIALS: { email: string; password: string; role: Role; name: string }[] = [
  { email: "yaqoob.s@altrium.io",   password: "Sales@123",   role: "Sales Manager",  name: "Yaqoob Sadikeen" },
  { email: "ishara.f@altrium.io",   password: "Rep@123",     role: "Sales Rep",      name: "Ishara Fonseka" },
  { email: "ravidu.p@altrium.io",   password: "Tech@123",    role: "Tech Lead",      name: "Ravidu Pasan" },
  { email: "hashmath.f@altrium.io", password: "Finance@123", role: "Finance Officer", name: "Hashmath Fazli" },
  { email: "natalia.d@altrium.io",  password: "Admin@123",   role: "Admin",          name: "Natalia Dilshani" },
];

function ForgotPasswordPage({ onBack }: { onBack: () => void }) {
  const [fpEmail, setFpEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setSent(true); setLoading(false); }, 900);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: "var(--background)" }}>
      <div
        className="w-full max-w-sm rounded-2xl p-8 flex flex-col gap-6"
        style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">Forgot Password</h2>
          {!sent && (
            <p className="text-sm mt-2" style={{ color: "var(--muted-foreground)" }}>
              Enter your email address and we will send you a link to reset your password.
            </p>
          )}
        </div>

        {sent ? (
          <>
            <div
              className="px-4 py-4 rounded-xl text-sm text-center leading-relaxed"
              style={{ background: "#1ed76018", color: "#1ed760", border: "1px solid #1ed76030" }}
            >
              If an account with that email exists, we have sent a password reset link. Please check your inbox.
            </div>
            <button
              onClick={onBack}
              className="text-sm text-center font-medium hover:underline transition-all"
              style={{ color: "var(--secondary)" }}
            >
              Return to login
            </button>
          </>
        ) : (
          <form onSubmit={handleSend} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
                Email Address
              </label>
              <input
                type="email"
                value={fpEmail}
                onChange={(e) => setFpEmail(e.target.value)}
                placeholder="you@altrium.io"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--secondary)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !fpEmail}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: "var(--secondary)", color: "#ffffff" }}
            >
              {loading ? "Sending…" : "Send Reset Link"}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-center font-medium hover:underline transition-all"
              style={{ color: "var(--secondary)" }}
            >
              Back to login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function LoginPage({ onLogin }: { onLogin: (role: Role, name: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  if (showForgot) return <ForgotPasswordPage onBack={() => setShowForgot(false)} />;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const match = DEMO_CREDENTIALS.find(
        (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
      );
      if (match) {
        onLogin(match.role, match.name);
      } else {
        setError("Invalid email or password. Try one of the demo accounts below.");
        setLoading(false);
      }
    }, 600);
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "var(--background)" }}
    >
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-12"
        style={{ background: "var(--card)", borderRight: "1px solid var(--border)" }}
      >
        <div>
          <div className="mb-16">
            <img src={altriumLogo} alt="Altrium" className="h-8 object-contain" style={{ display: "block", filter: "invert(1) hue-rotate(180deg)" }} />
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight mb-4">
            Your leads.<br />
            Your team.<br />
            <span style={{ color: "var(--primary)" }}>One place.</span>
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            Manage leads, track deals through technical and financial assessments, coordinate project delivery, and monitor your pipeline — all from a single platform built for the way your team actually works.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="flex flex-col gap-4">
          {[
            { icon: "◎", label: "Lead & Deal Pipeline", desc: "From first contact to signed deal" },
            { icon: "◉", label: "Technical & Financial Assessments", desc: "Structured review workflows" },
          ].map((f) => (
            <div key={f.label} className="flex items-start gap-3">
              <span className="text-base mt-0.5" style={{ color: "var(--primary)" }}>{f.icon}</span>
              <div>
                <p className="text-sm font-semibold">{f.label}</p>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          © 2026 Altrium. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-10 lg:hidden">
            <img src={altriumLogo} alt="Altrium" className="h-7 object-contain" style={{ display: "block", filter: "invert(1) hue-rotate(180deg)" }} />
          </div>

          <h2 className="text-2xl font-bold tracking-tight mb-1">Welcome back</h2>
          <p className="text-sm mb-8" style={{ color: "var(--muted-foreground)" }}>
            Sign in to your account to continue.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
                Email address
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@nexcrm.io"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
                  Password
                </label>
                <button type="button" onClick={() => setShowForgot(true)} className="text-xs hover:underline" style={{ color: "var(--primary)" }}>
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors hover:bg-[#ffffff10]"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.3" />
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.3" />
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="px-4 py-3 rounded-lg text-sm"
                style={{ background: "#fc4f3718", color: "#fc4f37", border: "1px solid #fc4f3730" }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] mt-2"
              style={{
                background: loading ? "var(--muted)" : "var(--primary)",
                color: loading ? "var(--muted-foreground)" : "var(--primary-foreground)",
              }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-8">
            <button
              onClick={() => setHintOpen(!hintOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-colors hover:bg-[#ffffff08]"
              style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
            >
              <span>Demo credentials</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: hintOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {hintOpen && (
              <div
                className="mt-2 rounded-xl overflow-hidden"
                style={{ border: "1px solid var(--border)", background: "var(--card)" }}
              >
                <div className="px-4 py-2.5" style={{ borderBottom: "1px solid var(--border)", background: "var(--muted)" }}>
                  <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
                    Click a row to auto-fill
                  </p>
                </div>
                {DEMO_CREDENTIALS.map((c) => (
                  <button
                    key={c.email}
                    type="button"
                    onClick={() => { setEmail(c.email); setPassword(c.password); setError(""); }}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-[#ffffff08] transition-colors"
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <div>
                      <p className="text-xs font-medium">{c.name}</p>
                      <p className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>{c.email}</p>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: ROLE_COLORS[c.role] + "20", color: ROLE_COLORS[c.role] }}
                    >
                      {c.role}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── New Lead Slide-over ──────────────────────────────────────────────────────

type NewLeadData = {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  jobTitle: string;
  dealValue: string;
  currency: string;
  source: string;
  industry: string;
  assignedTo: string;
  priority: string;
  notes: string;
};

const EMPTY_LEAD: NewLeadData = {
  companyName: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  jobTitle: "",
  dealValue: "",
  currency: "USD",
  source: "",
  industry: "",
  assignedTo: "",
  priority: "Medium",
  notes: "",
};

function NewLeadPanel({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (lead: NewLeadData) => void;
}) {
  const [form, setForm] = useState<NewLeadData>(EMPTY_LEAD);
  const [step, setStep] = useState<1 | 2>(1);
  const [saved, setSaved] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) { setForm(EMPTY_LEAD); setStep(1); setSaved(false); }
  }, [open]);

  function set(field: keyof NewLeadData, val: string) {
    setForm((f) => ({ ...f, [field]: val }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
    setSaved(true);
    setTimeout(onClose, 1200);
  }

  if (!open) return null;

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all";
  const inputStyle = {
    background: "var(--muted)",
    border: "1px solid var(--border)",
    color: "var(--foreground)",
  };
  const labelCls = "text-xs font-semibold uppercase tracking-widest block mb-1.5";
  const labelStyle = { color: "var(--muted-foreground)" };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex justify-end"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className="w-full max-w-lg h-full flex flex-col shadow-2xl overflow-hidden"
        style={{ background: "var(--card)", borderLeft: "1px solid var(--border)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <h2 className="text-lg font-bold tracking-tight">New Lead</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              Step {step} of 2 — {step === 1 ? "Company & Contact" : "Deal Details"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[#ffffff10]"
            style={{ color: "var(--muted-foreground)" }}
          >
            ✕
          </button>
        </div>

        {/* Step tabs */}
        <div className="flex px-6 pt-4 gap-2 shrink-0">
          {([1, 2] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: step === s ? "var(--primary)" : "var(--muted)",
                color: step === s ? "var(--primary-foreground)" : "var(--muted-foreground)",
              }}
            >
              {s === 1 ? "Company & Contact" : "Deal Details"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-6 py-5">
          {step === 1 ? (
            <div className="flex flex-col gap-5">
              {/* Company */}
              <div
                className="p-4 rounded-xl"
                style={{ background: "var(--background)", border: "1px solid var(--border)" }}
              >
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--primary)" }}>
                  Company
                </p>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className={labelCls} style={labelStyle}>Company Name *</label>
                    <input
                      required
                      value={form.companyName}
                      onChange={(e) => set("companyName", e.target.value)}
                      placeholder="e.g. Meridian Holdings"
                      className={inputCls}
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls} style={labelStyle}>Industry</label>
                      <select
                        value={form.industry}
                        onChange={(e) => set("industry", e.target.value)}
                        className={inputCls}
                        style={{ ...inputStyle, appearance: "none" }}
                      >
                        <option value="">Select…</option>
                        {["Technology", "Finance", "Healthcare", "Retail", "Energy", "Manufacturing", "Logistics", "Education", "Other"].map((i) => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls} style={labelStyle}>Lead Source</label>
                      <select
                        value={form.source}
                        onChange={(e) => set("source", e.target.value)}
                        className={inputCls}
                        style={{ ...inputStyle, appearance: "none" }}
                      >
                        <option value="">Select…</option>
                        {["Website", "Referral", "Cold Outreach", "LinkedIn", "Event", "Partner", "Other"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div
                className="p-4 rounded-xl"
                style={{ background: "var(--background)", border: "1px solid var(--border)" }}
              >
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#1a6fe8" }}>
                  Primary Contact
                </p>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls} style={labelStyle}>Full Name *</label>
                      <input
                        required
                        value={form.contactName}
                        onChange={(e) => set("contactName", e.target.value)}
                        placeholder="e.g. Hashmath Fazli"
                        className={inputCls}
                        style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                      />
                    </div>
                    <div>
                      <label className={labelCls} style={labelStyle}>Job Title</label>
                      <input
                        value={form.jobTitle}
                        onChange={(e) => set("jobTitle", e.target.value)}
                        placeholder="e.g. CTO"
                        className={inputCls}
                        style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls} style={labelStyle}>Email Address *</label>
                    <input
                      required
                      type="email"
                      value={form.contactEmail}
                      onChange={(e) => set("contactEmail", e.target.value)}
                      placeholder="contact@company.com"
                      className={inputCls}
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                  </div>
                  <div>
                    <label className={labelCls} style={labelStyle}>Phone Number</label>
                    <input
                      type="tel"
                      value={form.contactPhone}
                      onChange={(e) => set("contactPhone", e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className={inputCls}
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {/* Deal value */}
              <div
                className="p-4 rounded-xl"
                style={{ background: "var(--background)", border: "1px solid var(--border)" }}
              >
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#a78bfa" }}>
                  Deal Value
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className={labelCls} style={labelStyle}>Estimated Value *</label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={form.dealValue}
                      onChange={(e) => set("dealValue", e.target.value)}
                      placeholder="125000"
                      className={inputCls}
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                  </div>
                  <div>
                    <label className={labelCls} style={labelStyle}>Currency</label>
                    <select
                      value={form.currency}
                      onChange={(e) => set("currency", e.target.value)}
                      className={inputCls}
                      style={{ ...inputStyle, appearance: "none" }}
                    >
                      {["USD", "LKR", "EUR", "GBP", "AED", "INR", "SGD"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Assignment */}
              <div
                className="p-4 rounded-xl"
                style={{ background: "var(--background)", border: "1px solid var(--border)" }}
              >
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#f59e0b" }}>
                  Assignment & Priority
                </p>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className={labelCls} style={labelStyle}>Assign to Sales Rep</label>
                    <select
                      value={form.assignedTo}
                      onChange={(e) => set("assignedTo", e.target.value)}
                      className={inputCls}
                      style={{ ...inputStyle, appearance: "none" }}
                    >
                      <option value="">Unassigned</option>
                      {SALES_REPS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls} style={labelStyle}>Priority</label>
                    <div className="flex gap-2">
                      {["Low", "Medium", "High"].map((p) => {
                        const colors: Record<string, string> = { Low: "#7a7a90", Medium: "#f59e0b", High: "#fc4f37" };
                        const active = form.priority === p;
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => set("priority", p)}
                            className="flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all"
                            style={{
                              background: active ? colors[p] + "25" : "var(--muted)",
                              color: active ? colors[p] : "var(--muted-foreground)",
                              border: `1px solid ${active ? colors[p] + "50" : "transparent"}`,
                            }}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div
                className="p-4 rounded-xl"
                style={{ background: "var(--background)", border: "1px solid var(--border)" }}
              >
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--muted-foreground)" }}>
                  Notes
                </p>
                <textarea
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Add any relevant context about this lead — pain points, timeline, decision makers…"
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all resize-none"
                  style={{
                    ...inputStyle,
                    lineHeight: "1.6",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                />
              </div>

              {/* Preview card */}
              {(form.companyName || form.dealValue) && (
                <div
                  className="p-4 rounded-xl"
                  style={{ background: "#1ed76010", border: "1px solid #1ed76030" }}
                >
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--primary)" }}>
                    Preview
                  </p>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm">{form.companyName || "—"}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                        {form.contactName || "No contact"} {form.jobTitle ? `· ${form.jobTitle}` : ""}
                      </p>
                    </div>
                    {form.dealValue && (
                      <span className="font-mono font-bold text-sm" style={{ color: "var(--primary)" }}>
                        {form.currency} {parseInt(form.dealValue).toLocaleString()}
                      </span>
                    )}
                  </div>
                  {form.priority && (
                    <div className="mt-2.5 flex gap-2">
                      <LeadStatusChip status="New" />
                      <span
                        className="text-xs px-2.5 py-0.5 rounded-full border font-medium"
                        style={{
                          background: form.priority === "High" ? "#fc4f3720" : form.priority === "Medium" ? "#f59e0b20" : "#7a7a9020",
                          color: form.priority === "High" ? "#fc4f37" : form.priority === "Medium" ? "#f59e0b" : "#7a7a90",
                          borderColor: form.priority === "High" ? "#fc4f3730" : form.priority === "Medium" ? "#f59e0b30" : "#7a7a9030",
                        }}
                      >
                        {form.priority} Priority
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </form>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {step === 1 ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#ffffff08]"
                style={{ color: "var(--muted-foreground)" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!form.companyName || !form.contactName || !form.contactEmail}
                className="px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                Next — Deal Details →
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#ffffff08]"
                style={{ color: "var(--muted-foreground)" }}
              >
                ← Back
              </button>
              <button
                onClick={handleSave}
                disabled={saved || !form.dealValue}
                className="px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60"
                style={{
                  background: saved ? "#1ed76030" : "var(--primary)",
                  color: saved ? "var(--primary)" : "var(--primary-foreground)",
                }}
              >
                {saved ? "✓ Lead Created" : "Create Lead"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Convert Lead → Deal Panel ───────────────────────────────────────────────

function ConvertLeadPanel({
  lead,
  onClose,
  onConfirm,
}: {
  lead: typeof LEADS[number] | null;
  onClose: () => void;
  onConfirm: (deal: typeof DEALS[number]) => void;
}) {
  const [dealName, setDealName] = useState("");
  const [certName, setCertName] = useState("");
  const [saved, setSaved] = useState(false);
  const [dealCurrency, setDealCurrency] = useState("USD");
  const [dealAmount, setDealAmount] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (lead) {
      setDealName(`${lead.name} — Deal`);
      setCertName("");
      setSaved(false);
      // Parse existing value e.g. "$124,000" or "LKR 500,000"
      const raw = lead.value ?? "";
      const currencySymbols: Record<string, string> = { "$": "USD", "€": "EUR", "£": "GBP" };
      const symMatch = raw.match(/^([$€£])/);
      if (symMatch) {
        setDealCurrency(currencySymbols[symMatch[1]] ?? "USD");
        setDealAmount(raw.replace(/[$€£,]/g, "").trim());
      } else {
        const codeMatch = raw.match(/^([A-Z]{2,3})\s*/);
        setDealCurrency(codeMatch ? codeMatch[1] : "USD");
        setDealAmount(raw.replace(/^[A-Z]{2,3}\s*/, "").replace(/,/g, "").trim());
      }
    }
  }, [lead]);

  if (!lead) return null;

  function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!lead) return;
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const symMap: Record<string, string> = { USD: "$", EUR: "€", GBP: "£" };
    const prefix = symMap[dealCurrency] ?? dealCurrency + " ";
    const formattedValue = (symMap[dealCurrency] ? prefix : prefix) +
      (parseFloat(dealAmount.replace(/,/g, "")) || 0).toLocaleString();
    onConfirm({
      id: Date.now(),
      name: dealName,
      client: lead.name,
      value: formattedValue,
      rep: lead.rep || "—",
      date: today,
      ...(certName ? { certificate: certName } : {}),
    } as any);
    setSaved(true);
    setTimeout(onClose, 1100);
  }

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all";
  const inputStyle = { background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)" };

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex justify-end"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
      <div className="w-full max-w-md h-full flex flex-col shadow-2xl"
        style={{ background: "var(--card)", borderLeft: "1px solid var(--border)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Convert to Deal</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              Creates a deal record from <strong>{lead.name}</strong>
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#ffffff10]" style={{ color: "var(--muted-foreground)" }}>✕</button>
        </div>

        <form onSubmit={handleConfirm} className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

          {/* Lead summary */}
          <div className="p-4 rounded-xl" style={{ background: "#1a6fe812", border: "1px solid #1a6fe830" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#60a5fa" }}>From Lead</p>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-sm">{lead.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Contact: {lead.contact}</p>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Rep: {lead.rep || "Unassigned"}</p>
              </div>
              <span className="font-mono font-bold text-sm" style={{ color: "var(--primary)" }}>{lead.value}</span>
            </div>
          </div>

          {/* Deal details */}
          <div className="p-4 rounded-xl flex flex-col gap-4" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--primary)" }}>Deal Details</p>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest block mb-1.5" style={{ color: "var(--muted-foreground)" }}>Deal Name *</label>
              <input required value={dealName} onChange={(e) => setDealName(e.target.value)} className={inputCls} style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")} />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest block mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                Confirmed Value *
                <span className="ml-2 normal-case font-normal tracking-normal" style={{ color: "var(--muted-foreground)" }}>
                  — pre-filled from lead, adjust if negotiated
                </span>
              </label>
              <div className="flex gap-2">
                <select
                  value={dealCurrency}
                  onChange={(e) => setDealCurrency(e.target.value)}
                  className="px-3 py-2.5 rounded-xl text-sm outline-none shrink-0"
                  style={{ ...inputStyle, width: "96px" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                >
                  {["USD", "LKR", "EUR", "GBP", "AED", "INR", "SGD"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  required
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={dealAmount}
                  onChange={(e) => setDealAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                  className={`${inputCls} flex-1`}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                />
              </div>
              {lead.value && dealAmount && dealAmount !== lead.value.replace(/[$€£,A-Z\s]/g, "") && (
                <p className="text-xs mt-1.5" style={{ color: "#f59e0b" }}>
                  Changed from original lead value: {lead.value}
                </p>
              )}
            </div>
          </div>

          {/* Certificate upload (optional) */}
          <div className="p-4 rounded-xl flex flex-col gap-3" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Deal Certificate</p>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>Optional</span>
            </div>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              Upload a signed deal certificate or agreement document.
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) setCertName(f.name); }}
            />
            {certName ? (
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg" style={{ background: "var(--muted)", border: "1px solid #1a6fe840" }}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: "#60a5fa", flexShrink: 0 }}>
                    <path d="M2 1.5h6.5L12 5v7.5H2V1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                    <path d="M8 1.5V5h4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-xs truncate font-medium" style={{ color: "#60a5fa" }}>{certName}</span>
                </div>
                <button type="button" onClick={() => { setCertName(""); if (fileRef.current) fileRef.current.value = ""; }}
                  className="text-xs shrink-0 ml-2" style={{ color: "var(--muted-foreground)" }}>✕</button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()}
                className="flex items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed transition-colors hover:border-[#1a6fe860]"
                style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span className="text-sm font-medium">Click to upload</span>
                <span className="text-xs">PDF, DOC, PNG, JPG</span>
              </button>
            )}
          </div>
        </form>

        <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#ffffff08]" style={{ color: "var(--muted-foreground)" }}>
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={saved || !dealName || !dealAmount}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: saved ? "#1ed76030" : "var(--primary)", color: saved ? "var(--primary)" : "var(--primary-foreground)" }}>
            {saved ? "✓ Deal Created" : "Convert to Deal →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Allocate Resources Panel (Tech Lead) ────────────────────────────────────

const TECH_ROLES = ["Tech Lead", "Senior Engineer", "Full-Stack Dev", "Frontend Dev", "Backend Dev", "QA Engineer", "DevOps Engineer", "Data Engineer", "Mobile Dev", "Team Member"];

type ResourceRecord = typeof RESOURCES[number];

function AllocateResourcesPanel({
  project,
  resources,
  onClose,
  onSave,
}: {
  project: typeof PROJECTS[number] | null;
  resources: ResourceRecord[];
  onClose: () => void;
  onSave: (projectId: number, allocated: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (project) {
      setSelected([]);
      setSaved(false);
    }
  }, [project]);

  if (!project) return null;

  function toggle(name: string) {
    setSelected((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]);
  }

  function handleSave() {
    if (!project) return;
    onSave(project.id, selected);
    setSaved(true);
    setTimeout(onClose, 1000);
  }

  const shortName = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1 ? parts[0] + " " + parts[1][0] + "." : name;
  };

  const eligible = resources.filter((r) => TECH_ROLES.includes(r.role));
  const alreadyOnProject = eligible.filter((r) => r.project === project.name);
  const available = eligible.filter((r) => r.project !== project.name && parseInt(r.availability) > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="ml-auto h-full w-full max-w-md flex flex-col"
        style={{ background: "var(--card)", borderLeft: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Allocate Resources</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{project.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#ffffff10] transition-colors" style={{ color: "var(--muted-foreground)" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="px-6 py-4 flex-1 overflow-y-auto flex flex-col gap-4">
          {/* Already allocated */}
          {alreadyOnProject.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--muted-foreground)" }}>
                Already on this project ({alreadyOnProject.length})
              </p>
              <div className="flex flex-col gap-2">
                {alreadyOnProject.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl opacity-60"
                    style={{ background: "var(--muted)", border: "1px solid var(--border)" }}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "#1ed76020", color: "#1ed760" }}>
                      {r.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{r.name}</p>
                      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{r.role}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#1ed76015", color: "#1ed760" }}>Assigned</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available to add */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--muted-foreground)" }}>
              Available to allocate ({available.length})
            </p>
            {available.length === 0 && (
              <p className="text-sm py-4 text-center" style={{ color: "var(--muted-foreground)" }}>No available members right now.</p>
            )}
            <div className="flex flex-col gap-2">
              {available.map((r) => {
                const isSelected = selected.includes(r.name);
                const pct = parseInt(r.availability);
                const avColor = availabilityColor(pct);
                return (
                  <button
                    key={r.id}
                    onClick={() => toggle(r.name)}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left w-full"
                    style={{
                      background: isSelected ? "#1a6fe815" : "var(--muted)",
                      border: isSelected ? "1px solid #1a6fe840" : "1px solid var(--border)",
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: isSelected ? "#1a6fe830" : "var(--border)", color: isSelected ? "#60a5fa" : "var(--muted-foreground)" }}
                    >
                      {r.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{shortName(r.name)}</p>
                      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{r.role}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {r.skills.slice(0, 3).map((s) => (
                          <span key={s} className="text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--card)", color: "var(--muted-foreground)" }}>{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span className="text-xs font-semibold" style={{ color: avColor }}>{r.availability}</span>
                      <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>free</span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: "#1a6fe8", color: "#fff" }}>✓</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 shrink-0 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)" }}>
          <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            {selected.length} member{selected.length !== 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#ffffff08]" style={{ color: "var(--muted-foreground)" }}>
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saved || selected.length === 0}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: saved ? "#1a6fe830" : "#1a6fe8", color: "#ffffff" }}
            >
              {saved ? "✓ Allocated" : "Confirm Allocation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  // ── all hooks unconditionally, in stable order ─────────────────────────────
  const [authed, setAuthed] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [activityLog, setActivityLog] = useState<{ time: string; event: string; type: string }[]>([
    { time: "2h ago",     event: "Lead qualified — Orbit Retail Ltd",             type: "lead" },
    { time: "4h ago",     event: "Deal moved to Negotiation — NexGen Pharma",     type: "deal" },
    { time: "Yesterday",  event: "Technical assessment submitted — Meridian ERP", type: "assess" },
    { time: "Yesterday",  event: "New user onboarded — Senula Silva",             type: "user" },
    { time: "Aug 17",     event: "Project created — CloudBridge Migration",       type: "project" },
    { time: "Aug 16",     event: "Deal closed won — Apex DevOps Pipeline",        type: "deal" },
  ]);
  const [userName, setUserName] = useState("Yaqoob Sadikeen");
  const [role, setRole] = useState<Role>("Sales Manager");
  const [view, setView] = useState<View>("dashboard");
  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const [newUserOpen, setNewUserOpen] = useState(false);
  const [convertingLead, setConvertingLead] = useState<typeof LEADS[number] | null>(null);
  const [allocatingProject, setAllocatingProject] = useState<typeof PROJECTS[number] | null>(null);
  const [leads, setLeads] = useState(LEADS);
  const [deals, setDeals] = useState(DEALS);
  const [projects, setProjects] = useState(PROJECTS);
  const [users, setUsers] = useState(USERS);
  const [resources, setResources] = useState(RESOURCES);
  const [assessments, setAssessments] = useState<AssessmentRecord[]>(ASSESSMENTS);

  // const (not function declaration) so closure is never ambiguous
  const logActivity = (event: string, type: string) => {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    setActivityLog((prev) => [{ time, event, type }, ...prev]);
  };

  if (!authed) {
    return (
      <LoginPage
        onLogin={(r, name) => {
          setRole(r);
          setUserName(name);
          setAuthed(true);
        }}
      />
    );
  }

  function handleNewLead(data: NewLeadData) {
    setLeads((prev) => [
      {
        id: prev.length + 1,
        name: data.companyName,
        contact: data.contactName,
        email: data.contactName.toLowerCase().replace(/\s+/g, ".") + "@" + data.companyName.toLowerCase().replace(/\s+/g, "") + ".com",
        phone: "—",
        industry: data.industry || "—",
        source: data.source || "Inbound",
        value: data.dealValue
          ? `${data.currency === "USD" ? "$" : data.currency + " "}${parseInt(data.dealValue).toLocaleString()}`
          : "—",
        status: "New",
        assigned: userName,
        rep: data.assignedTo || "",
        date: "Today",
        priority: data.priority || "Medium",
      },
      ...prev,
    ]);
    logActivity(`New lead created — ${data.companyName}`, "lead");
  }

  function handleAssignRep(leadId: number, rep: string) {
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, rep } : l));
  }

  function handleDeleteLead(id: number) {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }

  function handleConvertLead(deal: typeof DEALS[number]) {
    setDeals((prev) => [deal, ...prev]);
    setLeads((prev) => prev.map((l) => l.name === deal.client ? { ...l, status: "Closed" } : l));
    setConvertingLead(null);
    logActivity(`Lead converted to deal — ${deal.name}`, "deal");
  }

  function handleAddUser(u: Omit<typeof USERS[number], "id" | "lastLogin">) {
    setUsers((prev) => [...prev, { ...u, id: Date.now(), lastLogin: "Just now" }]);
    DEMO_CREDENTIALS = [...DEMO_CREDENTIALS, { email: u.email, password: u.password, role: u.role as Role, name: u.name }];
    logActivity(`New user added — ${u.name} (${u.role})`, "user");
  }

  function handleRemoveUser(id: number) {
    setUsers((prev) => {
      const target = prev.find((u) => u.id === id);
      if (target) logActivity(`User removed — ${target.name}`, "user");
      return prev.filter((u) => u.id !== id);
    });
  }


  function handleAllocateResources(projectId: number, allocated: string[]) {
    const projectName = projects.find((p) => p.id === projectId)?.name ?? "";
    setProjects((prev) => prev.map((p) => p.id === projectId ? { ...p, team: p.team + allocated.length } : p));
    setResources((prev) => prev.map((r) => {
      if (!allocated.includes(r.name)) return r;
      const current = parseInt(r.availability);
      const reduced = Math.max(0, current - 20);
      return { ...r, availability: reduced + "%", project: projectName };
    }));
    setAllocatingProject(null);
  }

  function handleContactLead(leadId: number) {
    setLeads((prev) => prev.map((l) => l.id === leadId && l.status === "New" ? { ...l, status: "Contacted" } : l));
  }

  function handleQualifyLead(leadId: number) {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, status: "Qualified" } : l));
    logActivity(`Lead qualified — ${lead.name}`, "lead");
  }

  function handleSubmitForAssessment(leadId: number) {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.status !== "Qualified") return;
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, status: "Assessment" } : l));
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    setAssessments((prev) => [
      ...prev,
      { id: Date.now(), leadName: lead.name, type: "Technical", status: "Pending", risk: "Low", assessor: "Ravidu Pasan", date: "—", notes: "" },
      { id: Date.now() + 1, leadName: lead.name, type: "Financial", status: "Pending", risk: "Low", assessor: "Hashmath Fazli", date: "—", notes: "" },
    ]);
    logActivity(`Lead submitted for assessment — ${lead.name}`, "assess");
  }

  function handleSubmitAssessment(id: number, notes: string, risk: "Low" | "Medium" | "High", document?: string) {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    setAssessments((prev) => prev.map((a) => a.id === id ? { ...a, status: "Submitted", notes, risk, date: dateStr, ...(document ? { document } : {}) } : a));
    const assessment = assessments.find((a) => a.id === id);
    logActivity(`${assessment?.type} assessment submitted — ${assessment?.leadName}`, "assess");
  }


  function handleRejectLead(leadId: number) {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, status: "Closed" } : l));
    logActivity(`Lead rejected — ${lead.name}`, "lead");
  }

  function handleUpdateLeadStatus(leadId: number, status: string) {
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, status } : l));
    logActivity(`Lead status updated to ${status}`, "lead");
  }

  const nav = ROLE_NAV[role];

  // Reset to dashboard if current view isn't in nav
  const validViews = nav.map((n) => n.view);
  const activeView = validViews.includes(view) ? view : "dashboard";

  return (
    <>
    <NewLeadPanel open={newLeadOpen} onClose={() => setNewLeadOpen(false)} onSave={handleNewLead} />
    <NewUserPanel open={newUserOpen} onClose={() => setNewUserOpen(false)} onSave={handleAddUser} />
    <ConvertLeadPanel lead={convertingLead} onClose={() => setConvertingLead(null)} onConfirm={handleConvertLead} />
    <AllocateResourcesPanel project={allocatingProject} resources={resources} onClose={() => setAllocatingProject(null)} onSave={handleAllocateResources} />
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--background)" }}>
      {/* Sidebar */}
      <aside
        className="w-60 shrink-0 flex flex-col h-full"
        style={{ background: "var(--card)", borderRight: "1px solid var(--border)" }}
      >
        {/* Logo */}
        <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <img src={altriumLogo} alt="Altrium" className="h-6 object-contain" style={{ display: "block", filter: "invert(1) hue-rotate(180deg)" }} />
          <div style={{ display: "none" }}> {/* keep old closing structure */}
          </div>
        </div>

        {/* Signed-in user chip */}
        <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ background: "var(--muted)" }}>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: ROLE_COLORS[role] + "30", color: ROLE_COLORS[role] }}
            >
              {userName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{userName}</p>
              <p className="text-xs truncate font-medium" style={{ color: ROLE_COLORS[role] }}>{role}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {nav.map((item) => {
            const active = item.view === activeView;
            return (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all"
                style={{
                  background: active ? ROLE_COLORS[role] + "18" : "transparent",
                  color: active ? ROLE_COLORS[role] : "var(--muted-foreground)",
                  border: active ? `1px solid ${ROLE_COLORS[role]}28` : "1px solid transparent",
                }}
              >
                <span className="text-base leading-none">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 flex flex-col gap-2" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="px-3 pb-2">
            <p className="text-xs font-medium truncate">{userName}</p>
            <p className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>
              {DEMO_CREDENTIALS.find((c) => c.name === userName)?.email ?? ""}
            </p>
          </div>
          <button
            onClick={() => setAuthed(false)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all group"
            style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#fc4f3718";
              (e.currentTarget as HTMLButtonElement).style.color = "#fc4f37";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#fc4f3730";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--muted)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-foreground)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
            }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M6 2H2.5A1.5 1.5 0 0 0 1 3.5v8A1.5 1.5 0 0 0 2.5 13H6M10 10.5l3.5-3-3.5-3M13.5 7.5H5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header
          className="sticky top-0 z-10 px-8 py-4 flex items-center justify-between"
          style={{
            background: "var(--background)",
            borderBottom: "1px solid var(--border)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center gap-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
            <span>{role}</span>
            <span>/</span>
            <span style={{ color: "var(--foreground)" }} className="font-medium capitalize">{activeView}</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Bell with activity dropdown */}
            <div className="relative">
              <button
                onClick={() => setBellOpen((v) => !v)}
                className="relative p-2 rounded-lg transition-colors hover:bg-[#ffffff08]"
                style={{ color: "var(--muted-foreground)", border: "1px solid var(--border)" }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.5A4.5 4.5 0 003.5 6v2.5L2 10.5h12l-1.5-2V6A4.5 4.5 0 008 1.5zM6 12a2 2 0 004 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {(role === "Admin" ? activityLog.filter((a) => a.type === "user") : activityLog).length > 0 && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
                )}
              </button>
              {bellOpen && (() => {
                const bellLog = role === "Admin" ? activityLog.filter((a) => a.type === "user") : activityLog;
                return (
                  <div
                    className="absolute right-0 top-full mt-2 w-80 rounded-xl shadow-2xl z-50 overflow-hidden"
                    style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                  >
                    <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
                      <span className="text-sm font-semibold">{role === "Admin" ? "User Activity" : "Recent Activity"}</span>
                      <button onClick={() => setBellOpen(false)} style={{ color: "var(--muted-foreground)" }} className="text-xs hover:opacity-70">✕</button>
                    </div>
                    <div className="flex flex-col max-h-80 overflow-y-auto">
                      {bellLog.length === 0 ? (
                        <p className="text-sm text-center py-6" style={{ color: "var(--muted-foreground)" }}>No activity yet</p>
                      ) : (
                        bellLog.map((a, i) => (
                          <div
                            key={i}
                            className="flex gap-3 items-start px-4 py-3"
                            style={{ borderBottom: i < bellLog.length - 1 ? "1px solid var(--border)" : "none" }}
                          >
                            <span
                              className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                              style={{ background: ({ lead: "#1ed760", deal: "#1a6fe8", project: "#fc4f37", assess: "#a78bfa", user: "#f59e0b" } as Record<string,string>)[a.type] ?? "#7a7a90" }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm leading-snug">{a.event}</p>
                              <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{a.time}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: ROLE_COLORS[role] + "25", color: ROLE_COLORS[role] }}
            >
              {ROLE_INITIALS[role]}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="px-8 py-8 max-w-6xl">
          {activeView === "dashboard" && <DashboardView role={role} activityLog={activityLog} users={users} leads={leads} deals={deals} assessments={assessments} />}
          {activeView === "leads" && (
            <LeadsView
              leads={leads}
              onNewLead={() => setNewLeadOpen(true)}
              onAssignRep={handleAssignRep}
              onDeleteLead={handleDeleteLead}
              onConvertLead={role === "Sales Manager" ? (l) => setConvertingLead(l) : undefined}
              onRejectLead={role === "Sales Manager" ? handleRejectLead : undefined}
              isSalesRep={role === "Sales Rep"}
              isSalesManager={role === "Sales Manager"}
              repName={userName}
              onQualifyLead={role === "Sales Rep" ? handleQualifyLead : undefined}
              onSubmitForAssessment={role === "Sales Manager" ? handleSubmitForAssessment : undefined}
              onUpdateStatus={role === "Sales Rep" ? handleUpdateLeadStatus : undefined}
              onContactLead={role === "Sales Rep" ? handleContactLead : undefined}
              assessments={assessments}
            />
          )}
          {activeView === "deals" && (
            <DealsView
              deals={deals}
              isSalesRep={role === "Sales Rep"}
            />
          )}
          {activeView === "users" && <UsersView users={users} onAddUser={() => setNewUserOpen(true)} onRemoveUser={handleRemoveUser} />}
          {activeView === "assessments" && (
            <AssessmentsView
              assessments={assessments}
              role={role}
              leads={leads}
              onSubmitAssessment={handleSubmitAssessment}
            />
          )}
          {activeView === "resources" && <ResourcesView resources={resources} />}
        </div>
      </main>
    </div>
    </>
  );
}
