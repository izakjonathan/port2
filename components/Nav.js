import Link from "next/link";

export default function Nav() {
  return (
    <>
      <header className="site-menu site-menu-top" data-ref="MENU-H — Fixed Header">
        <div className="site-menu-inner">
          <Link href="/" className="site-menu-link site-menu-brand" data-ref="H1 — Identity">
            IZAK HYLLESTED
          </Link>
          <a href="#about" className="site-menu-link" data-ref="H2 — About">
            ABOUT
          </a>
        </div>
      </header>

      <footer className="site-menu site-menu-bottom" data-ref="MENU-F — Fixed Footer">
        <div className="site-menu-inner">
          <a href="mailto:izakhyllested@icloud.com" className="site-menu-link" data-ref="F1 — Contact">
            CONTACT
          </a>
          <Link href="/projects" className="site-menu-link" data-ref="F2 — Projects">
            PROJECTS
          </Link>
        </div>
      </footer>
    </>
  );
}
