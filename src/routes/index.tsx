import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ExperienceSection from "@/components/ExperienceSection";
import CraftSection from "@/components/CraftSection";
import RitualSection from "@/components/RitualSection";
import OrderSection from "@/components/OrderSection";
import FooterSection from "@/components/FooterSection";
import RenderBlocks from "@/components/blocks/RenderBlocks";
import FeaturedProducts from "@/components/FeaturedProducts";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Sandal 1 Box Black — Premium Incense Stick" },
      { name: "description", content: "Experience the finest hand-rolled sandalwood incense. Sandal 1 Box Black Premium — crafted from Mysore sandalwood for a transcendent fragrance." },
      { property: "og:title", content: "Sandal 1 Box Black — Premium Incense Stick" },
      { property: "og:description", content: "Hand-rolled Mysore sandalwood incense. Transform every space into a sanctuary." },
    ],
  }),
});

function Index() {
  const [blocks, setBlocks] = useState<any[] | null>(null);

  useEffect(() => {
    supabase.from("content_blocks")
      .select("id, type, data, sort_order")
      .eq("page", "home").eq("active", true).order("sort_order")
      .then(({ data }) => setBlocks(data ?? []));
  }, []);

  // While loading, show static fallback to avoid flash
  const useCms = blocks && blocks.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      {useCms ? (
        <>
          <RenderBlocks blocks={blocks} />
          <FeaturedProducts />
        </>
      ) : (
        <>
          <HeroSection />
          <ExperienceSection />
          <CraftSection />
          <RitualSection />
          <FeaturedProducts />
          <OrderSection />
        </>
      )}
      <FooterSection />
    </div>
  );
}
