import Link from "next/link";

export default function ProjectRow({ project, index }) {
  return (
    <Link href={`/projects/${project.slug}`} className="archive-row">
      <span className="archive-number">{String(index + 1).padStart(2, "0")}</span>
      <div className="archive-main">
        <h2>{project.title}</h2>
        <p>{project.description}</p>
      </div>
      <div className="archive-side">
        <span>{project.category}</span>
        <span>{project.year}</span>
      </div>
    </Link>
  );
}
