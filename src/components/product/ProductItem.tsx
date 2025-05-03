import React from 'react';
import { Product } from '@/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';

type ProductItemProps = {
  product: Product;
};
const ProductItem = ({ product }: ProductItemProps) => {
  return (
    <div className="bg-white rounded-lg relative border-black overflow-hidden">
      <div className="absolute top-2 right-2 z-10">
        <span className="text-white font-bold text-xs rounded-full bg-red-500 px-2 py-1 animate-bounce">
          HOT!
        </span>
      </div>
      <div className="relative h-48 w-full">
        {product.image && (
          <Image
            // The width 256px here is not for presentation, just for the size of itself
            src={urlFor(product.image).width(256).url()}
            alt={product.title || 'Product Image'}
            fill
            className="object-contain p-2"
            loading="lazy"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium line-clamp-2 h-10 mb-1">
          {product.title}
        </h3>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-red-500">
              ${(product.price || 0).toFixed(2)}
            </span>
            <span className="text-gray-400 text-sm line-through">
              ${((product.price || 0) * 5).toFixed(2)}
            </span>
          </div>
          <div className="text-xs text-green-400 font-semibold mb-2">
            🔥{' '}
            {100 +
              (Math.abs(
                product._id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
              ) %
                500)}
            + sold in last 24hr
          </div>
          <Link
            href={`/product/${product._id}`}
            className="font-bold text-center text-sm text-white  rounded-full px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500
                      hover:brightness-150"
          >
            GRAB IT NOW!
          </Link>
          <div className="text-sm text-red-500 text-center animate-pulse mt-1">
            ⚡ Limited Time Offer!
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
