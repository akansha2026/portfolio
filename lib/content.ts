export type Link = { label: string; href: string };
export type Project = {
  slug: string;
  title: string;
  blurb: string;
  tags: string[];
  links: Link[];
  caseStudy?: boolean;
};
export type Achievement = { title: string; detail: string };
export type SkillGroup = { title: string; items: string[] };

export type Profile = {
  name: string;
  kicker: string;
  headline: string;
  accentWord: string;
  lead: string;
  role: string;
  email: string;
};

export const profile: Profile = {
  name: "Akansha",
  kicker: "👋 Hi, I'm Akansha — a full-stack engineer, fresh out of IIT Kharagpur",
  headline: "I like building full-stack products, end to end.",
  accentWord: "end to end",
  lead: "I just finished a B.Sc. in Mathematics & Computing at IIT Kharagpur, and what I enjoy most is taking an idea the whole way — modelling the data, wiring up the backend, and then sweating the small UI details until the thing feels effortless to use. Lately that's meant a real-time chat app that runs over WebSockets and an ETL tool you drive by dragging boxes into a graph. I'm looking for my first full-time role where I get to keep building like that.",
  role: "Full-Stack Software Engineer · React · Next.js · Node · Python",
  email: "akanshaiitkgp2005@gmail.com",
};

export const projects: Project[] = [
  {
    slug: "connexa",
    title: "Connexa",
    blurb:
      "A real-time chat platform I built end to end — one-on-one and group messaging with typing indicators, read receipts, and live presence, all flowing over WebSockets. Backed by Express and Prisma, with the queries and hot paths tuned so it stays snappy under load. It's live today.",
    tags: ["Next.js 15", "TypeScript", "Express", "Prisma", "WebSockets"],
    links: [
      { label: "Live", href: "https://connexa-app.vercel.app" },
      { label: "GitHub", href: "https://github.com/akansha2026/Connexa" },
    ],
    caseStudy: true,
  },
  {
    slug: "synqx",
    title: "SynqX",
    blurb:
      "An open-source ETL orchestrator where you design data pipelines by dragging nodes into a DAG, then schedule them and watch them run in real time. Built on FastAPI, Celery and Redis with a split control/data-plane design, and live telemetry streamed over WebSockets.",
    tags: ["FastAPI", "Celery", "Redis", "React", "TypeScript", "React Flow"],
    links: [{ label: "GitHub", href: "https://github.com/akansha2026/SynqX" }],
    caseStudy: true,
  },
  {
    slug: "windows-calculator",
    title: "Windows Calculator Clone",
    blurb:
      "A faithful clone of the Windows 11 calculator — Standard, Scientific, Programmer and BMI modes — with symbolic algebra powered by Nerdamer and a full set of unit converters. Really a study in getting the small details exactly right.",
    tags: ["React", "React Router", "Styled Components", "Nerdamer"],
    links: [
      { label: "Live", href: "https://windows-calculator-clone-liard.vercel.app" },
      { label: "GitHub", href: "https://github.com/akansha2026/windows-calculator-clone" },
    ],
  },
  {
    slug: "nasa-space",
    title: "NASA Space Explorer",
    blurb:
      "A little portal into NASA's open APIs — the astronomy photo of the day, Mars rover shots, and the media library — built with React and Vite. Lazy-loaded components and reusable hooks keep it fast and tidy.",
    tags: ["React", "Vite", "REST APIs"],
    links: [
      { label: "Live", href: "https://nasa-space-mu.vercel.app" },
      { label: "GitHub", href: "https://github.com/akansha2026/nasa-space" },
    ],
  },
];

export const achievements: Achievement[] = [
  {
    title: "JEE Advanced 2022 — All India Rank 27,182",
    detail:
      "Earned admission to IIT Kharagpur for the B.Sc. in Mathematics & Computing.",
  },
  {
    title: "Flipkart Runway, Season 4 — shortlisted",
    detail:
      "Selected for interviews in Flipkart's national internship program for women engineers.",
  },
  {
    title: "Wing Representative, Mother Teresa Hall",
    detail:
      "Ran residential operations for 100+ students — logistics, welfare, and inter-hall coordination.",
  },
  {
    title: "Illumination 2023, IIT Kharagpur",
    detail:
      "Helped design the structure and coordinate a 100+ member team for the institute's flagship cultural and design event.",
  },
];

export const toolbox: SkillGroup[] = [
  { title: "Languages", items: ["C", "C++", "Python", "JavaScript", "TypeScript", "SQL"] },
  { title: "Frontend", items: ["React", "Next.js", "Tailwind", "Zustand"] },
  { title: "Backend", items: ["Node.js", "Express", "FastAPI", "Celery"] },
  { title: "Databases", items: ["PostgreSQL", "MongoDB", "Redis"] },
  { title: "Concepts", items: ["Data Structures", "Algorithms", "System Design", "Microservices", "API Design"] },
  { title: "Tooling", items: ["Git", "GitHub", "REST APIs", "CI/CD", "Vercel"] },
];

