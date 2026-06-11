"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { projects } from "../data/projects";

export default function Home() {

  const activeCardRef = useRef(null);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll("[data-card-layer]"));
    const revealItems = Array.from(document.querySelectorAll("[data-reveal-motion]"));
    const sections = Array.from(document.querySelectorAll("[data-motion-section]"));

    let raf = 0;
    let scrollY = window.scrollY;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;

    const bringToFront = (card) => {
      cards.forEach((item, index) => {
        item.classList.remove("is-card-front");
        item.style.setProperty("--card-z", String(Number(item.dataset.baseZ || index + 1)));
      });
      card.classList.add("is-card-front");
      card.style.setProperty("--card-z", "700");
      activeCardRef.current = card;
    };

    const update = () => {
      raf = 0;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = (pointerX - centerX) / centerX;
      const moveY = (pointerY - centerY) / centerY;

      document.documentElement.style.setProperty("--scroll-y", `${scrollY}px`);
      document.documentElement.style.setProperty("--pointer-x", moveX.toFixed(4));
      document.documentElement.style.setProperty("--pointer-y", moveY.toFixed(4));

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const depth = Number(card.dataset.depth || 0);
        const rotate = Number(card.dataset.rotate || 0);
        const localX = ((pointerX - (rect.left + rect.width / 2)) / Math.max(rect.width, 1));
        const localY = ((pointerY - (rect.top + rect.height / 2)) / Math.max(rect.height, 1));
        const scrollMove = scrollY * depth * -0.035;
        const x = moveX * depth * 18;
        const y = scrollMove + moveY * depth * 12;
        const tiltX = localY * depth * -4;
        const tiltY = localX * depth * 5;

        card.style.setProperty("--px", `${x.toFixed(2)}px`);
        card.style.setProperty("--py", `${y.toFixed(2)}px`);
        card.style.setProperty("--r", `${rotate}deg`);
        card.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
      });

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, 1 - rect.top / window.innerHeight));
        section.style.setProperty("--section-progress", progress.toFixed(3));
      });
    };

    const requestUpdate = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    cards.forEach((card, index) => {
      card.style.setProperty("--card-z", String(Number(card.dataset.baseZ || index + 1)));
      card.style.setProperty("--stagger", `${index * 80}ms`);

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
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    revealItems.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${index * 55}ms`);
      observer.observe(item);
    });

    const onScroll = () => {
      scrollY = window.scrollY;
      requestUpdate();
    };

    const onPointerMove = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      requestUpdate();
    };

    const onOrientation = (event) => {
      if (typeof event.gamma === "number") {
        pointerX = window.innerWidth / 2 + event.gamma * 10;
        pointerY = window.innerHeight / 2 + (event.beta || 0) * 4;
        requestUpdate();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("deviceorientation", onOrientation, { passive: true });

    requestAnimationFrame(() => {
      document.body.classList.add("motion-ready");
      update();
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("deviceorientation", onOrientation);
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);



  return (
    <main className="site-home">
      <section className="home-hero" aria-label="Portfolio introduction">
        <article className="hero-card hero-card-main">
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

        <article className="hero-card hero-card-strategy">
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

        <article className="hero-card hero-card-profile">
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

      <section className="work-section" id="case-studies">
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
              className={`project-card project-card-${index + 1} motion-card`} data-card-layer data-base-z={20 + index} data-depth={0.35 + index * 0.12} data-rotate={index % 2 ? 2 : -2}
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

      <section className="services-section" id="services">
        <div className="background-word">SERVICES</div>
        <div className="section-heading">
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

      <section className="about-section" id="about">
        <span>03 / Profile</span>
        <p>
          I build visual systems, mobile-first web apps, editorial interfaces and experimental digital identities with a focus on typography, atmosphere and interaction.
        </p>
        <a href="mailto:izakhyllested@icloud.com">Contact</a>
      </section>
    </main>
  );
}
