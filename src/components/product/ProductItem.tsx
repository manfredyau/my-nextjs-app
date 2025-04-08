import React from "react";
import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

type ProductItemProps = {
  product: Product;
};
const ProductItem = ({ product }: ProductItemProps) => {
  return (
    <div className="bg-white rounded-lg relative border-black border-1">
      <div className="absolute top-2 right-2 z-10">
        <span className="text-white font-bold text-xs rounded-full bg-red-500 px-2 py-1 animate-bounce">
          HOT!
        </span>
      </div>
      <div className="h-56 w-full">
        {product.image && (
          <Image
            // The width 256px here is not for presentation, just for the size of itself
            src={urlFor(product.image).width(256).url()}
            alt={product.title || "Product Image"}
            fill
            className="object-contain p-2"
            loading="lazy"
          />
        )}
      </div>
      <div className=""></div>
    </div>
  );
};

export default ProductItem;
