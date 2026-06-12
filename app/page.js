"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { projects } from "../data/projects";

export default function Home() {

  const activeCardRef = useRef(null);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll("[data-card-layer]"));
    const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
    const projectStack = document.querySelector("[data-project-stack]");
    const menuNodes = Array.from(document.querySelectorAll(".fixed-menu"));

    let currentDrag = null;
    let raf = 0;
    let running = true;
    let scrollY = window.scrollY;
    let lastScrollY = window.scrollY;
    let scrollDirection = "up";
    let lastTapTime = 0;

    const resetCardLayer = () => {
      cards.forEach((item, index) => {
        item.classList.remove("is-front");
        item.style.setProperty("--z", String(Number(item.dataset.baseZ || index + 1)));
      });
    };

    const bringToFront = (card) => {
      resetCardLayer();
      card.classList.add("is-front");
      card.style.setProperty("--z", "900");
      activeCardRef.current = card;
    };

    const snapBack = (card) => {
      card.classList.remove("is-dragging");
      card.style.setProperty("--drag-x", "0px");
      card.style.setProperty("--drag-y", "0px");
    };

    const updateProjectStack = () => {
      if (!projectStack) return;

      const rect = projectStack.getBoundingClientRect();
      const viewport = window.innerHeight;
      const raw = (viewport * 0.72 - rect.top) / Math.max(rect.height - viewport * 0.4, 1);
      const progress = Math.max(0, Math.min(1, raw));

      projectStack.style.setProperty("--stack-progress", progress.toFixed(4));

      const projectCards = Array.from(projectStack.querySelectorAll("[data-stack-card]"));
      projectCards.forEach((card, index) => {
        const count = Math.max(projectCards.length - 1, 1);
        const local = Math.max(0, Math.min(1, progress * count - index + 1));
        const stackY = (1 - local) * (22 + index * 4);
        const stackScale = 0.94 + local * 0.06;
        const stackOpacity = 0.55 + local * 0.45;

        card.style.setProperty("--stack-y", `${stackY.toFixed(2)}px`);
        card.style.setProperty("--stack-scale", stackScale.toFixed(3));
        card.style.setProperty("--stack-opacity", stackOpacity.toFixed(3));
      });
    };

    const updateMenuState = () => {
      const isDown = scrollDirection === "down" && scrollY > 70;
      menuNodes.forEach((menu) => {
        menu.classList.toggle("is-scroll-down", isDown);
        menu.classList.toggle("is-scroll-up", !isDown);
      });
    };

    const frame = (time) => {
      if (!running) return;

      cards.forEach((card, index) => {
        const depth = Number(card.dataset.depth || 1);
        const phase = Number(card.dataset.phase || index * 0.6);
        const floatX = Math.cos(time / 1250 + phase) * depth * 2.8;
        const floatY = Math.sin(time / 930 + phase) * depth * 6;
        const scrollLift = Math.max(-10, Math.min(10, scrollY * depth * -0.01));
        card.style.setProperty("--float-x", `${floatX.toFixed(2)}px`);
        card.style.setProperty("--float-y", `${(floatY + scrollLift).toFixed(2)}px`);
      });

      document.documentElement.style.setProperty("--ambient-y", `${Math.sin(time / 1800).toFixed(4)}`);
      document.documentElement.style.setProperty("--ambient-x", `${Math.cos(time / 2100).toFixed(4)}`);

      updateProjectStack();
      updateMenuState();

      raf = requestAnimationFrame(frame);
    };

    cards.forEach((card, index) => {
      card.style.setProperty("--z", String(Number(card.dataset.baseZ || index + 1)));
      card.style.setProperty("--drag-x", "0px");
      card.style.setProperty("--drag-y", "0px");

      card.addEventListener("click", (event) => {
        const isSameCard = activeCardRef.current === card;
        const moved = card.dataset.didDrag === "true";

        if (!isSameCard || moved) {
          event.preventDefault();
          event.stopPropagation();
          bringToFront(card);
          card.dataset.didDrag = "false";
          lastTapTime = Date.now();
          return;
        }

        const now = Date.now();
        if (now - lastTapTime < 180) {
          event.preventDefault();
          event.stopPropagation();
        }
        lastTapTime = now;
      }, true);

      card.addEventListener("pointerdown", (event) => {
        bringToFront(card);
        currentDrag = {
          card,
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
        };
        card.dataset.didDrag = "false";
        card.classList.add("is-touching");
        try {
          card.setPointerCapture(event.pointerId);
        } catch {}
      });

      card.addEventListener("pointermove", (event) => {
        if (!currentDrag || currentDrag.card !== card || currentDrag.pointerId !== event.pointerId) return;

        const dx = event.clientX - currentDrag.startX;
        const dy = event.clientY - currentDrag.startY;

        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
          card.dataset.didDrag = "true";
          card.classList.add("is-dragging");
        }

        const dragX = Math.max(-44, Math.min(44, dx * 0.34));
        const dragY = Math.max(-36, Math.min(36, dy * 0.26));
        card.style.setProperty("--drag-x", `${dragX.toFixed(2)}px`);
        card.style.setProperty("--drag-y", `${dragY.toFixed(2)}px`);
      });

      card.addEventListener("pointerup", (event) => {
        if (!currentDrag || currentDrag.card !== card || currentDrag.pointerId !== event.pointerId) return;
        card.classList.remove("is-touching");
        snapBack(card);
        currentDrag = null;
      });

      card.addEventListener("pointercancel", () => {
        card.classList.remove("is-touching");
        snapBack(card);
        currentDrag = null;
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    revealItems.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${index * 58}ms`);
      observer.observe(item);
    });

    const onScroll = () => {
      lastScrollY = scrollY;
      scrollY = window.scrollY;
      scrollDirection = scrollY > lastScrollY ? "down" : "up";
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.body.classList.add("motion-ready");
    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      window.removeEventListener("scroll", onScroll);
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
        <div className="background-word" data-reveal>WORK</div>
        <div className="section-heading" data-reveal data-reveal>
          <span>01</span>
          <h2>Case Studies</h2>
          <Link href="/projects">Archive</Link>
        </div>

        <div className="project-card-stage" data-project-stack>
          {projects.map((project, index) => (
            <Link
              href={`/projects/${project.slug}`}
              className={`project-card project-card-${index + 1}`} data-card-layer data-stack-card data-base-z={90 + index} data-depth={0.68 + index * 0.12} data-phase={index * 0.75} data-reveal>
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
        <div className="background-word" data-reveal>SERVICES</div>
        <div className="section-heading" data-reveal data-reveal>
          <span>02</span>
          <h2>Services</h2>
          <span>Objects</span>
        </div>

        <div className="service-card-stage">
          <article className="service-card service-card-graphic" data-card-layer data-base-z="120" data-depth=".85" data-phase="0.2" data-reveal>
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
