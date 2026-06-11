import { Nav } from "../components/nav";
import { ScrollProgress } from "../components/scroll-progress";
import { Hero } from "../components/hero";
import { About } from "../components/about";
import { MusicProjects } from "../components/music-projects";
import { Projects } from "../components/projects";
import { Aqueo } from "../components/aqueo";
import { Experience } from "../components/experience";
import { Certifications } from "../components/certifications";
import { Connect } from "../components/connect";
import { Footer } from "../components/footer";

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <Nav />
      <Hero />
      <About />
      <MusicProjects />
      <Projects />
      <Aqueo />
      <Experience />
      <Certifications />
      <Connect />
      <Footer />
    </div>
  );
}

export default Index;
