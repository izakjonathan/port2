import Link from "next/link";
import { projects } from "../data/projects";

const services = [
  ["Strategy", "Identity systems, logos, layouts and visual direction."],
  ["Interface", "Responsive websites, editorial pages and product experiences."],
  ["Development", "Custom tools, dashboards, apps and deployment workflows."]
];

export default function Home() {
  return (
    <main className="audio-site">
      <section className="audio-hero">
        <div className="audio-label audio-label-tl">Portfolio <span>Studio</span></div>
        <Link href="/projects" className="audio-label audio-label-tr">Main Page</Link>
        <a href="#services" className="audio-label audio-label-bl">Main Page</a>
        <a href="#about" className="audio-label audio-label-br">Audio <span>Lessons</span></a>

        <div className="audio-red" />

        <article className="audio-pink">
          <div className="mini-nav"><strong>Study/Clyb</strong><span>Search Work</span><span>Menu</span></div>
          <h1><span>Turning Ideas</span> Into Visual Systems And Digital Products.</h1>
          <div className="audio-symbol"><span /></div>
          <div className="audio-bottom"><strong>{projects.length}</strong><small>/ Projects</small><i /></div>
        </article>

        <article className="audio-yellow">
          <div className="count">12 <span>/12</span></div>
          <h2>Strategy<br /><span>Session</span></h2>
          <p>Graphic design, logos, print and creative direction.</p>
          <div className="bottle" />
          <div className="chips"><b>2</b><b>T</b></div>
        </article>

        <article className="audio-white">
          <div className="dots">•••</div>
          <div className="profile" />
          <div className="level"><span>45</span><small>Level</small></div>
          <div className="done"><small>Done</small><span>21</span></div>
          <ul>
            <li><b>S</b>Seamless</li>
            <li><b>P</b>Powerful</li>
            <li><b>S</b>Scalable</li>
            <li><b>M</b>Main</li>
            <li><b>O</b>Optimized</li>
            <li><b>E</b>Elite</li>
          </ul>
        </article>

        <article className="audio-black"><span>Case<br />Studies</span><strong>283</strong></article>
      </section>

      <section className="audio-section" id="work">
        <div className="audio-section-head">
          <span>01</span>
          <h2>Selected Work</h2>
          <Link href="/projects">Archive</Link>
        </div>
        <div className="audio-grid">
          {projects.map((project, index) => (
            <Link href={`/projects/${project.slug}`} className={`audio-card tone-${index % 4}`} key={project.slug}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <footer><small>{project.category}</small><small>{project.year}</small></footer>
            </Link>
          ))}
        </div>
      </section>

      <section className="audio-section" id="services">
        <div className="audio-section-head">
          <span>02</span>
          <h2>Services</h2>
          <span>Design / Build</span>
        </div>
        <div className="service-stack">
          {services.map(([title, text], index) => (
            <article className={`service-card service-card-${index}`} key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="audio-about" id="about">
        <span>03 / Profile</span>
        <p>I build visual systems, mobile-first web apps, editorial interfaces and experimental digital identities with a focus on typography, atmosphere and interaction.</p>
        <a href="mailto:izakhyllested@icloud.com">Contact</a>
      </section>
    </main>
  );
}
