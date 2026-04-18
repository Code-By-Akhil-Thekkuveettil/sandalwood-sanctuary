import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Shop", to: "/products" as const },
    { label: "Story", href: "/#experience" },
    { label: "Craft", href: "/#craft" },
    { label: "Ritual", href: "/#ritual" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-xl tracking-wider text-gradient-gold">
          SANDAL 1
        </Link>

        <div className="hidden gap-8 md:flex">
          {links.map((l) =>
            "to" in l ? (
              <Link key={l.label} to={l.to} className="text-sm tracking-widest uppercase text-muted-foreground transition-colors hover:text-primary">
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={l.href} className="text-sm tracking-widest uppercase text-muted-foreground transition-colors hover:text-primary">
                {l.label}
              </a>
            )
          )}
          <Link to="/auth" className="text-sm tracking-widest uppercase text-muted-foreground transition-colors hover:text-primary">
            Account
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-6 bg-foreground transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 bg-foreground transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-foreground transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {links.map((l) =>
                "to" in l ? (
                  <Link key={l.label} to={l.to} onClick={() => setMobileOpen(false)} className="text-lg tracking-widest uppercase text-muted-foreground hover:text-primary">{l.label}</Link>
                ) : (
                  <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)} className="text-lg tracking-widest uppercase text-muted-foreground hover:text-primary">{l.label}</a>
                )
              )}
              <Link to="/auth" onClick={() => setMobileOpen(false)} className="text-lg tracking-widest uppercase text-muted-foreground hover:text-primary">Account</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
