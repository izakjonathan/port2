"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { projects } from "../data/projects";

export default function Home() {

  const activeCardRef = useRef(null);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll("[data-card-layer]"));
    const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));

    let raf = 0;
    let running = true;
    let scrollY = window.scrollY;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;

    const bringToFront = (card) => {
      cards.forEach((item, index) => {
        item.classList.remove("is-front");
        item.style.setProperty("--z", String(Number(item.dataset.baseZ || index + 1)));
      });

      card.classList.add("is-front");
      card.style.setProperty("--z", "900");
      activeCardRef.current = card;
    };

    const frame = (time) => {
      if (!running) return;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const mx = (pointerX - centerX) / centerX;
      const my = (pointerY - centerY) / centerY;

      cards.forEach((card, index) => {
        const depth = Number(card.dataset.depth || 1);
        const phase = Number(card.dataset.phase || index * 0.75);
        const floatX = Math.cos(time / 1100 + phase) * depth * 3.5;
        const floatY = Math.sin(time / 850 + phase) * depth * 7;
        const pointerMoveX = mx * depth * 7;
        const pointerMoveY = my * depth * 6;
        const scrollMove = Math.max(-12, Math.min(12, scrollY * depth * -0.012));

        card.style.setProperty("--mx", `${(floatX + pointerMoveX).toFixed(2)}px`);
        card.style.setProperty("--my", `${(floatY + pointerMoveY + scrollMove).toFixed(2)}px`);
      });

      raf = requestAnimationFrame(frame);
    };

    cards.forEach((card, index) => {
      card.style.setProperty("--z", String(Number(card.dataset.baseZ || index + 1)));

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
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    }, { threshold: 0.1 });

    revealItems.forEach((item, index) => {
      item.style.setProperty("--delay", `${index * 55}ms`);
      observer.observe(item);
    });

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    const onPointerMove = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    document.body.classList.add("motion-ready");
    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main className="site-home">
      <section className="home-hero" aria-label="Portfolio introduction">
        <article className="hero-card hero-card-main" data-card-layer data-base-z="30" data-depth="1.05" data-phase="0" data-reveal>
          <div className="hero-card-meta">
            <strong>Study/Clyb</strong>
            <span>Search Work</span>
            <span>Menu</span>
          </div>

          <h1>
            <span>Turning Ideas</span>
            Into Visual Systems And Digital Products.
          </h1>
        </article>

        <article className="hero-card hero-card-strategy" data-card-layer data-base-z="65" data-depth="1.25" data-phase="1.4" data-reveal>
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

        <article className="hero-card hero-card-profile" data-card-layer data-base-z="20" data-depth=".85" data-phase="2.6" data-reveal>
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

      <section className="work-section" data-reveal id="case-studies">
        <div className="background-word">WORK</div>
        <div className="section-heading">
          <span>01</span>
          <h2>Case Studies</h2>
          <Link href="/projects">Archive</Link>
        </div>

        <div className="project-card-stage">
          {projects.map((project, index) => (
            <Link
              href={`/projects/${project.slug}`}
              className={`project-card project-card-${index + 1}`} data-card-layer data-base-z={90 + index} data-depth={0.65 + index * 0.12} data-phase={index * 0.8} data-reveal
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

      <section className="services-section" data-reveal id="services">
        <div className="background-word">SERVICES</div>
        <div className="section-heading">
          <span>02</span>
          <h2>Services</h2>
          <span>Objects</span>
        </div>

        <div className="service-card-stage">
          <article className="service-card service-card-graphic" data-card-layer data-base-z="120" data-depth=".8" data-phase="0.2" data-reveal>
            <span>01</span>
            <h3>Graphic Design</h3>
            <p>Logos, typography, menus, posters, print systems and visual identity.</p>
          </article>

          <article className="service-card service-card-web" data-card-layer data-base-z="125" data-depth="1" data-phase="1.1" data-reveal>
            <span>02</span>
            <h3>Web Design</h3>
            <p>Editorial websites, portfolios, landing pages and interaction-led layouts.</p>
          </article>

          <article className="service-card service-card-dev" data-card-layer data-base-z="130" data-depth=".9" data-phase="1.9" data-reveal>
            <span>03</span>
            <h3>Development</h3>
            <p>Next.js builds, dashboards, custom tools, automation and deployment.</p>
          </article>

          <article className="service-card service-card-editorial" data-card-layer data-base-z="115" data-depth=".75" data-phase="2.7" data-reveal>
            <span>04</span>
            <h3>Editorial</h3>
            <p>Reports, presentations, publications and information design.</p>
          </article>
        </div>
      </section>

      <section className="about-section" data-reveal id="about">
        <span>03 / Profile</span>
        <p>
          I build visual systems, mobile-first web apps, editorial interfaces and experimental digital identities with a focus on typography, atmosphere and interaction.
        </p>
        <a href="mailto:izakhyllested@icloud.com">Contact</a>
      </section>
    </main>
  );
}
