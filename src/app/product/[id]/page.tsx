import React from 'react';
import { getProductById } from '@/sanity/lib/client';
import SalesCampaignBanner from '@/components/layout/SalesCampaignBanner';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { formatPrice } from '@/lib/utils';
import AddToCartButton from '@/components/product/AddToCartButton';

type ProductPageProps = {
  params: Promise<{ id: string }>;
};
const Page = async ({ params }: ProductPageProps) => {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product.price) {
    return <div>Product not found</div>;
  }
  const originalPrice = product.price * 5;

  if (!product.price) {
    return <div>Product not found</div>;
  }

  return (
    <div className="bg-gray-50">
      <SalesCampaignBanner />
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto py-3 px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href={'/'}
              className="text-gray-600 hover:text-red-600 flex items-center gap-1"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-600" />
            <span className="text-gray-400 truncate">{product.title}</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 py-6 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold text-red-500 text-center">
            🔥 FLASH SALE - 80% OFF 🔥
          </h1>
          <div className="flex flex-col items-center gap-2">
            <p className="text-center text-red-500 text-sm md:text-base font-semibold animate-pulse">
              ⚡ Only {Math.floor(Math.random() * 10 + 1)} items left at this
              price!
            </p>
            <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
              ⏰ Offer ends soon!
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 py-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-yellow-600 text-xl">🚚</span>
              <span>Free Express Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-600 text-xl">✨</span>
              <span>Satisfaction Guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-600 text-xl">🔒</span>
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="grid grid-col-1 md:grid-cols-2 gap-8">
          {product.image && (
            <div className="aspect-square rounded-2xl overflow-hidden shadow-lg p-4">
              <div className="relative aspect-square">
                <Image
                  fill
                  priority
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  alt={product.title ?? 'Product Image'}
                  src={urlFor(product.image).url()}
                ></Image>
              </div>
            </div>
          )}

          {/*  Product Information */}
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {product.title}
            </h1>
            <p className="text-gray-600">{product.description}</p>

            {/*  Product Price */}
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-center gap-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold text-red-600">US</span>
                  {/* tracking-tight is used to make the font distance from the price number smaller */}
                  <span className="text-5xl font-black text-red-600 tracking-tight">
                    {formatPrice(product.price).replace('$', '')}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="text-gray-400 text-lg font-bold line-through decoration-2 decoration-red-500/50">
                    {formatPrice(originalPrice)}
                  </div>
                  <div className="flex items-center gap-5">
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      -80%
                    </span>
                    <span className="text-red-600 text-sm font-bold">
                      MEGA SAVINGS
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex bg-red-50 items-center rounded-lg gap-2 p-2">
                <span className="text-red-600 font-bold">💰</span>
                <span className="text-sm text-red-600 font-medium">
                  You save {formatPrice(originalPrice - product.price)}!
                </span>
              </div>

              <div className="flex items-center text-gray-600 text-xs gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>
                  {/* Below is not a good implementation, but it's just for demo purposes */}
                  {/*TODO: Add product rating*/}
                  {Math.floor(Math.random() * 50) + 20} people bought in the
                  last hour
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 p-4 rounded-xl mt-4">
              <div className="flex items-center text-yellow-800 gap-2">
                <span className="text-xl">⚡</span>
                <span className="font-bold">Limited Time Offer!</span>
              </div>
              <div className="text-sm text-yellow-700 mt-1 font-medium">
                Order now before price changes!
              </div>
            </div>

            <AddToCartButton product={product} />

            <div className="flex flex-col bg-white rounded-xl shadow-xl p-4">
              <div className="flex items-center gap-3 text-gray-700">
                <span className="bg-green-100 rounded-full p-2">✅</span>
                <span className="font-medium">
                  In stock - ships with 24 hours
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <span className="bg-green-100 rounded-full p-2">🔁</span>
                <span className="font-medium">30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <span className="bg-green-100 rounded-full p-2">🛡️</span>
                <span className="font-medium">Secure payment processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
