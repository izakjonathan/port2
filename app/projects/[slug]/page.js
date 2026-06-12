import Link from "next/link";
import { notFound } from "next/navigation";
import { projects as projectIndex } from "../../../data/projects";

const order = ["bar-os", "rummy-500", "product-dashboard", "employee-app", "portfolio"];

const caseStudies = {
  "bar-os": {
    title: "Bar OS Dashboard",
    status: "Active Development",
    subtitle: "Operations, finance and reporting platform",
    challenge: "Running multiple venues means tracking revenue, labour costs, supplier performance and margins across sites — simultaneously. The previous approach relied on manually pulling data from separate systems into spreadsheets, which meant reports were always hours or days behind, errors crept in, and time that should have gone into decisions went into data assembly instead.",
    approach: "Rather than building another reporting tool, the design started from the actual questions managers ask daily: which venue had the best margin this week, which supplier is underperforming, where is labour running hot. Each view was shaped around a real operational question, not an accounting category.",
    solution: "Bar OS brings financial, operational and purchasing data into a single dashboard. Revenue tracking, labour monitoring, purchasing analysis, supplier intelligence, margin reporting and comparative performance views are all connected — so context from one area informs decisions in another. A data quality layer surfaces inconsistencies before they reach the reports.",
    outcome: "Managers spend less time building reports and more time acting on them. The platform has become the daily operational source of truth across multiple sites, replacing a patchwork of spreadsheets and messaging threads."
  },
  "rummy-500": {
    title: "Rummy 500",
    status: "Active Development",
    subtitle: "Cross-device score tracking application",
    challenge: "Keeping score in a long card game is friction nobody wants. Paper sheets get lost, totals get disputed and nobody wants to be the one doing maths mid-round. Existing apps either over-engineer the problem with unnecessary features or are too bare to be actually useful across a group of players on different devices.",
    approach: "Every decision was tested against a single question: does this interrupt the game? Score entry needed to be fast enough to do between rounds, undo needed to be one tap, and the game history needed to be readable at a glance without anyone having to explain it.",
    solution: "The app covers live score tracking, multi-player support, per-round history, one-tap undo and running game statistics — all synced across devices in real time. The interface adapts to how different players hold their phones, and the game state persists through accidental closes.",
    outcome: "The project demonstrates how interaction design and product thinking applied to a small, specific problem can produce something that genuinely replaces the old way of doing it. It's in active use across real games."
  },
  "product-dashboard": {
    title: "Product Dashboard",
    status: "Live",
    subtitle: "Pricing and supplier intelligence",
    challenge: "Product data was scattered across supplier catalogues, internal spreadsheets and order history — with no way to compare pricing across sources or spot where margins were being squeezed. Every purchasing decision required manual research that should have been instant.",
    approach: "The design prioritised search speed above everything else. A buyer looking up a product needed to reach a comparison in two taps, not five screens. Information density was tuned carefully — enough context to act confidently, without the cognitive overload of a traditional ERP interface.",
    solution: "The dashboard centralises product search, supplier comparison, cost breakdowns and purchasing intelligence. Buyers can see price history, identify the best current source and flag anomalies — all from a single interface that updates in real time with new supplier data.",
    outcome: "The dashboard replaced a process that previously took 10–15 minutes per product lookup. It now acts as the primary purchasing reference for a buying team, with direct downstream effects on margin and supplier relationships."
  },
  "employee-app": {
    title: "Employee App",
    status: "Concept",
    subtitle: "Internal hospitality operations platform",
    challenge: "In most hospitality venues, operational knowledge lives in messaging apps, folders nobody maintains and conversations that disappear. New starters have no single place to learn how things work, and experienced staff can't easily share what they know. The result is inconsistency that shows up in service.",
    approach: "The concept was built around a simple premise: one app that replaces the group chat, the shared drive and the printed handbook. Mobile-first because that's where hospitality staff actually are. Structured enough to find things fast, open enough that staff actually contribute to it.",
    solution: "The app brings together news and shift updates, a living employee handbook, task management, inventory tools and internal communication — in a single interface designed for phones, not desktop browsers. Managers can push updates to everyone; staff can surface issues without waiting for a meeting.",
    outcome: "The project demonstrates a practical approach to the internal tooling problem in service industries — where the people who need information most are the least likely to be at a desk. A working prototype is in development."
  },
  "portfolio": {
    title: "Portfolio Website",
    status: "Live",
    subtitle: "Design system, typography and interaction design",
    challenge: "Most portfolios read as catalogues: grid of thumbnails, click to open, read a paragraph, close. The format puts the burden on the visitor to construct a sense of the person from fragments. The goal here was to make the site itself part of the work — so the first thing a visitor encounters is already demonstrating what the portfolio is trying to show.",
    approach: "The design started with the collage format: overlapping, rotated cards that can be physically picked up and moved. Typography was treated as the primary visual material, not a container for it. The motion system was built with the same rigour as a production application — no janky transitions, no layout shifts, no battery-draining animation loops.",
    solution: "The site uses a custom design system built entirely in CSS custom properties, with a motion architecture optimised for mobile Safari. Cards respond to touch with realistic drag physics. The case study framework is reusable across projects. The whole thing builds statically and deploys in under a minute.",
    outcome: "The portfolio does what it sets out to: it shows the work, and it is the work. It has opened conversations with people who reached out specifically because of how the site itself was made."
  }
};

