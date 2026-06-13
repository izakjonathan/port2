import ProjectRow from "../../components/ProjectRow";
import { projects } from "../../data/projects";

export default function ProjectsPage() {
  return (
    <main id="main-content" className="archive-page" tabIndex="-1">
      <section className="archive-hero" aria-labelledby="archive-heading">
        <span>01 / ARCHIVE</span>
        <h1 id="archive-heading">Projects</h1>
      </section>

      <section className="archive-list" aria-label="Project archive">
        {projects.map((project, index) => (
          <ProjectRow key={project.slug} project={project} index={index} />
        ))}
      </section>
    </main>
  );
}
