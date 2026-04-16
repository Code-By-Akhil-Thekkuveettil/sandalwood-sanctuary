import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const steps = [
  { num: "01", title: "Prepare", desc: "Find a calm space. Place the stick in a heat-resistant holder on a stable surface." },
  { num: "02", title: "Ignite", desc: "Light the tip of the incense stick. Allow the flame to burn for 10 seconds, then gently blow it out." },
  { num: "03", title: "Breathe", desc: "Let the warm sandalwood aroma fill the room. Close your eyes and embrace the tranquility." },
];

export default function RitualSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section id="ritual" ref={sectionRef} className="relative overflow-hidden py-32 md:py-48">
      {/* Parallax ambient bg */}
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-radial opacity-40"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div ref={ref} className="mx-auto max-w-5xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-4 text-sm tracking-[0.3em] uppercase text-primary"
        >
          The Ritual
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl"
        >
          Three steps to <span className="text-gradient-gold">serenity</span>
        </motion.h2>

        <div className="mt-20 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.15 }}
              className="group relative rounded-2xl border border-border bg-card/40 p-8 text-left transition-all hover:border-primary/40 hover:bg-surface-elevated"
            >
              <span className="font-display text-5xl font-bold text-primary/20 transition-colors group-hover:text-primary/40">
                {s.num}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-foreground">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
