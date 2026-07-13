import Link from "next/link";
import { SectionLabel } from "@/components/section-label";
import { projects } from "@/lib/content";

export function Work() {
  return (
    <section id="work">
      <div className="wrap">
        <SectionLabel no="01">Selected Work</SectionLabel>
        <div className="work">
          {projects.map((project, i) => {
            const idx = `/${String(i + 1).padStart(2, "0")}`;
            const title = (
              <>
                {project.title} <span className="arrow">→</span>
              </>
            );
            return (
              <div className="work-item" key={project.slug}>
                <div className="work-idx">{idx}</div>
                <div>
                  {project.caseStudy ? (
                    <Link className="wt serif" href={`/work/${project.slug}`}>
                      {title}
                    </Link>
                  ) : (
                    <div className="wt serif">{title}</div>
                  )}
                  <div className="wd">{project.blurb}</div>
                  <div className="tags">
                    {project.tags.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="wlinks">
                  {project.links.map((link) => (
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
