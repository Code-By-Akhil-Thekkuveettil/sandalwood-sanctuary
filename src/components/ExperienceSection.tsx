import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import incenseBurning from "@/assets/incense-burning.jpg";

export default function ExperienceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" ref={ref} className="relative py-32 md:py-48">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 md:grid-cols-2 md:gap-24">
          {/* Text */}
          <div>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-4 text-sm tracking-[0.3em] uppercase text-primary"
            >
              The Experience
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl"
            >
              Fragrance that{" "}
              <span className="text-gradient-gold">transcends</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground"
            >
              Each stick burns for up to 45 minutes, releasing layers of warm, woody sandalwood 
              that evolve beautifully over time — from bright top notes to a deep, meditative base.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-10 flex gap-12"
            >
              {[
                { value: "45", unit: "min", label: "Burn time" },
                { value: "100%", unit: "", label: "Natural" },
                { value: "0", unit: "", label: "Chemicals" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl font-bold text-gradient-gold">
                    {stat.value}
                    <span className="text-lg">{stat.unit}</span>
                  </p>
                  <p className="mt-1 text-xs tracking-widest uppercase text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Image with 3D tilt */}
          <motion.div
            initial={{ opacity: 0, x: 60, rotateY: -8 }}
            animate={inView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="perspective-1000"
          >
            <div className="preserve-3d overflow-hidden rounded-2xl glow-gold">
              <img
                src={incenseBurning}
                alt="Burning sandalwood incense sticks with golden smoke"
                loading="lazy"
                width={1280}
                height={720}
                className="w-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
