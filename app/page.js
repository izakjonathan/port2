"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { projects } from "../data/projects";

export default function Home() {

  const activeCardRef = useRef(null);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll("[data-card-layer]"));
    const revealItems = Array.from(document.querySelectorAll("[data-reveal-motion]"));

    let raf = 0;
    let scrollY = window.scrollY;

    const bringToFront = (card) => {
      cards.forEach((item, index) => {
        item.classList.remove("is-card-front");
        item.style.setProperty("--card-z", String(Number(item.dataset.baseZ || index + 1)));
      });

      card.classList.add("is-card-front");
      card.style.setProperty("--card-z", "900");
      activeCardRef.current = card;
    };

    const update = () => {
      raf = 0;
      document.documentElement.style.setProperty("--scroll-y", `${scrollY}px`);

      cards.forEach((card) => {
        const depth = Number(card.dataset.depth || 0);
        const rect = card.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const cardCenter = rect.top + rect.height / 2;
        const distance = (cardCenter - viewportCenter) / window.innerHeight;
        const lift = Math.max(-18, Math.min(18, distance * depth * -28));

        card.style.setProperty("--motion-lift", `${lift.toFixed(2)}px`);
      });
    };

    const requestUpdate = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    cards.forEach((card, index) => {
      const baseZ = Number(card.dataset.baseZ || index + 1);
      card.style.setProperty("--card-z", String(baseZ));
      card.style.setProperty("--stagger", `${index * 75}ms`);

      card.addEventListener("click", (event) => {
        if (activeCardRef.current !== card) {
          event.preventDefault();
          event.stopPropagation();
          bringToFront(card);
        }
      }, true);

      card.addEventListener("pointerdown", () => {
        if (activeCardRef.current !== card) bringToFront(card);
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-revealed");
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -4% 0px" });

    revealItems.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${index * 55}ms`);
      observer.observe(item);
    });

    const onScroll = () => {
      scrollY = window.scrollY;
      requestUpdate();
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    requestAnimationFrame(() => {
      document.body.classList.add("motion-ready");
      update();
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);





  return (
    <main className="site-home">
      <section className="home-hero" data-motion-section aria-label="Portfolio introduction">
        <article className="hero-card hero-card-main motion-card">
          <div className="hero-card-meta" data-reveal-motion>
            <strong>Study/Clyb</strong>
            <span>Search Work</span>
            <span>Menu</span>
          </div>

          <h1>
            <span>Turning Ideas</span>
            Into Visual Systems And Digital Products.
          </h1>
        </article>

        <article className="hero-card hero-card-strategy motion-card">
          <div className="strategy-count">
            12 <span>/12</span>
          </div>
          <h2>
            Strategy
            <br />
            <span>Session</span>
          </h2>
          <p>Graphic design, logos, layouts and creative direction.</p>
        </article>

        <article className="hero-card hero-card-profile motion-card">
          <div className="profile-dots">•••</div>
          <div className="profile-dot" />
          <div className="level-ring">
            <span>45</span>
            <small>Level</small>
          </div>
          <div className="done-count">
            <small>Done</small>
            <span>21</span>
          </div>
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

      <section className="work-section" data-motion-section data-reveal-motion id="case-studies">
        <div className="background-word" data-reveal-motion>WORK</div>
        <div className="section-heading" data-reveal-motion>
          <span>01</span>
          <h2>Case Studies</h2>
          <Link href="/projects">Archive</Link>
        </div>

        <div className="project-card-stage">
          {projects.map((project, index) => (
            <Link
              href={`/projects/${project.slug}`}
              className={`project-card project-card-${index + 1} motion-card`} data-card-layer data-base-z={90 + index} data-depth={0.7 + index * 0.16} data-rotate={index % 2 ? 3 : -3} data-reveal-motion>
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

      <section className="services-section" data-motion-section data-reveal-motion id="services">
        <div className="background-word" data-reveal-motion>SERVICES</div>
        <div className="section-heading" data-reveal-motion>
          <span>02</span>
          <h2>Services</h2>
          <span>Objects</span>
        </div>

        <div className="service-card-stage">
          <article className="service-card service-card-graphic">
            <span>01</span>
            <h3>Graphic Design</h3>
            <p>Logos, typography, menus, posters, print systems and visual identity.</p>
          </article>

          <article className="service-card service-card-web">
            <span>02</span>
            <h3>Web Design</h3>
            <p>Editorial websites, portfolios, landing pages and interaction-led layouts.</p>
          </article>

          <article className="service-card service-card-dev">
            <span>03</span>
            <h3>Development</h3>
            <p>Next.js builds, dashboards, custom tools, automation and deployment.</p>
          </article>

          <article className="service-card service-card-editorial">
            <span>04</span>
            <h3>Editorial</h3>
            <p>Reports, presentations, publications and information design.</p>
          </article>
        </div>
      </section>

      <section className="about-section" data-motion-section data-reveal-motion id="about">
        <span>03 / Profile</span>
        <p>
          I build visual systems, mobile-first web apps, editorial interfaces and experimental digital identities with a focus on typography, atmosphere and interaction.
        </p>
        <a href="mailto:izakhyllested@icloud.com">Contact</a>
      </section>
    </main>
  );
}
