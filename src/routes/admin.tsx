import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LayoutDashboard, Package, Tag, LayoutTemplate, Users, LogOut, Crown } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({ meta: [{ title: "Admin — Sandal 1" }] }),
});

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  async function claimAdmin() {
    const { data, error } = await supabase.rpc("claim_first_admin");
    if (error) return toast.error(error.message);
    if (data) {
      toast.success("You are now admin. Reloading...");
      setTimeout(() => window.location.reload(), 800);
    } else {
      toast.error("An admin already exists. Ask them to promote you.");
    }
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading...</div>;
  }
  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-md rounded-2xl border border-border bg-card/60 p-8 text-center backdrop-blur-sm">
          <Crown className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-4 font-display text-2xl text-foreground">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Signed in as {user.email}. If you are the site owner, claim admin below (works only if no admin exists yet).
          </p>
          <button
            onClick={claimAdmin}
            className="mt-6 w-full rounded-full bg-gradient-gold py-3 text-sm font-semibold uppercase tracking-widest text-primary-foreground"
          >
            Claim admin
          </button>
          <button
            onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); }}
            className="mt-3 w-full text-sm text-muted-foreground hover:text-primary"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const nav = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/categories", label: "Categories", icon: Tag },
    { to: "/admin/cms", label: "Page Builder", icon: LayoutTemplate },
    { to: "/admin/users", label: "Users", icon: Users },
  ];

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 border-r border-border bg-card/40 p-6">
        <Link to="/" className="font-display text-lg text-gradient-gold">SANDAL 1</Link>
        <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">Admin</p>
        <nav className="mt-8 space-y-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive(n.to, n.exact)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); }}
          className="mt-8 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