export const education = {
  when: "2022 — 2026",
  degree: "B.Sc., Mathematics & Computing",
  school: "IIT Kharagpur",
} as const;

export const coursework: string[] = [
  "Data Structures & Algorithms",
  "Database Management Systems",
  "Operating Systems",
  "Probability & Statistics",
];

export type Decision = { title: string; detail: string };
export type CaseStudy = {
  slug: string;
  title: string;
  tagline: string;
  stack: string[];
  links: Link[];
  problem: string;
  approach: string;
  decisions: Decision[];
  results: string[];
};

export const connexaCaseStudy: CaseStudy = {
  slug: "connexa",
  title: "Connexa",
  tagline: "A real-time chat platform built end to end — fast, reliable, and live.",
  stack: ["Next.js 15", "TypeScript", "Express", "Prisma", "WebSockets"],
  links: [
    { label: "Live", href: "https://connexa-app.vercel.app" },
    { label: "GitHub", href: "https://github.com/akansha2026/Connexa" },
  ],
  problem:
    "Real-time chat looks simple until you actually build it. Messages have to arrive instantly, presence and typing state must stay in sync for everyone in a room, and the whole thing has to hold together when lots of people are online at once.",
  approach:
    "A full-stack TypeScript app: a Next.js 15 frontend talking to an Express backend over WebSockets, with Prisma on PostgreSQL for storage. I tuned the queries and the busiest paths to keep messaging low-latency under concurrent load.",
  decisions: [
    {
      title: "WebSockets for everything live",
      detail:
        "One-on-one and group messaging, typing indicators, read receipts, and presence all flow over one real-time channel — so the UI reflects what's happening the moment it happens.",
    },
    {
      title: "Tuned queries on the hot paths",
      detail:
        "Careful Prisma queries and indexing on the busiest paths keep messaging snappy even with many rooms and users active at the same time.",
    },
    {
      title: "Auth done properly",
      detail:
        "JWT authentication with rotating tokens and HTTP-only cookies, plus email verification and password recovery via Nodemailer and SendGrid.",
    },
    {
      title: "Re-render discipline on the frontend",
      detail:
        "Zustand with selective state subscriptions and Tailwind for styling, so the interface only re-renders the parts that actually changed.",
    },
  ],
  results: [
    "Live today at connexa-app.vercel.app.",
    "Real-time one-on-one and group chat with presence, typing, and read receipts.",
    "Full-stack TypeScript across the board: Next.js 15, Express, Prisma.",
  ],
};

export const synqxCaseStudy: CaseStudy = {
  slug: "synqx",
  title: "SynqX",
  tagline: "An open-source ETL orchestrator you drive by dragging boxes into a graph.",
  stack: ["FastAPI", "Celery", "Redis", "React", "TypeScript", "React Flow", "PostgreSQL"],
  links: [{ label: "GitHub", href: "https://github.com/akansha2026/SynqX" }],
  problem:
    "Moving data between systems usually means one-off scripts that are hard to schedule, hard to watch, and hard to reuse. I wanted something visual instead: build a pipeline once, see it as a graph, and actually watch it run.",
  approach:
    "SynqX splits into a control plane and a data plane. The control plane — FastAPI with Celery and Redis — schedules work and tracks every run. The data plane does the real extract, transform, and load, and can run through a separate agent so it sits close to the data. You compose a pipeline as a DAG on a React Flow canvas.",
  decisions: [
    {
      title: "Control plane / data plane split",
      detail:
        "The API and scheduler are separate from the workers that move data, so a heavy job never freezes the interface and the data plane can run wherever the data lives.",
    },
    {
      title: "Pluggable connectors",
      detail:
        "Every source and destination is a connector behind one common interface (SQL, Redis, and more), so adding a new system doesn't mean touching the engine.",
    },
    {
      title: "Live telemetry over WebSockets",
      detail:
        "Each run streams its progress and logs to the UI as it happens, so you watch a pipeline move instead of refreshing a table.",
    },
    {
      title: "Versioned metadata store",
      detail:
        "Alembic migrations and a typed schema keep the metadata database consistent as the platform changes.",
    },
  ],
  results: [
    "Design pipelines visually as a DAG and run them on a schedule.",
    "Control plane on FastAPI, Celery and Redis, with a separate agent for running close to the data.",
    "A pluggable connector system with real-time run telemetry over WebSockets.",
  ],
};

/** Case studies keyed by project slug, for the /work/[slug] route. */
export const caseStudies: Record<string, CaseStudy> = {
  connexa: connexaCaseStudy,
  synqx: synqxCaseStudy,
};

export const socials: Link[] = [
  { label: "GitHub", href: "https://github.com/akansha2026" },
  { label: "LinkedIn", href: "https://linkedin.com/in/akanshaiitkgp" },
];
