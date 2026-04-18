import { createFileRoute } from "@tanstack/react-router";
import ProductForm from "@/components/admin/ProductForm";

export const Route = createFileRoute("/admin/products/new")({
  component: () => (
    <div>
      <h1 className="mb-6 font-display text-3xl text-foreground">New product</h1>
      <ProductForm />
    </div>
  ),
});
