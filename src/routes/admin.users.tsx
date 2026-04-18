import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Crown, Shield } from "lucide-react";

export const Route = createFileRoute("/admin/users")({
  component: Users,
});

type Row = { id: string; email: string; display_name: string | null; isAdmin: boolean };

function Users() {
  const [rows, setRows] = useState<Row[]>([]);

  async function load() {
    const { data: profiles } = await supabase.from("profiles").select("id, email, display_name").order("created_at", { ascending: false });
    const { data: roles } = await supabase.from("user_roles").select("user_id, role").eq("role", "admin");
    const adminSet = new Set((roles ?? []).map(r => r.user_id));
    setRows((profiles ?? []).map(p => ({ id: p.id, email: p.email ?? "", display_name: p.display_name, isAdmin: adminSet.has(p.id) })));
  }
  useEffect(() => { load(); }, []);

  async function toggle(userId: string, isAdmin: boolean) {
    if (isAdmin) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      if (error) return toast.error(error.message);
      toast.success("Admin removed");
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
      if (error) return toast.error(error.message);
      toast.success("Promoted to admin");
    }
    load();
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-foreground">Users</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage admin access.</p>
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card/40">
        {rows.map(r => (
          <div key={r.id} className="flex items-center justify-between border-b border-border/50 p-4 last:border-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                {r.isAdmin ? <Crown className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-foreground">{r.display_name || r.email}</p>
                <p className="text-xs text-muted-foreground">{r.email}</p>
              </div>
            </div>
            <button onClick={() => toggle(r.id, r.isAdmin)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest ${r.isAdmin ? "border border-border text-foreground hover:bg-destructive/20" : "bg-gradient-gold text-primary-foreground"}`}>
              {r.isAdmin ? "Revoke admin" : "Make admin"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
