import Link from "next/link";
import { projects } from "../data/projects";

export default function Home() {
  const featured = projects.slice(0,5);

  return (
    <main className="v2-collage">
      <section className="v2-stage">

        <div className="v2-bg-word bg1">DESIGN</div>
        <div className="v2-bg-word bg2">SYSTEMS</div>
        <div className="v2-bg-word bg3">DEVELOPMENT</div>

        <div className="v2-counter c1"><span>05</span><small>Projects</small></div>
        <div className="v2-counter c2"><span>04</span><small>Services</small></div>
        <div className="v2-counter c3"><span>2026</span></div>

        <article className="svc yellow">
          <span>01</span>
          <h2>Graphic Design</h2>
          <p>Logos, identity systems, print, campaigns and visual direction.</p>
        </article>

        <article className="svc pink">
          <span>02</span>
          <h2>Web Design</h2>
          <p>Editorial websites, portfolios and digital experiences.</p>
        </article>

        <article className="svc black">
          <span>03</span>
          <h2>Development</h2>
          <p>Apps, dashboards, automation and custom tools.</p>
        </article>

        <article className="svc white">
          <span>04</span>
          <h2>Editorial</h2>
          <p>Reports, presentations, publications and information design.</p>
        </article>

        {featured.map((project,index)=>(
          <Link href={`/projects/${project.slug}`} key={project.slug}
            className={`mini-project mp${index+1}`}>
            <strong>{project.title}</strong>
          </Link>
        ))}

      </section>
    </main>
  );
}
