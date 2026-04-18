import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2, Upload, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/admin/cms")({
  component: PageBuilder,
});

type Block = {
  id: string;
  page: string;
  type: string;
  data: Record<string, any>;
  sort_order: number;
  active: boolean;
};

const BLOCK_TYPES = [
  { type: "hero", label: "Hero", defaults: { eyebrow: "Introducing", title: "Sandal 1", subtitle: "Box Black Premium", description: "A masterpiece of fragrance.", cta: "Order Now", image: "" } },
  { type: "features", label: "Features", defaults: { title: "Why choose us", items: [{ title: "Premium", description: "Mysore sandalwood." }] } },
  { type: "gallery", label: "Gallery", defaults: { title: "Gallery", images: [] as string[] } },
  { type: "testimonials", label: "Testimonials", defaults: { title: "Loved by many", items: [{ quote: "Beautiful fragrance.", author: "A. Customer" }] } },
  { type: "cta", label: "Call to action", defaults: { title: "Ready?", description: "", cta: "Shop now" } },
  { type: "text", label: "Text", defaults: { title: "", body: "" } },
];

function PageBuilder() {
  const [page, setPage] = useState("home");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("content_blocks").select("*").eq("page", page).order("sort_order");
    setBlocks((data ?? []) as Block[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, [page]);

  async function addBlock(type: string) {
    const def = BLOCK_TYPES.find(b => b.type === type)!;
    const { data, error } = await supabase.from("content_blocks").insert({
      page, type, data: def.defaults, sort_order: blocks.length, active: true,
    }).select("*").single();
    if (error) return toast.error(error.message);
    setBlocks([...blocks, data as Block]);
  }

  async function updateBlock(id: string, patch: Partial<Block>) {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...patch } : b));
    const { error } = await supabase.from("content_blocks").update(patch).eq("id", id);
    if (error) toast.error(error.message);
  }

  async function removeBlock(id: string) {
    if (!confirm("Delete this block?")) return;
    const { error } = await supabase.from("content_blocks").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setBlocks(blocks.filter(b => b.id !== id));
  }

  async function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = blocks.findIndex(b => b.id === active.id);
    const newIdx = blocks.findIndex(b => b.id === over.id);
    const reordered = arrayMove(blocks, oldIdx, newIdx);
    setBlocks(reordered);
    await Promise.all(reordered.map((b, i) =>
      supabase.from("content_blocks").update({ sort_order: i }).eq("id", b.id)
    ));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground">Page Builder</h1>
          <p className="mt-1 text-sm text-muted-foreground">Drag to reorder. Editing saves automatically.</p>
        </div>
        <select value={page} onChange={(e) => setPage(e.target.value)}
          className="rounded-md border border-border bg-background px-4 py-2 text-foreground">
          <option value="home">Home page</option>
        </select>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {BLOCK_TYPES.map(b => (
          <button key={b.type} onClick={() => addBlock(b.type)}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-card/40 px-4 py-1.5 text-sm text-foreground hover:bg-muted/40">
            <Plus className="h-3 w-3" /> {b.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-8 text-muted-foreground">Loading...</div>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            <div className="mt-8 space-y-3">
              {blocks.map(b => (
                <SortableBlock key={b.id} block={b} onUpdate={updateBlock} onRemove={removeBlock} />
              ))}
              {blocks.length === 0 && (
                <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
                  No blocks yet. Add one above to start building the page.
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

function SortableBlock({ block, onUpdate, onRemove }: {
  block: Block; onUpdate: (id: string, patch: Partial<Block>) => void; onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const [open, setOpen] = useState(false);

  return (
    <div ref={setNodeRef} style={style} className="rounded-xl border border-border bg-card/40">
      <div className="flex items-center gap-3 p-4">
        <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground">
          <GripVertical className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-widest text-primary">{block.type}</span>
            <span className="text-sm text-foreground">{block.data?.title || block.data?.eyebrow || "Untitled"}</span>
          </div>
        </div>
        <button onClick={() => onUpdate(block.id, { active: !block.active })}
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" title={block.active ? "Hide" : "Show"}>
          {block.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
        <button onClick={() => setOpen(!open)} className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground hover:bg-muted/40">
          {open ? "Close" : "Edit"}
        </button>
        <button onClick={() => onRemove(block.id)} className="rounded-md p-2 text-muted-foreground hover:bg-destructive/20 hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {open && (
        <div className="border-t border-border p-4">
          <BlockEditor block={block} onChange={(data) => onUpdate(block.id, { data })} />
        </div>
      )}
    </div>
  );
}

function BlockEditor({ block, onChange }: { block: Block; onChange: (data: any) => void }) {
  const data = block.data ?? {};
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  const input = "w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none";
  const label = "mb-1 block text-xs uppercase tracking-widest text-muted-foreground";

  async function uploadCmsImage(file: File): Promise<string | null> {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("cms-images").upload(path, file);
    if (error) { toast.error(error.message); return null; }
    return supabase.storage.from("cms-images").getPublicUrl(path).data.publicUrl;
  }

  if (block.type === "hero") {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div><label className={label}>Eyebrow</label><input className={input} value={data.eyebrow ?? ""} onChange={(e) => set("eyebrow", e.target.value)} /></div>
        <div><label className={label}>Title</label><input className={input} value={data.title ?? ""} onChange={(e) => set("title", e.target.value)} /></div>
        <div><label className={label}>Subtitle</label><input className={input} value={data.subtitle ?? ""} onChange={(e) => set("subtitle", e.target.value)} /></div>
        <div><label className={label}>CTA text</label><input className={input} value={data.cta ?? ""} onChange={(e) => set("cta", e.target.value)} /></div>
        <div className="sm:col-span-2"><label className={label}>Description</label><textarea rows={3} className={input} value={data.description ?? ""} onChange={(e) => set("description", e.target.value)} /></div>
        <div className="sm:col-span-2">
          <label className={label}>Background image</label>
          <div className="flex items-center gap-3">
            {data.image && <img src={data.image} alt="" className="h-20 w-32 rounded-md object-cover" />}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground hover:bg-muted/40">
              <Upload className="h-4 w-4" /> Upload
              <input type="file" accept="image/*" hidden onChange={async (e) => {
                const f = e.target.files?.[0]; if (!f) return;
                const u = await uploadCmsImage(f); if (u) set("image", u);
              }} />
            </label>
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "features") {
    const items = data.items ?? [];
    return (
      <div className="space-y-3">
        <div><label className={label}>Section title</label><input className={input} value={data.title ?? ""} onChange={(e) => set("title", e.target.value)} /></div>
        {items.map((it: any, i: number) => (
          <div key={i} className="grid grid-cols-12 gap-2">
            <input placeholder="Title" className={`col-span-4 ${input}`} value={it.title}
              onChange={(e) => { const c = [...items]; c[i] = { ...c[i], title: e.target.value }; set("items", c); }} />
            <input placeholder="Description" className={`col-span-7 ${input}`} value={it.description}
              onChange={(e) => { const c = [...items]; c[i] = { ...c[i], description: e.target.value }; set("items", c); }} />
            <button onClick={() => set("items", items.filter((_: any, j: number) => j !== i))} className="col-span-1 rounded-md border border-border text-muted-foreground hover:text-destructive">×</button>
          </div>
        ))}
        <button onClick={() => set("items", [...items, { title: "", description: "" }])} className="text-sm text-primary">+ Add feature</button>
      </div>
    );
  }

  if (block.type === "gallery") {
    const images: string[] = data.images ?? [];
    return (
      <div>
        <div><label className={label}>Section title</label><input className={input} value={data.title ?? ""} onChange={(e) => set("title", e.target.value)} /></div>
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((url, i) => (
            <div key={i} className="relative h-20 w-20">
              <img src={url} alt="" className="h-full w-full rounded-md object-cover" />
              <button onClick={() => set("images", images.filter((_, j) => j !== i))}
                className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground">×</button>
            </div>
          ))}
          <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-md border border-dashed border-border text-muted-foreground hover:bg-muted/40">
            <Plus className="h-5 w-5" />
            <input type="file" accept="image/*" multiple hidden onChange={async (e) => {
              const files = Array.from(e.target.files ?? []);
              const urls: string[] = [];
              for (const f of files) { const u = await uploadCmsImage(f); if (u) urls.push(u); }
              set("images", [...images, ...urls]);
            }} />
          </label>
        </div>
      </div>
    );
  }

  if (block.type === "testimonials") {
    const items = data.items ?? [];
    return (
      <div className="space-y-3">
        <div><label className={label}>Section title</label><input className={input} value={data.title ?? ""} onChange={(e) => set("title", e.target.value)} /></div>
        {items.map((it: any, i: number) => (
          <div key={i} className="grid grid-cols-12 gap-2">
            <textarea placeholder="Quote" className={`col-span-7 ${input}`} value={it.quote}
              onChange={(e) => { const c = [...items]; c[i] = { ...c[i], quote: e.target.value }; set("items", c); }} />
            <input placeholder="Author" className={`col-span-4 ${input}`} value={it.author}
              onChange={(e) => { const c = [...items]; c[i] = { ...c[i], author: e.target.value }; set("items", c); }} />
            <button onClick={() => set("items", items.filter((_: any, j: number) => j !== i))} className="col-span-1 rounded-md border border-border text-muted-foreground hover:text-destructive">×</button>
          </div>
        ))}
        <button onClick={() => set("items", [...items, { quote: "", author: "" }])} className="text-sm text-primary">+ Add testimonial</button>
      </div>
    );
  }

  if (block.type === "cta") {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div><label className={label}>Title</label><input className={input} value={data.title ?? ""} onChange={(e) => set("title", e.target.value)} /></div>
        <div><label className={label}>CTA text</label><input className={input} value={data.cta ?? ""} onChange={(e) => set("cta", e.target.value)} /></div>
        <div className="sm:col-span-2"><label className={label}>Description</label><textarea rows={3} className={input} value={data.description ?? ""} onChange={(e) => set("description", e.target.value)} /></div>
      </div>
    );
  }

  // text
  return (
    <div className="space-y-3">
      <div><label className={label}>Title</label><input className={input} value={data.title ?? ""} onChange={(e) => set("title", e.target.value)} /></div>
      <div><label className={label}>Body</label><textarea rows={6} className={input} value={data.body ?? ""} onChange={(e) => set("body", e.target.value)} /></div>
    </div>
  );
}
