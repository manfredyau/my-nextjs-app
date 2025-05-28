'use client';
import React, { useState } from 'react';
import { Product } from '@/sanity.types';
import { Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';
import { useShallow } from 'zustand/react/shallow';
import { urlFor } from '@/sanity/lib/image';

type AddToCartButtonProps = {
  product: Product;
};

const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  if (!product.price) {
    return null;
  }

  const { addItem, open } = useCartStore(
    useShallow((state) => ({
      addItem: state.addItem,
      open: state.open,
    }))
  );

  const [isLoading, setIsLoading] = useState(false);

  async function handleAddToCart() {
    if (!product.title || !product.price || !product.image) {
      return;
    }
    setIsLoading(true);
    // Add item to cart logic here
    await addItem({
      id: product._id,
      title: product.title,
      price: product.price,
      image: urlFor(product.image).url(),
      quantity: 1
    });
    setIsLoading(false);
  }

  return (
    <button
      className="w-full bg-gradient-to-r py-4 text-xl  rounded-full text-white font-medium from-red-500 to-red-600 mt-6
                hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-[1.02] active:scale-[1.02]
                shadow-lg flex items-center gap-3 justify-center disabled:opacity-80 disabled:cursor-not-allowed"
      disabled={isLoading}
      onClick={handleAddToCart}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Adding to cart...</span>
        </>
      ) : (
        <>Add to cart - {formatPrice(product.price)}</>
      )}
    </button>
  );
};

export default AddToCartButton;
