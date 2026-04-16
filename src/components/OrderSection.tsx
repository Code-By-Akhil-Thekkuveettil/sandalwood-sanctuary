import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import heroProduct from "@/assets/hero-product.jpg";

export default function OrderSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="order" ref={ref} className="relative py-32 md:py-48">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-4 text-sm tracking-[0.3em] uppercase text-primary">Elevate Your Space</p>
          <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            Own the <span className="text-gradient-gold">experience</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="mx-auto mt-16 max-w-sm perspective-1000"
        >
          <div className="preserve-3d rounded-2xl border border-border bg-card/60 p-8 glow-gold backdrop-blur-sm">
            <img
              src={heroProduct}
              alt="Sandal 1 Box Black Premium"
              loading="lazy"
              width={1024}
              height={1024}
              className="mx-auto w-48 rounded-lg"
            />
            <h3 className="mt-6 font-display text-2xl font-bold text-foreground">Sandal 1 Box Black</h3>
            <p className="mt-1 text-sm text-muted-foreground">Premium Incense Stick · 20 Sticks</p>
            <p className="mt-4 font-display text-3xl font-bold text-gradient-gold">₹499</p>
            <button className="mt-6 w-full rounded-full bg-gradient-gold px-8 py-3 text-sm font-semibold tracking-wider uppercase text-primary-foreground transition-transform hover:scale-105 active:scale-95">
              Order Now
            </button>
            <p className="mt-3 text-xs text-muted-foreground">Free shipping across India</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
