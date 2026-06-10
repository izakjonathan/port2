import Link from "next/link";
import { projects } from "../data/projects";

const serviceObjects = [
  {
    key: "strategy",
    label: "12 /12",
    title: "Strategy Session",
    text: "Identity, layout and direction.",
    tone: "yellow"
  },
  {
    key: "digital",
    label: "283",
    title: "Case Studies",
    text: "Selected digital products and interface systems.",
    tone: "black"
  },
  {
    key: "profile",
    label: "45",
    title: "Seamless / Powerful / Scalable",
    text: "A compact design and development practice.",
    tone: "white"
  }
];

export default function Home() {
  return (
    <main className="ref3-site">
      <section className="ref3-hero">
<article className="ref3-card ref3-pink">
          <div className="ref3-mini-nav">
            <strong>Study/Clyb</strong>
            <span>Search Work</span>
            <span>Menu</span>
          </div>

          <h1><span>Turning Ideas</span> Into Visual Systems And Digital Products.</h1>
</article>

        <article className="ref3-card ref3-yellow">
          <div className="ref3-count">12 <span>/12</span></div>
          <h2>Strategy<br /><span>Session</span></h2>
          <p>Graphic design, logos, layouts and creative direction.</p>
</article>

        <article className="ref3-card ref3-white">
          <div className="ref3-menu-dots">•••</div>
          <div className="ref3-profile-dot" />
          <div className="ref3-level"><span>45</span><small>Level</small></div>
          <div className="ref3-done"><small>Done</small><span>21</span></div>
          <ul>
            <li><b>S</b>Seamless</li>
            <li><b>P</b>Powerful</li>
            <li><b>S</b>Scalable</li>
            <li><b>M</b>Main</li>
            <li><b>O</b>Optimized</li>
            <li><b>E</b>Elite</li>
          </ul>
        </article>
</section>

      <section className="ref3-work" id="case-studies">
        <div className="ref3-bg-word">WORK</div>
        <div className="ref3-work-heading">
          <span>01</span>
          <h2>Case Studies</h2>
          <Link href="/projects">Archive</Link>
        </div>

        <div className="ref3-work-stage">
          {projects.map((project, index) => (
            <Link
              href={`/projects/${project.slug}`}
              className={`ref3-project ref3-project-${index + 1}`}
              key={project.slug}
             
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <footer>
                <small>{project.category}</small>
                <small>{project.year}</small>
              </footer>
            </Link>
          ))}
        </div>
      </section>

      <section className="ref3-services" id="services">
        <div className="ref3-bg-word">SERVICES</div>
        <div className="ref3-work-heading">
          <span>02</span>
          <h2>Services</h2>
          <span>Objects</span>
        </div>

        <div className="ref3-service-stage">
          <article className="ref3-service ref3-service-yellow">
            <span>01</span>
            <h3>Graphic Design</h3>
            <p>Logos, typography, menus, posters, print systems and visual identity.</p>
          </article>

          <article className="ref3-service ref3-service-pink">
            <span>02</span>
            <h3>Web Design</h3>
            <p>Editorial websites, portfolios, landing pages and interaction-led layouts.</p>
          </article>

          <article className="ref3-service ref3-service-black">
            <span>03</span>
            <h3>Development</h3>
            <p>Next.js builds, dashboards, custom tools, automation and deployment.</p>
          </article>

          <article className="ref3-service ref3-service-white">
            <span>04</span>
            <h3>Editorial</h3>
            <p>Reports, presentations, publications and information design.</p>
          </article>
        </div>
      </section>

      <section className="ref3-about" id="about">
        <span>03 / Profile</span>
        <p>I build visual systems, mobile-first web apps, editorial interfaces and experimental digital identities with a focus on typography, atmosphere and interaction.</p>
        <a href="mailto:izakhyllested@icloud.com">Contact</a>
      </section>
    </main>
  );
}
