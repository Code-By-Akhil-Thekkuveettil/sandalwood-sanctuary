import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

type Product = { id: string; name: string; slug: string; price: number; cover_image: string | null; short_description: string | null };

export default function FeaturedProducts() {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    supabase.from("products")
      .select("id, name, slug, price, cover_image, short_description")
      .eq("active", true).eq("featured", true)
      .order("sort_order").limit(6)
      .then(({ data }) => setItems(data ?? []));
  }, []);

  if (items.length === 0) return null;

  return (
    <section id="featured" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Featured</p>
          <h2 className="mt-2 font-display text-4xl text-gradient-gold md:text-5xl">Our collection</h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link to="/products/$slug" params={{ slug: p.slug }}
                className="group block overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-sm transition-transform hover:-translate-y-1">
                {p.cover_image && (
                  <div className="aspect-square overflow-hidden">
                    <img src={p.cover_image} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-display text-lg text-foreground">{p.name}</h3>
                  {p.short_description && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.short_description}</p>}
                  <p className="mt-3 font-display text-xl text-gradient-gold">₹{Number(p.price).toFixed(0)}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/products" className="inline-block rounded-full border border-primary/40 px-8 py-3 text-sm uppercase tracking-widest text-foreground hover:bg-primary/10">
            View all products
          </Link>
        </div>
      </div>
    </section>
  );
}
