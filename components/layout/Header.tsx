import Link from "next/link";
import { MobileNav } from "@/components/layout/MobileNav";

export const navigationLinks = [
  { href: "/calculators", label: "Calculators" },
  { href: "/topics", label: "Topics" },
  { href: "/about", label: "About" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold tracking-normal text-foreground"
        >
          Statoma
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="md:hidden">
          <MobileNav links={navigationLinks} />
        </div>
      </div>
    </header>
  );
}
