import type { Metadata } from "next";
import { Manrope, Fraunces, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { CommandPalette } from "@/components/command-palette";
import { Terminal } from "@/components/terminal";
import { profile, socials, education } from "@/lib/content";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://akansha-swe.vercel.app";
const description =
  "Full-stack software engineer building real-time and full-stack products with React, Next.js, Node and Python.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Akansha",
    template: "%s · Akansha",
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Akansha",
    description,
    siteName: "Akansha",
    images: ["/og"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Akansha",
    description,
    images: ["/og"],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Software Engineer",
  url: siteUrl,
  email: profile.email,
  sameAs: socials.map((s) => s.href),
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Indian Institute of Technology Kharagpur",
  },
  description: `${profile.role}. ${education.degree}, ${education.school}.`,
};

const noFlashScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        {children}
        <CommandPalette />
        <Terminal />
        <Analytics />
      </body>
    </html>
  );
}
