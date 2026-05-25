import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer className="border-t bg-muted/35">
      <div className="container flex flex-col gap-5 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Link
            href="/"
            className="block font-semibold tracking-normal text-foreground"
          >
            Statoma
          </Link>
          <p>© 2026 Statoma</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
