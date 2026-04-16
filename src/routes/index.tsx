import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ExperienceSection from "@/components/ExperienceSection";
import CraftSection from "@/components/CraftSection";
import RitualSection from "@/components/RitualSection";
import OrderSection from "@/components/OrderSection";
import FooterSection from "@/components/FooterSection";

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
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <ExperienceSection />
      <CraftSection />
      <RitualSection />
      <OrderSection />
      <FooterSection />
    </div>
  );
}
