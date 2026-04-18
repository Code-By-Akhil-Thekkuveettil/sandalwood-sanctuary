import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/categories")({
  component: Categories,
});

type Category = { id: string; name: string; slug: string; description: string | null };

function Categories() {
  const [items, setItems] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [desc, setDesc] = useState("");

  async function load() {
    const { data } = await supabase.from("categories").select("*").order("name");
    setItems(data ?? []);
  }
  useEffect(() => { load(); }, []);

  async function create() {
    if (!name) return;
    const s = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const { error } = await supabase.from("categories").insert({ name, slug: s, description: desc });
    if (error) return toast.error(error.message);
    setName(""); setSlug(""); setDesc("");
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete category?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  const input = "rounded-md border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary focus:outline-none";

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-foreground">Categories</h1>
      <div className="mt-6 rounded-xl border border-border bg-card/40 p-6">
        <h2 className="mb-4 text-sm uppercase tracking-widest text-muted-foreground">Add new</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className={input} />
          <input placeholder="Slug (auto)" value={slug} onChange={(e) => setSlug(e.target.value)} className={input} />
          <input placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} className={input} />
        </div>
        <button onClick={create} className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-5 py-2 text-sm font-semibold uppercase tracking-widest text-primary-foreground">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card/40">
        {items.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No categories yet.</div>
        ) : items.map(c => (
          <div key={c.id} className="flex items-center justify-between border-b border-border/50 p-4 last:border-0">
            <div>
              <p className="font-medium text-foreground">{c.name}</p>
              <p className="text-xs text-muted-foreground">/{c.slug} {c.description && `· ${c.description}`}</p>
            </div>
            <button onClick={() => remove(c.id)} className="rounded-md p-2 text-muted-foreground hover:bg-destructive/20 hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
