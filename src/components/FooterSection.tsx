export default function FooterSection() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 text-center">
        <p className="font-display text-lg tracking-wider text-gradient-gold">SANDAL 1</p>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Sandal 1. Premium Incense. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
