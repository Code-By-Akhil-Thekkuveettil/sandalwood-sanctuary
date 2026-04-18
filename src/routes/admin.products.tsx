import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star } from "lucide-react";

export const Route = createFileRoute("/admin/products")({
  component: ProductsList,
});

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  active: boolean;
  featured: boolean;
  cover_image: string | null;
};

function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("id, name, slug, price, stock, active, featured, cover_image")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setProducts(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">{products.length} items</p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> New product
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card/40">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No products yet. Create your first one.
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-border bg-muted/20 text-left text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border/50 last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {p.cover_image ? (
                        <img src={p.cover_image} alt="" className="h-12 w-12 rounded-md object-cover" />
                      ) : (
                        <div className="h-12 w-12 rounded-md bg-muted" />
                      )}
                      <div>
                        <p className="font-medium text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground">/{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-foreground">₹{Number(p.price).toFixed(2)}</td>
                  <td className="p-4 text-foreground">{p.stock}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${p.active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {p.active ? "Active" : "Hidden"}
                      </span>
                      {p.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                          <Star className="h-3 w-3" /> Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        to="/admin/products/$id"
                        params={{ id: p.id }}
                        className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => remove(p.id)}
                        className="rounded-md p-2 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
