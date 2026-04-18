import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, LayoutTemplate, Users, Tag } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, blocks: 0, users: 0 });

  useEffect(() => {
    (async () => {
      const [p, c, b, u] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("content_blocks").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        products: p.count ?? 0,
        categories: c.count ?? 0,
        blocks: b.count ?? 0,
        users: u.count ?? 0,
      });
    })();
  }, []);

  const cards = [
    { label: "Products", value: stats.products, icon: Package },
    { label: "Categories", value: stats.categories, icon: Tag },
    { label: "Content Blocks", value: stats.blocks, icon: LayoutTemplate },
    { label: "Users", value: stats.users, icon: Users },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Overview of your store.</p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-card/40 p-6">
            <c.icon className="h-6 w-6 text-primary" />
            <p className="mt-4 text-3xl font-bold text-foreground">{c.value}</p>
            <p className="text-sm text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
