import { urlFor } from "@/sanity/lib/image";
import { getCurrentSession } from "@/actions/auth";
import { getAllProducts } from "@/sanity/lib/client";
import SalesCampaignBanner from "@/components/layout/SalesCampaignBanner";
import ProductGrid from "@/components/product/ProductGrid";

export default async function Home() {
  const { user } = await getCurrentSession();
  const products = await getAllProducts();
  return (
    <div>
      <SalesCampaignBanner />
      <section className="container py-8 mx-auto">
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
