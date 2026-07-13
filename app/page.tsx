import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Work } from "@/components/work";
import { Achievements } from "@/components/achievements";
import { Toolbox } from "@/components/toolbox";
import { Education } from "@/components/education";
import { Connect } from "@/components/connect";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { getAllStats } from "@/lib/stats";

export default async function Home() {
  const stats = await getAllStats();

  return (
    <>
      <Nav />
      <Hero stats={stats} />
      <Reveal>
        <Work />
      </Reveal>
      <Reveal>
        <Achievements />
      </Reveal>
      <Reveal>
        <Toolbox />
      </Reveal>
      <Reveal>
        <Education />
      </Reveal>
      <Reveal>
        <Connect />
      </Reveal>
      <Footer />
    </>
  );
}
