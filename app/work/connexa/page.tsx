import type { Metadata } from "next";
import { CaseStudy } from "@/components/case-study";
import { connexaCaseStudy } from "@/lib/content";

const description = connexaCaseStudy.tagline;

export const metadata: Metadata = {
  title: "Connexa — Case Study",
  description,
  alternates: { canonical: "/work/connexa" },
  openGraph: {
    title: "Connexa — Case Study · Akansha",
    description,
    url: "/work/connexa",
    type: "article",
  },
  twitter: {
    title: "Connexa — Case Study · Akansha",
    description,
  },
};

export default function ConnexaCaseStudyPage() {
  return <CaseStudy />;
}
