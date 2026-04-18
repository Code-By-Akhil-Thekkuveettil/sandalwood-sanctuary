import { createFileRoute } from "@tanstack/react-router";
import ProductForm from "@/components/admin/ProductForm";

export const Route = createFileRoute("/admin/products/$id")({
  component: EditProduct,
});

function EditProduct() {
  const { id } = Route.useParams();
  return (
    <div>
      <h1 className="mb-6 font-display text-3xl text-foreground">Edit product</h1>
      <ProductForm productId={id} />
    </div>
  );
}
