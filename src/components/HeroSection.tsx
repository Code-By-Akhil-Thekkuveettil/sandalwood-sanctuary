import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroProduct from "@/assets/hero-product.jpg";

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.25]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const scrollToOrder = () => {
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background image with parallax */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 z-0"
      >
        <img
          src={heroProduct}
          alt="Sandal 1 Box Black Premium Incense Stick"
          width={1920}
          height={1920}
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Cinematic overlays for legibility */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-background/80 via-background/40 to-background" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-background/70 via-transparent to-background/70" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-radial opacity-50" />

      {/* Foreground content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex flex-col items-center px-6 text-center"
      >
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
          className="font-display text-6xl font-bold leading-[0.95] tracking-tight text-gradient-gold text-shadow-glow sm:text-8xl md:text-9xl lg:text-[10rem]"
        >
          Sandal 1
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-3 text-lg tracking-[0.25em] uppercase text-foreground/90 sm:text-xl"
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

        {/* Order Now CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <button
            onClick={scrollToOrder}
            className="group relative overflow-hidden rounded-full bg-gradient-gold px-10 py-4 text-sm font-semibold tracking-[0.2em] uppercase text-primary-foreground glow-gold transition-transform hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">Order Now</span>
            <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />
          </button>
          <button
            onClick={() => document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" })}
            className="rounded-full border border-primary/40 px-10 py-4 text-sm font-semibold tracking-[0.2em] uppercase text-foreground transition-colors hover:bg-primary/10"
          >
            Discover
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-6 font-display text-2xl text-gradient-gold"
        >
          ₹499 <span className="text-sm font-normal tracking-widest uppercase text-muted-foreground">· Free shipping</span>
        </motion.p>

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
