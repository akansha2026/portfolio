import { SectionLabel } from "@/components/section-label";
import { achievements } from "@/lib/content";

export function Achievements() {
  return (
    <section id="highlights">
      <div className="wrap">
        <SectionLabel no="02">Highlights</SectionLabel>
        {achievements.map((a) => (
          <div className="exp" key={a.title}>
            <div className="when" aria-hidden="true">
              ★
            </div>
            <div>
              <h4>{a.title}</h4>
              <p>{a.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
