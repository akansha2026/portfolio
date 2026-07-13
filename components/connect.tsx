import { profile, socials } from "@/lib/content";

export function Connect() {
  return (
    <div className="wrap">
      <div className="contact" id="contact">
        <div
          className="serif"
          style={{ fontSize: 15, color: "var(--accent)", fontStyle: "italic" }}
        >
          Let&apos;s talk
        </div>
        <h2 className="serif" style={{ marginTop: 8 }}>
          Got something worth <em>building</em>?
        </h2>
        <p>
          I&apos;m open to full-stack roles — in India or remote. The fastest way
          to reach me is email.
        </p>
        <div className="socials">
          <a href={`mailto:${profile.email}`}>Email</a>
          {socials.map((social) => (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