export function generateStaticParams() {
  return order.map((slug) => ({ slug }));
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = caseStudies[slug];

  if (!project) {
    notFound();
  }

  const listing = projectIndex.find((item) => item.slug === slug);
  const current = Math.max(order.indexOf(slug), 0);
  const prevSlug = order[(current - 1 + order.length) % order.length];
  const nextSlug = order[(current + 1) % order.length];
  const prevProject = caseStudies[prevSlug];
  const nextProject = caseStudies[nextSlug];

  return (
    <main className="case-study">
      <section className="case-hero case-panel">
        <div className="case-hero-copy">
          <div className="case-kicker">{project.status}</div>
          <h1>{project.title}</h1>
          <p className="case-subtitle">{project.subtitle}</p>
        </div>

        <aside className="case-meta-panel" aria-label="Project details">
          <div>
            <span>Project</span>
            <strong>{String(current + 1).padStart(2, "0")}</strong>
          </div>
          <div>
            <span>Category</span>
            <strong>{listing?.category}</strong>
          </div>
          <div>
            <span>Year</span>
            <strong>{listing?.year}</strong>
          </div>
        </aside>
      </section>

      <figure className="case-showcase case-media-frame">
        <img src="https://picsum.photos/1600/900?10" alt="" width="1600" height="900" decoding="async" fetchPriority="high" />
      </figure>

      <section className="case-split">
        <div className="case-copy-card">
          <span className="case-section-label">01 / CHALLENGE</span>
          <h2>Challenge</h2>
          <p>{project.challenge}</p>
        </div>
        <figure className="case-media-frame">
          <img src="https://picsum.photos/900/1100?11" alt="" width="900" height="1100" loading="lazy" decoding="async" />
        </figure>
      </section>

      <section className="case-split case-split-reverse">
        <figure className="case-media-frame">
          <img src="https://picsum.photos/900/1100?12" alt="" width="900" height="1100" loading="lazy" decoding="async" />
        </figure>
        <div className="case-copy-card">
          <span className="case-section-label">02 / APPROACH</span>
          <h2>Approach</h2>
          <p>{project.approach}</p>
        </div>
      </section>

      <section className="case-wide-copy case-copy-card case-copy-card-large">
        <span className="case-section-label">03 / SOLUTION</span>
        <h2>Solution</h2>
        <p>{project.solution}</p>
      </section>

      <section className="case-gallery" aria-label="Project gallery">
        <figure className="case-media-frame">
          <img src="https://picsum.photos/1200/800?13" alt="" width="1200" height="800" loading="lazy" decoding="async" />
        </figure>
        <figure className="case-media-frame">
          <img src="https://picsum.photos/1200/800?14" alt="" width="1200" height="800" loading="lazy" decoding="async" />
        </figure>
        <figure className="case-media-frame">
          <img src="https://picsum.photos/1200/800?15" alt="" width="1200" height="800" loading="lazy" decoding="async" />
        </figure>
      </section>

      <section className="case-wide-copy case-copy-card case-copy-card-large">
        <span className="case-section-label">04 / OUTCOME</span>
        <h2>Outcome</h2>
        <p>{project.outcome}</p>
      </section>

      <nav className="case-nav" aria-label="Project navigation">
        <Link href={`/projects/${prevSlug}`}>
          <small>Previous Project</small>
          <span>{prevProject.title}</span>
        </Link>
        <Link href={`/projects/${nextSlug}`}>
          <small>Next Project</small>
          <span>{nextProject.title}</span>
        </Link>
      </nav>
    </main>
  );
}
