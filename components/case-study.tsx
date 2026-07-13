import Link from "next/link";
import { Logo } from "@/components/logo";
import { Footer } from "@/components/footer";
import type { CaseStudy as CaseStudyData } from "@/lib/content";

function RealtimeDiagram() {
  return (
    <div
      className="cs-diagram"
      role="img"
      aria-label="A Next.js client connected to an Express server over a live WebSocket channel, backed by Postgres"
    >
      <div className="cs-node">
        <span className="cs-node-kicker">Client</span>
        <span className="cs-node-title">Next.js 15</span>
        <span className="cs-node-sub">React · Zustand</span>
      </div>
      <div className="cs-link">
        <span className="cs-link-line" aria-hidden="true" />
        <span className="cs-link-label">WebSocket channel</span>
      </div>
      <div className="cs-node">
        <span className="cs-node-kicker">Server</span>
        <span className="cs-node-title">Express + Prisma</span>
        <span className="cs-node-sub">PostgreSQL</span>
      </div>
    </div>
  );
}

function PipelineDiagram() {
  return (
    <div
      className="cs-diagram"
      role="img"
      aria-label="A control plane on FastAPI and Celery dispatching jobs over Redis to a data plane of workers and an edge agent"
    >
      <div className="cs-node">
        <span className="cs-node-kicker">Control plane</span>
        <span className="cs-node-title">FastAPI · Celery</span>
        <span className="cs-node-sub">schedules &amp; tracks runs</span>
      </div>
      <div className="cs-link">
        <span className="cs-link-line" aria-hidden="true" />
        <span className="cs-link-label">jobs via Redis</span>
      </div>
      <div className="cs-node">
        <span className="cs-node-kicker">Data plane</span>
        <span className="cs-node-title">Workers + agent</span>
        <span className="cs-node-sub">runs next to the data</span>
      </div>
    </div>
  );
}

function Diagram({ slug }: { slug: string }) {
  if (slug === "connexa") return <RealtimeDiagram />;
  if (slug === "synqx") return <PipelineDiagram />;
  return null;
}

export function CaseStudy({ cs }: { cs: CaseStudyData }) {
  return (
    <>
      <header className="cs-topbar">
        <div className="wrap cs-topbar-in">
          <Link className="brand" href="/" aria-label="Home">
            <Logo />
            <span>Akansha</span>
          </Link>
          <Link className="cs-back" href="/">
            ← back
          </Link>
        </div>
      </header>

      <main className="wrap cs-main">
        <div className="cs-hero">
          <div className="cs-eyebrow mono">Case study</div>
          <h1 className="serif cs-title">{cs.title}</h1>
          <p className="cs-tagline">{cs.tagline}</p>

          <div className="cs-tags">
            {cs.stack.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>

          <div className="cs-links">
            {cs.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </div>

        <section className="cs-section">
          <div className="cs-label mono">The problem</div>
          <p className="cs-lede serif">{cs.problem}</p>
        </section>

        <section className="cs-section">
          <div className="cs-label mono">The approach</div>
          <p className="cs-lede serif">{cs.approach}</p>
          <Diagram slug={cs.slug} />
        </section>

        <section className="cs-section">
          <div className="cs-label mono">Key decisions</div>
          <div className="cs-decisions">
            {cs.decisions.map((d) => (
              <div className="cs-decision" key={d.title}>
                <h3 className="cs-decision-title serif">{d.title}</h3>
                <p className="cs-decision-detail">{d.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="cs-section">
          <div className="cs-label mono">Results</div>
          <ul className="cs-results">
            {cs.results.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </>
  );
}
