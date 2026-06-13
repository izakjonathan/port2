"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { projects } from "../data/projects";

export default function Home() {

  const activeCardRef = useRef(null);
  const dragFrameRef = useRef(null);
  const scrollFrameRef = useRef(null);
  const paraFrameRef = useRef(null);
  const floatFrameRef = useRef(null);
  const liftTimersRef = useRef([]);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll("[data-card-layer]"));
    const heroCards = Array.from(document.querySelectorAll(".hero-card"));
    const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
    const projectStack = document.querySelector("[data-project-stack]");
    const projectCards = projectStack
      ? Array.from(projectStack.querySelectorAll("[data-stack-card]"))
      : [];
    const menuNodes = Array.from(document.querySelectorAll(".fixed-menu"));
    const heroSection = document.querySelector(".home-hero");

    let currentDrag = null;
    let lastScrollY = window.scrollY;
    let lastTapAt = 0;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let heroMouseX = 0;
    let heroMouseY = 0;
    let isHeroHovered = false;
    let floatStart = performance.now();

    // ── Hero entrance ──────────────────────────────────────────────
    // Cards start invisible (CSS sets opacity:0 before motion-ready).
    // Stagger each hero card entrance with a direction-aware class.
    const entranceTimers = [];
    heroCards.forEach((card, i) => {
      if (prefersReducedMotion) {
        card.classList.add("is-hero-entered");
        return;
      }

      const delay = 120 + i * 110;
      const t = window.setTimeout(() => {
        card.classList.add("is-hero-entered");
      }, delay);
      entranceTimers.push(t);
    });

    // ── Helpers ────────────────────────────────────────────────────
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
      }, 120);
    };

    // ── Scroll motion ──────────────────────────────────────────────
    const updateScrollMotion = () => {
      scrollFrameRef.current = null;

      const scrollY = window.scrollY;
      const scrollingDown = scrollY > lastScrollY && scrollY > 72;
      lastScrollY = scrollY;

      if (!prefersReducedMotion) {
        menuNodes.forEach((menu) => {
          menu.classList.toggle("is-scroll-down", scrollingDown);
        });
      }

      if (!prefersReducedMotion && projectStack && projectCards.length) {
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

      if (!prefersReducedMotion && heroCards.length) {
        updateHeroScrollParallax(scrollY);
      }
    };

    const requestScrollMotion = () => {
      if (!scrollFrameRef.current) {
        scrollFrameRef.current = requestAnimationFrame(updateScrollMotion);
      }
    };

    // ── Mouse parallax (desktop hero only) ────────────────────────
    const updateParallax = () => {
      paraFrameRef.current = null;
      if (!isHeroHovered) return;

      heroCards.forEach((card) => {
        if (currentDrag?.card === card) return; // skip card being dragged

        const depth = parseFloat(card.dataset.depth || "1");
        const rect = card.getBoundingClientRect();
        const cardCx = rect.left + rect.width / 2;
        const cardCy = rect.top + rect.height / 2;

        // Offset from card centre, scaled by depth, capped gently
        const dx = Math.max(-22, Math.min(22, (heroMouseX - cardCx) * 0.028 * depth));
        const dy = Math.max(-16, Math.min(16, (heroMouseY - cardCy) * 0.022 * depth));

        // Tilt: opposite direction to offset (card faces cursor)
        const tiltX = Math.max(-5, Math.min(5, -(heroMouseY - cardCy) * 0.006 * depth));
        const tiltY = Math.max(-6, Math.min(6,  (heroMouseX - cardCx) * 0.006 * depth));

        card.style.setProperty("--para-x", `${dx.toFixed(2)}px`);
        card.style.setProperty("--para-y", `${dy.toFixed(2)}px`);
        card.style.setProperty("--para-rx", `${tiltX.toFixed(2)}deg`);
        card.style.setProperty("--para-ry", `${tiltY.toFixed(2)}deg`);
      });
    };

    const requestParallax = () => {
      if (prefersReducedMotion) return;
      if (!paraFrameRef.current) {
        paraFrameRef.current = requestAnimationFrame(updateParallax);
      }
    };

    const clearParallax = () => {
      heroCards.forEach((card) => {
        card.style.setProperty("--para-x", "0px");
        card.style.setProperty("--para-y", "0px");
        card.style.setProperty("--para-rx", "0deg");
        card.style.setProperty("--para-ry", "0deg");
      });
    };

    const onHeroMouseMove = (event) => {
      heroMouseX = event.clientX;
      heroMouseY = event.clientY;
      isHeroHovered = true;
      requestParallax();
    };

    const onHeroMouseLeave = () => {
      isHeroHovered = false;
      clearParallax();
    };

    if (!prefersReducedMotion && heroSection) {
      heroSection.addEventListener("mousemove", onHeroMouseMove, { passive: true });
      heroSection.addEventListener("mouseleave", onHeroMouseLeave);
    }

    // ── Ambient hero float + scroll parallax ───────────────────────
    // This is intentionally limited to the three hero cards. It writes to
    // dedicated CSS variables that are already part of each card transform,
    // so it does not compete with tap/drag/front-card motion.
    const heroFloatProfiles = [
      { x: 2.8, y: 4.6, r: 0.22, speed: 0.00072, phase: 0.2, sx: -0.018, sy: 0.030, sr: -0.006 },
      { x: 3.8, y: 3.2, r: 0.26, speed: 0.00092, phase: 2.1, sx: 0.024, sy: -0.022, sr: 0.007 },
      { x: 3.2, y: 4.0, r: 0.20, speed: 0.00080, phase: 4.0, sx: 0.016, sy: 0.026, sr: 0.005 },
    ];

    const updateHeroScrollParallax = (scrollY = window.scrollY) => {
      const maxScroll = Math.min(Math.max(scrollY, 0), 620);

      heroCards.forEach((card, index) => {
        const profile = heroFloatProfiles[index] || heroFloatProfiles[0];
        if (currentDrag?.card === card) return;

        const sx = Math.max(-14, Math.min(14, maxScroll * profile.sx));
        const sy = Math.max(-18, Math.min(18, maxScroll * profile.sy));
        const sr = Math.max(-3, Math.min(3, maxScroll * profile.sr));

        card.style.setProperty("--scroll-x", `${sx.toFixed(2)}px`);
        card.style.setProperty("--scroll-y", `${sy.toFixed(2)}px`);
        card.style.setProperty("--scroll-r", `${sr.toFixed(2)}deg`);
      });
    };

    const updateHeroFloat = (now) => {
      if (prefersReducedMotion) return;

      const elapsed = now - floatStart;

      heroCards.forEach((card, index) => {
        const profile = heroFloatProfiles[index] || heroFloatProfiles[0];
        if (currentDrag?.card === card) return;

        const wave = elapsed * profile.speed + profile.phase;
        const x = Math.sin(wave) * profile.x;
        const y = Math.cos(wave * 0.86) * profile.y;
        const r = Math.sin(wave * 0.72) * profile.r;

        card.style.setProperty("--float-x", `${x.toFixed(2)}px`);
        card.style.setProperty("--float-y", `${y.toFixed(2)}px`);
        card.style.setProperty("--float-r", `${r.toFixed(3)}deg`);
      });

      floatFrameRef.current = requestAnimationFrame(updateHeroFloat);
    };

    const clearHeroAmbientMotion = () => {
      heroCards.forEach((card) => {
        card.style.setProperty("--float-x", "0px");
        card.style.setProperty("--float-y", "0px");
        card.style.setProperty("--float-r", "0deg");
        card.style.setProperty("--scroll-x", "0px");
        card.style.setProperty("--scroll-y", "0px");
        card.style.setProperty("--scroll-r", "0deg");
      });
    };

    if (!prefersReducedMotion && heroCards.length) {
      updateHeroScrollParallax();
      floatFrameRef.current = requestAnimationFrame(updateHeroFloat);
    }

    // ── Card event listeners ───────────────────────────────────────
    cards.forEach((card, index) => {
      card.style.setProperty("--z", String(Number(card.dataset.baseZ || index + 1)));
      card.style.setProperty("--drag-x", "0px");
      card.style.setProperty("--drag-y", "0px");
      card.style.setProperty("--para-x", "0px");
      card.style.setProperty("--para-y", "0px");
      card.style.setProperty("--para-rx", "0deg");
      card.style.setProperty("--para-ry", "0deg");
      card.style.setProperty("--float-x", "0px");
      card.style.setProperty("--float-y", "0px");
      card.style.setProperty("--float-r", "0deg");
      card.style.setProperty("--scroll-x", "0px");
      card.style.setProperty("--scroll-y", "0px");
      card.style.setProperty("--scroll-r", "0deg");

      card.addEventListener("contextmenu", (e) => e.preventDefault());

      // Hover (desktop only — CSS guards with @media hover:hover)
      card.addEventListener("mouseenter", () => {
        if (!currentDrag) card.classList.add("is-hover");
      });
      card.addEventListener("mouseleave", () => {
        card.classList.remove("is-hover");
      });

      card.addEventListener("click", (event) => {
        const sameCard = activeCardRef.current === card;
        const didDrag = card.dataset.didDrag === "true";
        const href = card.dataset.cardHref;

        event.preventDefault();
        event.stopPropagation();

        if (!sameCard || didDrag) {
          bringToFront(card);
          card.dataset.didDrag = "false";
          lastTapAt = Date.now();
          return;
        }

        const now = Date.now();
        if (now - lastTapAt < 160) {
          lastTapAt = now;
          return;
        }

        lastTapAt = now;

        if (href) {
          window.location.href = href;
        }
      }, true);

      card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;

        const href = card.dataset.cardHref;
        if (!href) return;

        event.preventDefault();
        event.stopPropagation();

        if (activeCardRef.current !== card) {
          bringToFront(card);
          return;
        }

        window.location.href = href;
      });

      card.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;

        const rect = card.getBoundingClientRect();
        card.dataset.didDrag = "false";
        card.classList.remove("is-releasing", "is-hover");
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

    // ── Scroll reveal ──────────────────────────────────────────────
    let observer = null;

    if (prefersReducedMotion) {
      revealItems.forEach((item) => {
        item.classList.add("is-visible");
      });
    } else {
      observer = new IntersectionObserver((entries) => {
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
    }

    // ── Boot ───────────────────────────────────────────────────────
    if (!prefersReducedMotion) {
      window.addEventListener("scroll", requestScrollMotion, { passive: true });
      requestScrollMotion();
    }
    document.body.classList.add("motion-ready");

    return () => {
      window.removeEventListener("scroll", requestScrollMotion);
      if (observer) observer.disconnect();
      if (!prefersReducedMotion && heroSection) {
        heroSection.removeEventListener("mousemove", onHeroMouseMove);
        heroSection.removeEventListener("mouseleave", onHeroMouseLeave);
      }
      entranceTimers.forEach((t) => window.clearTimeout(t));
      liftTimersRef.current.forEach((t) => window.clearTimeout(t));
      liftTimersRef.current = [];
      if (dragFrameRef.current) cancelAnimationFrame(dragFrameRef.current);
      if (scrollFrameRef.current) cancelAnimationFrame(scrollFrameRef.current);
      if (paraFrameRef.current) cancelAnimationFrame(paraFrameRef.current);
      if (floatFrameRef.current) cancelAnimationFrame(floatFrameRef.current);
      clearHeroAmbientMotion();
    };
  }, []);

  return (
    <main id="main-content" className="site-home" tabIndex="-1">
      <section className="home-hero" aria-label="Portfolio introduction">
        <article className="hero-card hero-card-main" data-card-layer data-base-z="30" data-depth="1" data-reveal>
          <div className="hero-card-meta">
            <strong>Izak Hyllested</strong>
            <span>Design & Development</span>
            <span>2026</span>
          </div>

          <h1>
            <span>Design, Built</span>
            To Work As Well As It Looks.
          </h1>
        </article>

        <article className="hero-card hero-card-strategy" data-card-layer data-base-z="65" data-depth="1.12" data-reveal>
          <div className="strategy-count">
            5 <span>/5</span>
          </div>
          <h2>
            Projects
            <br />
            <span>Live</span>
          </h2>
          <p>Dashboards, apps, identity systems and this site.</p>
        </article>

        <article className="hero-card hero-card-profile" data-card-layer data-base-z="20" data-depth=".9" data-reveal>
          <div className="profile-dots">•••</div>
          <div className="profile-dot" />
          <div className="level-ring">
            <span>↗</span>
          </div>
          <div className="done-count">
            <small>Since</small>
            <span>&#8217;19</span>
          </div>
          <ul>
            <li><b>D</b>Design</li>
            <li><b>T</b>Typography</li>
            <li><b>M</b>Motion</li>
            <li><b>P</b>Product</li>
            <li><b>C</b>Code</li>
          </ul>
        </article>
      </section>

      <section className="work-section" data-reveal id="case-studies" aria-labelledby="case-studies-heading">
        <div className="background-word" data-reveal>WORK</div>
        <div className="section-heading" data-reveal>
          <span>01</span>
          <h2 id="case-studies-heading">Case Studies</h2>
          <Link href="/projects">Archive</Link>
        </div>

        <div className="project-card-stage" data-project-stack>
          {projects.map((project, index) => (
            <article
              key={project.slug}
              className={`project-card project-card-${index + 1}`}
              data-card-layer
              data-stack-card
              data-card-href={`/projects/${project.slug}`}
              data-base-z={90 + index}
              data-depth={0.7 + index * 0.08}
              data-reveal
              role="link"
              tabIndex="0"
              aria-label={`Open ${project.title}`}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <footer>
                <small>{project.category}</small>
                <small>{project.year}</small>
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section className="services-section" data-reveal id="services" aria-labelledby="services-heading">
        <div className="background-word" data-reveal>SERVICES</div>
        <div className="section-heading" data-reveal>
          <span>02</span>
          <h2 id="services-heading">Services</h2>
          <span>Available</span>
        </div>

        <div className="service-card-stage">
          <article className="service-card service-card-graphic" data-card-layer data-base-z="120" data-depth=".8" data-reveal>
            <span>01</span>
            <h3>Graphic Design</h3>
            <p>Identity, typography, print and visual systems built to last.</p>
          </article>

          <article className="service-card service-card-web" data-card-layer data-base-z="125" data-depth=".95" data-reveal>
            <span>02</span>
            <h3>Web Design</h3>
            <p>Editorial sites, portfolios and interaction-led layouts.</p>
          </article>

          <article className="service-card service-card-dev" data-card-layer data-base-z="130" data-depth=".9" data-reveal>
            <span>03</span>
            <h3>Development</h3>
            <p>Next.js builds, dashboards, custom tools and deployment.</p>
          </article>

          <article className="service-card service-card-editorial" data-card-layer data-base-z="115" data-depth=".75" data-reveal>
            <span>04</span>
            <h3>Editorial</h3>
            <p>Reports, publications and information design.</p>
          </article>
        </div>
      </section>

      <section className="about-section" data-reveal id="about" aria-label="Profile">
        <span>03 / Profile</span>
        <p>
          Visual systems, mobile-first web apps and editorial interfaces — made with care for typography, motion and the details that separate something finished from something done.
        </p>
        <a href="mailto:izakhyllested@icloud.com">Contact</a>
      </section>
    </main>
  );
}
