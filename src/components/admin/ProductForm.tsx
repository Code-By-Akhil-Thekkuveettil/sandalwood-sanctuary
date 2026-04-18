import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { Upload, X, Plus } from "lucide-react";

type Category = { id: string; name: string };
type ProductImage = { id?: string; url: string; alt: string; sort_order: number };
type Variant = { id?: string; name: string; option_value: string; price_delta: number; stock: number };

export default function ProductForm({ productId }: { productId?: string }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState({
    name: "", slug: "", sku: "", short_description: "", long_description: "",
    price: 0, compare_at_price: 0, weight_grams: 0, stock: 0,
    active: true, featured: false, category_id: "",
    tags: "", seo_title: "", seo_description: "", cover_image: "",
  });
  const [images, setImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);

  useEffect(() => {
    supabase.from("categories").select("id, name").order("name").then(({ data }) => setCategories(data ?? []));
    if (productId) loadProduct();
  }, [productId]);

  async function loadProduct() {
    setLoading(true);
    const { data: p } = await supabase.from("products").select("*").eq("id", productId!).maybeSingle();
    if (p) {
      setForm({
        name: p.name, slug: p.slug, sku: p.sku ?? "",
        short_description: p.short_description ?? "", long_description: p.long_description ?? "",
        price: Number(p.price), compare_at_price: Number(p.compare_at_price ?? 0),
        weight_grams: p.weight_grams ?? 0, stock: p.stock,
        active: p.active, featured: p.featured, category_id: p.category_id ?? "",
        tags: (p.tags ?? []).join(", "),
        seo_title: p.seo_title ?? "", seo_description: p.seo_description ?? "",
        cover_image: p.cover_image ?? "",
      });
    }
    const { data: imgs } = await supabase.from("product_images").select("*").eq("product_id", productId!).order("sort_order");
    setImages(imgs ?? []);
    const { data: vars } = await supabase.from("product_variants").select("*").eq("product_id", productId!).order("sort_order");
    setVariants((vars ?? []).map(v => ({ id: v.id, name: v.name, option_value: v.option_value, price_delta: Number(v.price_delta), stock: v.stock })));
    setLoading(false);
  }

  function slugify(s: string) {
    return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function uploadImage(file: File): Promise<string | null> {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) { toast.error(error.message); return null; }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const url = await uploadImage(file);
    if (url) setForm({ ...form, cover_image: url });
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    for (const f of files) {
      const url = await uploadImage(f);
      if (url) setImages(prev => [...prev, { url, alt: form.name, sort_order: prev.length }]);
    }
  }

  async function save() {
    if (!form.name || !form.slug) return toast.error("Name and slug required");
    setSaving(true);
    const payload = {
      name: form.name, slug: form.slug, sku: form.sku || null,
      short_description: form.short_description, long_description: form.long_description,
      price: form.price, compare_at_price: form.compare_at_price || null,
      weight_grams: form.weight_grams || null, stock: form.stock,
      active: form.active, featured: form.featured,
      category_id: form.category_id || null,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      seo_title: form.seo_title || null, seo_description: form.seo_description || null,
      cover_image: form.cover_image || null,
    };

    let id = productId;
    if (productId) {
      const { error } = await supabase.from("products").update(payload).eq("id", productId);
      if (error) { setSaving(false); return toast.error(error.message); }
    } else {
      const { data, error } = await supabase.from("products").insert(payload).select("id").single();
      if (error) { setSaving(false); return toast.error(error.message); }
      id = data.id;
    }

    // Replace images
    await supabase.from("product_images").delete().eq("product_id", id!);
    if (images.length) {
      await supabase.from("product_images").insert(images.map((img, i) => ({ product_id: id, url: img.url, alt: img.alt, sort_order: i })));
    }
    // Replace variants
    await supabase.from("product_variants").delete().eq("product_id", id!);
    if (variants.length) {
      await supabase.from("product_variants").insert(variants.map((v, i) => ({ product_id: id, name: v.name, option_value: v.option_value, price_delta: v.price_delta, stock: v.stock, sort_order: i })));
    }

    toast.success("Saved");
    setSaving(false);
    navigate({ to: "/admin/products" });
  }

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  const input = "w-full rounded-md border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary focus:outline-none";
  const label = "mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground";

  return (
    <div className="max-w-4xl space-y-8">
      {/* Basics */}
      <section className="rounded-xl border border-border bg-card/40 p-6">
        <h2 className="mb-4 font-display text-xl text-foreground">Basics</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Name *</label>
            <input className={input} value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.slug || slugify(e.target.value) })} />
          </div>
          <div>
            <label className={label}>Slug *</label>
            <input className={input} value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} />
          </div>
          <div>
            <label className={label}>SKU</label>
            <input className={input} value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          </div>
          <div>
            <label className={label}>Category</label>
            <select className={input} value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
              <option value="">— None —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Short description</label>
            <input className={input} value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Long description</label>
            <textarea rows={6} className={input} value={form.long_description} onChange={(e) => setForm({ ...form, long_description: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Tags (comma-separated)</label>
            <input className={input} value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="rounded-xl border border-border bg-card/40 p-6">
        <h2 className="mb-4 font-display text-xl text-foreground">Pricing & inventory</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <label className={label}>Price (₹)</label>
            <input type="number" step="0.01" className={input} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          </div>
          <div>
            <label className={label}>Compare at</label>
            <input type="number" step="0.01" className={input} value={form.compare_at_price} onChange={(e) => setForm({ ...form, compare_at_price: Number(e.target.value) })} />
          </div>
          <div>
            <label className={label}>Stock</label>
            <input type="number" className={input} value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
          </div>
          <div>
            <label className={label}>Weight (g)</label>
            <input type="number" className={input} value={form.weight_grams} onChange={(e) => setForm({ ...form, weight_grams: Number(e.target.value) })} />
          </div>
        </div>
        <div className="mt-4 flex gap-6">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Active (visible)
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Featured on homepage
          </label>
        </div>
      </section>

      {/* Images */}
      <section className="rounded-xl border border-border bg-card/40 p-6">
        <h2 className="mb-4 font-display text-xl text-foreground">Images</h2>
        <div>
          <label className={label}>Cover image</label>
          <div className="flex items-center gap-4">
            {form.cover_image && <img src={form.cover_image} alt="cover" className="h-24 w-24 rounded-md object-cover" />}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground hover:bg-muted/40">
              <Upload className="h-4 w-4" /> Upload
              <input type="file" accept="image/*" hidden onChange={handleCoverUpload} />
            </label>
            {form.cover_image && (
              <button onClick={() => setForm({ ...form, cover_image: "" })} className="text-sm text-muted-foreground hover:text-destructive">Remove</button>
            )}
          </div>
        </div>
        <div className="mt-6">
          <label className={label}>Gallery</label>
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative h-24 w-24">
                <img src={img.url} alt={img.alt} className="h-full w-full rounded-md object-cover" />
                <button onClick={() => setImages(images.filter((_, j) => j !== i))}
                  className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-md border border-dashed border-border text-muted-foreground hover:bg-muted/40">
              <Plus className="h-5 w-5" />
              <input type="file" accept="image/*" hidden multiple onChange={handleGalleryUpload} />
            </label>
          </div>
        </div>
      </section>

      {/* Variants */}
      <section className="rounded-xl border border-border bg-card/40 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-foreground">Variants</h2>
          <button onClick={() => setVariants([...variants, { name: "Size", option_value: "", price_delta: 0, stock: 0 }])}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm text-foreground hover:bg-muted/40">
            <Plus className="h-4 w-4" /> Add variant
          </button>
        </div>
        {variants.length === 0 ? (
          <p className="text-sm text-muted-foreground">No variants. Optional — e.g. Size: Small / Medium / Large.</p>
        ) : (
          <div className="space-y-3">
            {variants.map((v, i) => (
              <div key={i} className="grid grid-cols-12 gap-2">
                <input placeholder="Type (Size)" className={`col-span-3 ${input}`} value={v.name}
                  onChange={(e) => { const c = [...variants]; c[i].name = e.target.value; setVariants(c); }} />
                <input placeholder="Value (Large)" className={`col-span-3 ${input}`} value={v.option_value}
                  onChange={(e) => { const c = [...variants]; c[i].option_value = e.target.value; setVariants(c); }} />
                <input type="number" placeholder="Price ±" className={`col-span-2 ${input}`} value={v.price_delta}
                  onChange={(e) => { const c = [...variants]; c[i].price_delta = Number(e.target.value); setVariants(c); }} />
                <input type="number" placeholder="Stock" className={`col-span-2 ${input}`} value={v.stock}
                  onChange={(e) => { const c = [...variants]; c[i].stock = Number(e.target.value); setVariants(c); }} />
                <button onClick={() => setVariants(variants.filter((_, j) => j !== i))}
                  className="col-span-2 rounded-md border border-border text-muted-foreground hover:bg-destructive/20 hover:text-destructive">
                  <Trash />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SEO */}
      <section className="rounded-xl border border-border bg-card/40 p-6">
        <h2 className="mb-4 font-display text-xl text-foreground">SEO</h2>
        <div className="space-y-4">
          <div>
            <label className={label}>SEO Title</label>
            <input className={input} value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} />
          </div>
          <div>
            <label className={label}>SEO Description</label>
            <textarea rows={3} className={input} value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} />
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <button onClick={() => navigate({ to: "/admin/products" })} className="rounded-full border border-border px-6 py-2.5 text-sm text-foreground hover:bg-muted/40">Cancel</button>
        <button onClick={save} disabled={saving}
          className="rounded-full bg-gradient-gold px-8 py-2.5 text-sm font-semibold uppercase tracking-widest text-primary-foreground disabled:opacity-50">
          {saving ? "Saving..." : "Save product"}
        </button>
      </div>
    </div>
  );
}

function Trash() {
  return <svg className="mx-auto h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" /></svg>;
}
