import Link from "next/link";

export default function Nav() {
  return (
    <>
      <header className="fixed-menu fixed-menu-header">
        <div className="fixed-menu-inner">
          <Link href="/" className="fixed-menu-link fixed-menu-brand">
            IZAK HYLLESTED
          </Link>
          <a href="#about" className="fixed-menu-link">
            ABOUT
          </a>
        </div>
      </header>

      <footer className="fixed-menu fixed-menu-footer">
        <div className="fixed-menu-inner">
          <a href="mailto:izakhyllested@icloud.com" className="fixed-menu-link">
            CONTACT
          </a>
          <Link href="/projects" className="fixed-menu-link">
            PROJECTS
          </Link>
        </div>
      </footer>
    </>
  );
}
