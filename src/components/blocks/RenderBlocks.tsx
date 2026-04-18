import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

type Block = { id: string; type: string; data: Record<string, any> };

export default function RenderBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b) => {
        const d = b.data ?? {};
        if (b.type === "hero") {
          return (
            <section key={b.id} className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
              {d.image && (
                <div className="absolute inset-0 z-0">
                  <img src={d.image} alt={d.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
                </div>
              )}
              <div className="relative z-10 px-6 text-center">
                {d.eyebrow && <p className="mb-4 text-sm uppercase tracking-[0.3em] text-primary">{d.eyebrow}</p>}
                {d.title && <h1 className="font-display text-5xl font-bold text-gradient-gold sm:text-7xl md:text-8xl">{d.title}</h1>}
                {d.subtitle && <p className="mt-3 text-lg uppercase tracking-widest text-foreground/90">{d.subtitle}</p>}
                {d.description && <p className="mx-auto mt-6 max-w-md text-muted-foreground">{d.description}</p>}
                {d.cta && (
                  <Link to="/products" className="mt-8 inline-block rounded-full bg-gradient-gold px-10 py-4 text-sm font-semibold uppercase tracking-widest text-primary-foreground glow-gold">
                    {d.cta}
                  </Link>
                )}
              </div>
            </section>
          );
        }
        if (b.type === "features") {
          return (
            <section key={b.id} className="py-24 px-6">
              <div className="mx-auto max-w-6xl text-center">
                {d.title && <h2 className="font-display text-4xl text-gradient-gold md:text-5xl">{d.title}</h2>}
                <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                  {(d.items ?? []).map((it: any, i: number) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                      className="rounded-2xl border border-border bg-card/40 p-8 backdrop-blur-sm">
                      <h3 className="font-display text-xl text-foreground">{it.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{it.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          );
        }
        if (b.type === "gallery") {
          return (
            <section key={b.id} className="py-24 px-6">
              <div className="mx-auto max-w-6xl">
                {d.title && <h2 className="text-center font-display text-4xl text-gradient-gold md:text-5xl">{d.title}</h2>}
                <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
                  {(d.images ?? []).map((url: string, i: number) => (
                    <img key={i} src={url} alt="" className="aspect-square w-full rounded-xl object-cover" />
                  ))}
                </div>
              </div>
            </section>
          );
        }
        if (b.type === "testimonials") {
          return (
            <section key={b.id} className="py-24 px-6">
              <div className="mx-auto max-w-5xl text-center">
                {d.title && <h2 className="font-display text-4xl text-gradient-gold md:text-5xl">{d.title}</h2>}
                <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
                  {(d.items ?? []).map((it: any, i: number) => (
                    <div key={i} className="rounded-2xl border border-border bg-card/40 p-8 text-left backdrop-blur-sm">
                      <p className="font-display text-lg text-foreground">"{it.quote}"</p>
                      <p className="mt-4 text-sm uppercase tracking-widest text-primary">— {it.author}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }
        if (b.type === "cta") {
          return (
            <section key={b.id} className="py-32 px-6 text-center">
              {d.title && <h2 className="font-display text-4xl text-gradient-gold md:text-5xl">{d.title}</h2>}
              {d.description && <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{d.description}</p>}
              {d.cta && (
                <Link to="/products" className="mt-8 inline-block rounded-full bg-gradient-gold px-10 py-4 text-sm font-semibold uppercase tracking-widest text-primary-foreground glow-gold">
                  {d.cta}
                </Link>
              )}
            </section>
          );
        }
        if (b.type === "text") {
          return (
            <section key={b.id} className="py-16 px-6">
              <div className="mx-auto max-w-3xl">
                {d.title && <h2 className="font-display text-3xl text-foreground">{d.title}</h2>}
                {d.body && <p className="mt-4 whitespace-pre-line text-muted-foreground">{d.body}</p>}
              </div>
            </section>
          );
        }
        return null;
      })}
    </>
  );
}
