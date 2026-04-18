import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { motion } from "framer-motion";

export const Route = createFileRoute("/products")({
  component: ProductsPage,
  head: () => ({
    meta: [
      { title: "Shop — Sandal 1 Premium Incense" },
      { name: "description", content: "Browse our collection of hand-rolled premium sandalwood incense." },
      { property: "og:title", content: "Shop — Sandal 1 Premium Incense" },
      { property: "og:description", content: "Browse our collection of hand-rolled premium sandalwood incense." },
    ],
  }),
});

type Product = { id: string; name: string; slug: string; price: number; cover_image: string | null; short_description: string | null; category_id: string | null };
type Category = { id: string; name: string; slug: string };

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    supabase.from("products").select("id, name, slug, price, cover_image, short_description, category_id").eq("active", true).order("sort_order").then(({ data }) => setProducts(data ?? []));
    supabase.from("categories").select("id, name, slug").order("name").then(({ data }) => setCategories(data ?? []));
  }, []);

  const filtered = filter ? products.filter(p => p.category_id === filter) : products;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-16 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Catalog</p>
            <h1 className="mt-2 font-display text-5xl text-gradient-gold md:text-6xl">All products</h1>
          </div>

          {categories.length > 0 && (
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              <button onClick={() => setFilter("")}
                className={`rounded-full px-5 py-2 text-xs uppercase tracking-widest ${!filter ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:bg-muted/40"}`}>
                All
              </button>
              {categories.map(c => (
                <button key={c.id} onClick={() => setFilter(c.id)}
                  className={`rounded-full px-5 py-2 text-xs uppercase tracking-widest ${filter === c.id ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:bg-muted/40"}`}>
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <p className="mt-16 text-center text-muted-foreground">No products available yet.</p>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to="/products/$slug" params={{ slug: p.slug }}
                    className="group block overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-sm transition-transform hover:-translate-y-1">
                    {p.cover_image ? (
                      <div className="aspect-square overflow-hidden">
                        <img src={p.cover_image} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    ) : <div className="aspect-square bg-muted" />}
                    <div className="p-5">
                      <h3 className="font-display text-lg text-foreground">{p.name}</h3>
                      {p.short_description && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.short_description}</p>}
                      <p className="mt-3 font-display text-xl text-gradient-gold">₹{Number(p.price).toFixed(0)}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <FooterSection />
    </div>
  );
}
