import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { motion } from "framer-motion";

export const Route = createFileRoute("/products/$slug")({
  component: ProductDetail,
  head: () => ({
    meta: [{ title: "Product — Sandal 1" }],
  }),
});

type Product = {
  id: string; name: string; slug: string; price: number; compare_at_price: number | null;
  short_description: string | null; long_description: string | null;
  cover_image: string | null; stock: number; tags: string[];
  seo_title: string | null; seo_description: string | null;
};
type Image = { url: string; alt: string | null };
type Variant = { id: string; name: string; option_value: string; price_delta: number; stock: number };

function ProductDetail() {
  const { slug } = Route.useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: p } = await supabase.from("products").select("*").eq("slug", slug).eq("active", true).maybeSingle();
      if (!p) { setNotFoundFlag(true); setLoading(false); return; }
      setProduct(p as Product);
      const [{ data: imgs }, { data: vars }] = await Promise.all([
        supabase.from("product_images").select("url, alt").eq("product_id", p.id).order("sort_order"),
        supabase.from("product_variants").select("*").eq("product_id", p.id).order("sort_order"),
      ]);
      const allImages: Image[] = [];
      if (p.cover_image) allImages.push({ url: p.cover_image, alt: p.name });
      (imgs ?? []).forEach((i: any) => allImages.push(i));
      setImages(allImages);
      setVariants((vars ?? []) as Variant[]);
      // Update document title
      document.title = (p.seo_title || p.name) + " — Sandal 1";
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">Loading...</div>;
  if (notFoundFlag || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-display text-3xl text-foreground">Product not found</h1>
          <Link to="/products" className="mt-4 inline-block text-primary">← Back to shop</Link>
        </div>
      </div>
    );
  }

  const variant = variants.find(v => v.id === selectedVariant);
  const finalPrice = Number(product.price) + (variant?.price_delta ?? 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16 px-6">
        <div className="mx-auto max-w-6xl">
          <Link to="/products" className="mb-8 inline-block text-sm text-muted-foreground hover:text-primary">← All products</Link>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              {images[activeImg] && (
                <img src={images[activeImg].url} alt={images[activeImg].alt ?? product.name}
                  className="aspect-square w-full rounded-2xl object-cover glow-gold" />
              )}
              {images.length > 1 && (
                <div className="mt-4 flex gap-2">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`h-20 w-20 overflow-hidden rounded-md border-2 ${activeImg === i ? "border-primary" : "border-transparent"}`}>
                      <img src={img.url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="font-display text-4xl text-foreground md:text-5xl">{product.name}</h1>
              {product.short_description && <p className="mt-3 text-lg text-muted-foreground">{product.short_description}</p>}
              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-display text-3xl text-gradient-gold">₹{finalPrice.toFixed(0)}</span>
                {product.compare_at_price && Number(product.compare_at_price) > finalPrice && (
                  <span className="text-lg text-muted-foreground line-through">₹{Number(product.compare_at_price).toFixed(0)}</span>
                )}
              </div>

              {variants.length > 0 && (
                <div className="mt-6">
                  <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">{variants[0].name}</p>
                  <div className="flex flex-wrap gap-2">
                    {variants.map(v => (
                      <button key={v.id} onClick={() => setSelectedVariant(v.id)}
                        className={`rounded-full px-4 py-2 text-sm ${selectedVariant === v.id ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:bg-muted/40"}`}>
                        {v.option_value}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button className="mt-8 w-full rounded-full bg-gradient-gold py-4 text-sm font-semibold uppercase tracking-widest text-primary-foreground glow-gold transition-transform hover:scale-[1.02]"
                disabled={product.stock === 0}>
                {product.stock === 0 ? "Sold out" : "Order now"}
              </button>
              <p className="mt-3 text-center text-xs text-muted-foreground">{product.stock > 0 ? `${product.stock} in stock · Free shipping` : ""}</p>

              {product.long_description && (
                <div className="mt-10 border-t border-border pt-6">
                  <h2 className="font-display text-lg text-foreground">Details</h2>
                  <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">{product.long_description}</p>
                </div>
              )}

              {product.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {product.tags.map(t => (
                    <span key={t} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">{t}</span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <FooterSection />
    </div>
  );
}
