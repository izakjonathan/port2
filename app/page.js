"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { projects } from "../data/projects";

export default function Home() {

  const activeCardRef = useRef(null);
  const dragFrameRef = useRef(null);
  const scrollFrameRef = useRef(null);
  const liftTimersRef = useRef([]);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll("[data-card-layer]"));
    const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
    const projectStack = document.querySelector("[data-project-stack]");
    const projectCards = projectStack
      ? Array.from(projectStack.querySelectorAll("[data-stack-card]"))
      : [];
    const menuNodes = Array.from(document.querySelectorAll(".fixed-menu"));

    let currentDrag = null;
    let lastScrollY = window.scrollY;
    let lastTapAt = 0;

    const resetCardLayers = () => {
      cards.forEach((card, index) => {
        card.classList.remove("is-front");
        card.style.setProperty("--z", String(Number(card.dataset.baseZ || index + 1)));
      });
    };

    const bringToFront = (card) => {
      resetCardLayers();
      card.classList.add("is-front", "is-lift-pop");
      card.style.setProperty("--z", "900");
      activeCardRef.current = card;

      const timer = window.setTimeout(() => {
        card.classList.remove("is-lift-pop");
      }, 260);
      liftTimersRef.current.push(timer);
    };

    const setDragVars = (card, x, y) => {
      card.style.setProperty("--drag-x", `${x.toFixed(2)}px`);
      card.style.setProperty("--drag-y", `${y.toFixed(2)}px`);
    };

    const clearDrag = (card) => {
      card.classList.remove("is-dragging");
      card.classList.add("is-releasing");
      setDragVars(card, 0, 0);

      window.setTimeout(() => {
        card.classList.remove("is-touching", "is-releasing");
      }, 180);
    };

    const updateScrollMotion = () => {
      scrollFrameRef.current = null;

      const scrollY = window.scrollY;
      const scrollingDown = scrollY > lastScrollY && scrollY > 72;
      lastScrollY = scrollY;

      menuNodes.forEach((menu) => {
        menu.classList.toggle("is-scroll-down", scrollingDown);
      });

      if (projectStack && projectCards.length) {
        const rect = projectStack.getBoundingClientRect();
        const viewportHeight = window.innerHeight || 1;
        const progress = Math.max(
          0,
          Math.min(1, (viewportHeight * 0.7 - rect.top) / Math.max(rect.height - viewportHeight * 0.45, 1))
        );

        projectCards.forEach((card, index) => {
          const step = progress * Math.max(projectCards.length - 1, 1);
          const active = Math.max(0, Math.min(1, step - index + 1));
          const y = (1 - active) * (18 + index * 3);
          const scale = 0.965 + active * 0.035;
          const opacity = 0.72 + active * 0.28;

          card.style.setProperty("--stack-y", `${y.toFixed(2)}px`);
          card.style.setProperty("--stack-scale", scale.toFixed(3));
          card.style.setProperty("--stack-opacity", opacity.toFixed(3));
        });
      }
    };

    const requestScrollMotion = () => {
      if (!scrollFrameRef.current) {
        scrollFrameRef.current = requestAnimationFrame(updateScrollMotion);
      }
    };

    cards.forEach((card, index) => {
      card.style.setProperty("--z", String(Number(card.dataset.baseZ || index + 1)));
      card.style.setProperty("--drag-x", "0px");
      card.style.setProperty("--drag-y", "0px");

      card.addEventListener("click", (event) => {
        const sameCard = activeCardRef.current === card;
        const didDrag = card.dataset.didDrag === "true";

        if (!sameCard || didDrag) {
          event.preventDefault();
          event.stopPropagation();
          bringToFront(card);
          card.dataset.didDrag = "false";
          lastTapAt = Date.now();
          return;
        }

        const now = Date.now();
        if (now - lastTapAt < 160) {
          event.preventDefault();
          event.stopPropagation();
        }
        lastTapAt = now;
      }, true);

      card.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;

        const rect = card.getBoundingClientRect();
        card.dataset.didDrag = "false";
        card.classList.remove("is-releasing");
        card.classList.add("is-touching");
        card.style.setProperty("--tap-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--tap-y", `${event.clientY - rect.top}px`);

        currentDrag = {
          card,
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          nextX: 0,
          nextY: 0,
          hasMoved: false,
        };

        try {
          card.setPointerCapture(event.pointerId);
        } catch {}
      });

      card.addEventListener("pointermove", (event) => {
        if (!currentDrag || currentDrag.card !== card || currentDrag.pointerId !== event.pointerId) return;

        const dx = event.clientX - currentDrag.startX;
        const dy = event.clientY - currentDrag.startY;

        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
          card.dataset.didDrag = "true";
          card.classList.add("is-dragging");

          if (!currentDrag.hasMoved) {
            currentDrag.hasMoved = true;
            bringToFront(card);
          }
        }

        currentDrag.nextX = Math.max(-30, Math.min(30, dx * 0.22));
        currentDrag.nextY = Math.max(-24, Math.min(24, dy * 0.18));

        if (!dragFrameRef.current) {
          dragFrameRef.current = requestAnimationFrame(() => {
            dragFrameRef.current = null;
            if (currentDrag) {
              setDragVars(currentDrag.card, currentDrag.nextX, currentDrag.nextY);
            }
          });
        }
      });

      card.addEventListener("pointerup", (event) => {
        if (!currentDrag || currentDrag.card !== card || currentDrag.pointerId !== event.pointerId) return;
        clearDrag(card);
        currentDrag = null;
      });

      card.addEventListener("pointercancel", () => {
        clearDrag(card);
        currentDrag = null;
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });

    revealItems.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${Math.min(index * 45, 260)}ms`);
      observer.observe(item);
    });

    const onScroll = () => {
      requestScrollMotion();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.body.classList.add("motion-ready");
    requestScrollMotion();

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      liftTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      liftTimersRef.current = [];
      if (dragFrameRef.current) cancelAnimationFrame(dragFrameRef.current);
      if (scrollFrameRef.current) cancelAnimationFrame(scrollFrameRef.current);
    };
  }, []);



  return (
    <main className="site-home">
      <section className="home-hero" aria-label="Portfolio introduction">
        <article className="hero-card hero-card-main" data-card-layer data-base-z="30" data-depth="1" data-reveal>
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

        <article className="hero-card hero-card-strategy" data-card-layer data-base-z="65" data-depth="1.12" data-reveal>
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

        <article className="hero-card hero-card-profile" data-card-layer data-base-z="20" data-depth=".9" data-reveal>
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
        <div className="section-heading" data-reveal>
          <span>01</span>
          <h2>Case Studies</h2>
          <Link href="/projects">Archive</Link>
        </div>

        <div className="project-card-stage" data-project-stack>
          {projects.map((project, index) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className={`project-card project-card-${index + 1}`}
              data-card-layer
              data-stack-card
              data-base-z={90 + index}
              data-depth={0.7 + index * 0.08}
              data-reveal
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
        <div className="background-word" data-reveal>SERVICES</div>
        <div className="section-heading" data-reveal>
          <span>02</span>
          <h2>Services</h2>
          <span>Objects</span>
        </div>

        <div className="service-card-stage">
          <article className="service-card service-card-graphic" data-card-layer data-base-z="120" data-depth=".8" data-reveal>
            <span>01</span>
            <h3>Graphic Design</h3>
            <p>Logos, typography, menus, posters, print systems and visual identity.</p>
          </article>

          <article className="service-card service-card-web" data-card-layer data-base-z="125" data-depth=".95" data-reveal>
            <span>02</span>
            <h3>Web Design</h3>
            <p>Editorial websites, portfolios, landing pages and interaction-led layouts.</p>
          </article>

          <article className="service-card service-card-dev" data-card-layer data-base-z="130" data-depth=".9" data-reveal>
            <span>03</span>
            <h3>Development</h3>
            <p>Next.js builds, dashboards, custom tools, automation and deployment.</p>
          </article>

          <article className="service-card service-card-editorial" data-card-layer data-base-z="115" data-depth=".75" data-reveal>
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
