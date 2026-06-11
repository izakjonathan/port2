import ProjectRow from "../../components/ProjectRow";
import { projects } from "../../data/projects";

export default function ProjectsPage() {
  return (
    <main className="archive-page">
      <section className="archive-hero">
        <span>01 / ARCHIVE</span>
        <h1>Projects</h1>
      </section>

      <section className="archive-list">
        {projects.map((project, index) => (
          <ProjectRow key={project.slug} project={project} index={index} />
        ))}
      </section>
    </main>
  );
}
