import React from 'react';
import {
  getCategoryBySlug,
  getProductsByCategorySlug,
} from '@/sanity/lib/client';
import SalesCampaignBanner from '@/components/layout/SalesCampaignBanner';
import ProductGrid from '@/components/product/ProductGrid';

type CategoryPageProps = {
  // Starting from Next.js 15, params is of type Promise.
  // Refer to: https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
  params: Promise<{ slug: string }>;
};

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;
  const [products, category] = await Promise.all([
    getProductsByCategorySlug(slug),
    getCategoryBySlug(slug),
  ]);

  return (
    <div>
      <SalesCampaignBanner />
      <div className="bg-red-50 p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl text-center font-bold text-red-600 mb-2">
            {category.title} - UP TO 90% OFF! 🔥
          </h1>
          <p className="text-center text-red-500 text-sm md:text-base animate-pulse">
            ⚡ Flash Sale Ending Soon! ⏰Limited Time Only
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 py-3">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-yellow-200">🚚</span>
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-200">⭐</span>
              <span>Top Rated</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-200">💰</span>
              <span>Best Prices</span>
            </div>
          </div>
        </div>
      </div>
      <section className="container mx-auto">
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500">
            🎉 {products.length} amazing deals available now!
          </p>
        </div>
        <ProductGrid products={products} />
      </section>
    </div>
  );
};

export default CategoryPage;
