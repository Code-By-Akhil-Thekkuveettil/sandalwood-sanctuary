import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroProduct from "@/assets/hero-product.jpg";

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.85]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 15]);

  return (
    <section ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial opacity-60" />

      <motion.div style={{ y, opacity }} className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-4 text-sm tracking-[0.3em] uppercase text-primary"
        >
          Introducing
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-display text-5xl font-bold leading-tight tracking-tight text-gradient-gold text-shadow-glow sm:text-7xl md:text-8xl lg:text-9xl"
        >
          Sandal 1
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-2 text-lg tracking-widest uppercase text-muted-foreground sm:text-xl"
        >
          Box Black Premium
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground"
        >
          A masterpiece of fragrance. Hand-rolled with the finest sandalwood, designed to transform every space into a sanctuary.
        </motion.p>

        {/* 3D Product Image */}
        <motion.div
          style={{ scale, rotateX }}
          className="perspective-1000 mt-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 60, rotateY: -10 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="preserve-3d"
          >
            <img
              src={heroProduct}
              alt="Sandal 1 Box Black Premium Incense Stick"
              width={1024}
              height={1024}
              className="w-72 rounded-lg glow-gold sm:w-96 md:w-[28rem]"
            />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-widest uppercase text-muted-foreground">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="h-8 w-5 rounded-full border border-primary/40 p-1"
          >
            <div className="mx-auto h-1.5 w-1 rounded-full bg-primary" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
