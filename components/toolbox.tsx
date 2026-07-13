import { SectionLabel } from "@/components/section-label";
import { toolbox } from "@/lib/content";

export function Toolbox() {
  return (
    <section id="skills">
      <div className="wrap">
        <SectionLabel no="03">What I Work With</SectionLabel>
        <div className="skills-list">
          {toolbox.map((group) => {
            const highlight = group.title === "AI Tools";
            return (
              <div
                className={`skills-row${highlight ? " skills-row--accent" : ""}`}
                key={group.title}
              >
                <div className="skills-cat">
                  {group.title}
                  {highlight && <span className="skills-star">★</span>}
                </div>
                <div className="skills-items">
                  {group.items.map((item) => (
                    <span className="skills-item" key={item}>
                      {item}
                    </span>
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
