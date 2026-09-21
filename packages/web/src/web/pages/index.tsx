import { Nav } from "../components/nav";
import { ScrollProgress } from "../components/scroll-progress";
import { Hero } from "../components/hero";
import { Listen } from "../components/listen";
import { About } from "../components/about";
import { MusicProjects } from "../components/music-projects";
// import { Projects } from "../components/projects"; // hidden per request
import { EprStandard } from "../components/epr-standard";
import { Experience } from "../components/experience";
import { Certifications } from "../components/certifications";
import { Connect } from "../components/connect";
import { Footer } from "../components/footer";
import { CustomSection } from "../components/custom-section";
import { useCustomSections } from "../lib/content";

function Index() {
  const { data: sections = [] } = useCustomSections();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <Nav />

      {/* Console backdrop behind Hero only */}
      <div className="relative">
        <div
          className="hero-console-img pointer-events-none absolute inset-0 z-0 bg-cover bg-top"
          style={{ backgroundImage: "url(/images/hero-bg.jpg)" }}
        />
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in srgb, var(--background) 25%, transparent) 0%, color-mix(in srgb, var(--background) 50%, transparent) 60%, var(--background) 100%)",
          }}
        />
        <div className="relative z-10">
          <Hero />
        </div>
      </div>

      <Listen />

      <About />
      <MusicProjects />
      <EprStandard />
      {sections.map((s) => (
        <CustomSection key={s.id ?? Math.random()} section={s} />
      ))}
      <Experience />
      <Certifications />
      <Connect />
      <Footer />
    </div>
  );
}

export default Index;
