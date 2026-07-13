import { SectionLabel } from "@/components/section-label";
import { education, coursework } from "@/lib/content";

export function Education() {
  return (
    <section id="education">
      <div className="wrap">
        <SectionLabel no="04">Education</SectionLabel>
        <div className="exp">
          <div className="when">{education.when}</div>
          <div>
            <h4>
              {education.degree} · <span className="co">{education.school}</span>
            </h4>
          </div>
        </div>
        <div className="exp">
          <div className="when">Relevant coursework</div>
          <div>
            <ul className="learn-list">
              {coursework.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
