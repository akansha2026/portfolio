import type { Metadata } from "next";
import { CaseStudy } from "@/components/case-study";
import { synqxCaseStudy } from "@/lib/content";

const description = synqxCaseStudy.tagline;

export const metadata: Metadata = {
  title: "SynqX — Case Study",
  description,
  alternates: { canonical: "/work/synqx" },
  openGraph: {
    title: "SynqX — Case Study · Akansha",
    description,
    url: "/work/synqx",
    type: "article",
  },
  twitter: {
    title: "SynqX — Case Study · Akansha",
    description,
  },
};

export default function SynqxCaseStudyPage() {
  return <CaseStudy cs={synqxCaseStudy} />;
}
