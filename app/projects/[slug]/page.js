
import Link from "next/link";

export default function ProjectPage({ params }) {
  const order = ["bar-os","rummy-500","product-dashboard","employee-app","portfolio"];

  const projects = {
    "bar-os": {
      title:"Bar OS Dashboard",
      status:"Active Development",
      subtitle:"Operations, finance and reporting platform",
      challenge:"Managing multiple venues requires visibility across sales, labour costs, purchasing, supplier performance and profitability. Existing reporting processes relied on manually reviewing spreadsheets and gathering information from multiple sources, making it difficult to identify trends and make timely decisions.",
      approach:"The platform was designed around the operational workflows used in day-to-day venue management. Rather than recreating traditional accounting reports, the system focuses on the metrics most relevant to operational decision-making.",
      solution:"Bar OS combines financial, operational and purchasing data into a single dashboard experience. Features include revenue tracking, labour monitoring, purchasing analysis, supplier intelligence, margin reporting, comparative performance views and data quality monitoring.",
      outcome:"The result is a platform that improves visibility, supports decision-making and reduces time spent compiling reports."
    },
    "rummy-500": {
      title:"Rummy 500",
      status:"Active Development",
      subtitle:"Cross-device score tracking application",
      challenge:"Traditional scorekeeping methods create friction during gameplay. Paper score sheets are difficult to share, error-prone and impossible to synchronise between devices.",
      approach:"The project focused heavily on interaction design and usability. Every action was evaluated through the lens of reducing friction and minimising interruptions to gameplay.",
      solution:"Features include live score tracking, multi-player support, round history, undo functionality, game statistics and cross-device synchronisation.",
      outcome:"The project demonstrates product thinking, interaction design and real-time application architecture while solving a specific user problem through thoughtful UX design."
    },
    "product-dashboard": {
      title:"Product Dashboard",
      status:"Live",
      subtitle:"Pricing and supplier intelligence",
      challenge:"Product information was fragmented across multiple systems and spreadsheets, making it difficult to compare pricing, identify opportunities and maintain consistency.",
      approach:"The platform was designed around quick access to information and efficient search workflows. Visual hierarchy and information density were carefully balanced to support fast decision-making.",
      solution:"Features include product search, supplier comparison, pricing analysis, cost breakdowns and purchasing intelligence.",
      outcome:"The dashboard provides a central source of truth for product information and purchasing decisions."
    },
    "employee-app": {
      title:"Employee App",
      status:"Concept",
      subtitle:"Internal hospitality operations platform",
      challenge:"Operational information is often spread across messaging platforms, documents and informal communication channels.",
      approach:"The application was designed as a single destination for employees, combining communication, documentation and operational workflows within a mobile-first experience.",
      solution:"Features include news and updates, employee handbook, task management, inventory tools, shift information and internal communication.",
      outcome:"The project explores how internal software can improve operational consistency and employee experience."
    },
    "portfolio": {
      title:"Portfolio Website",
      status:"Live",
      subtitle:"Design system, typography and interaction design",
      challenge:"Most portfolio websites prioritise visual effects over clarity. The goal was to create a site that feels distinctive while maintaining a strong focus on content and readability.",
      approach:"The design process centred around typography, layout systems, motion principles and visual hierarchy.",
      solution:"Features include a custom design system, responsive layouts, motion design, parallax interactions and a reusable case study framework.",
      outcome:"The portfolio serves as both a showcase of projects and a demonstration of design, development and product thinking."
    }
  };

  const slug = params.slug;
  const project = projects[slug] || projects.portfolio;
  const current = Math.max(order.indexOf(slug),0);
  const prevSlug = order[(current - 1 + order.length) % order.length];
  const nextSlug = order[(current + 1) % order.length];

  return (
    <main className="case-study">
      <section className="case-hero">
        <div className="case-kicker">{project.status}</div>
        <h1>{project.title}</h1>
        <p className="case-subtitle">{project.subtitle}</p>
      </section>

      <section className="case-showcase">
        <img src="https://picsum.photos/1600/900?10" alt="" />
      </section>

      <section className="case-split">
        <div>
          <span className="case-section-label">01 / CHALLENGE</span>
          <h2>Challenge</h2>
          <p>{project.challenge}</p>
        </div>
        <img src="https://picsum.photos/900/1100?11" alt="" />
      </section>

      <section className="case-split case-split-reverse">
        <img src="https://picsum.photos/900/1100?12" alt="" />
        <div>
          <span className="case-section-label">02 / APPROACH</span>
          <h2>Approach</h2>
          <p>{project.approach}</p>
        </div>
      </section>

      <section className="case-wide-copy">
        <span className="case-section-label">03 / SOLUTION</span>
        <h2>Solution</h2>
        <p>{project.solution}</p>
      </section>

      <section className="case-gallery">
        <img src="https://picsum.photos/1200/800?13" alt="" />
        <img src="https://picsum.photos/1200/800?14" alt="" />
        <img src="https://picsum.photos/1200/800?15" alt="" />
      </section>

      <section className="case-wide-copy">
        <span className="case-section-label">04 / OUTCOME</span>
        <h2>Outcome</h2>
        <p>{project.outcome}</p>
      </section>

      <nav className="case-nav">
        <Link href={`/projects/${prevSlug}`}><small>Previous Project</small>{projects[prevSlug].title}</Link>
        <Link href={`/projects/${nextSlug}`}><small>Next Project</small>{projects[nextSlug].title}</Link>
      </nav>
    </main>
  );
}
