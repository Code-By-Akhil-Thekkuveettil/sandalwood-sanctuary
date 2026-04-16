import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import sandalwoodImg from "@/assets/sandalwood-ingredient.jpg";

const features = [
  {
    title: "Mysore Sandalwood",
    desc: "Sourced from centuries-old sandalwood forests, prized for their unparalleled aromatic richness.",
  },
  {
    title: "Hand-Rolled",
    desc: "Each stick is meticulously crafted by artisans using traditional techniques passed down through generations.",
  },
  {
    title: "Charcoal-Free",
    desc: "Pure masala blend without charcoal ensures a cleaner burn and an authentic, unadulterated fragrance.",
  },
  {
    title: "Eco Packaging",
    desc: "Premium matte-black box crafted from recycled materials. Luxury that respects the earth.",
  },
];

export default function CraftSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="craft" ref={ref} className="relative py-32 md:py-48">
      {/* Decorative line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="mb-4 text-sm tracking-[0.3em] uppercase text-primary">The Craft</p>
          <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            Born from <span className="text-gradient-gold">nature</span>
          </h2>
        </motion.div>

        <div className="mt-20 grid gap-16 md:grid-cols-2 md:gap-20">
          {/* Ingredient image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 8 }}
            animate={inView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="perspective-1000"
          >
            <div className="preserve-3d overflow-hidden rounded-2xl">
              <img
                src={sandalwoodImg}
                alt="Premium sandalwood raw material"
                loading="lazy"
                width={800}
                height={800}
                className="w-full object-cover"
              />
            </div>
          </motion.div>

          {/* Features grid */}
          <div className="flex flex-col justify-center gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: 40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
                className="group rounded-xl border border-border bg-card/50 p-6 transition-all hover:border-primary/40 hover:bg-surface-elevated"
              >
                <h3 className="font-display text-lg font-semibold text-foreground transition-colors group-hover:text-gradient-gold">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
