import { urlFor } from "@/sanity/lib/image";
import { getCurrentSession } from "@/actions/auth";
import { getAllProducts } from "@/sanity/lib/client";

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}

export default async function Home() {
  const { user } = await getCurrentSession();

  const products = await getAllProducts();
  return (
    <div>
      {user ? (
        JSON.stringify(user)
      ) : (
        <p className={"text-center text-2xl font-bold -tracking-tighter"}>
          Please log in first.
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="border p-4 rounded-lg transition-shadow duration-300 hover:shadow-md"
          >
            {product.image && product.image.asset && (
              <img
                src={urlFor(product.image.asset._ref).url()}
                alt={product.title || "Product Image"}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            )}
            <h2 className="text-xl font-bold mt-2">{product.title}</h2>
            <p className="text-gray-600 line-clamp-2">
              {product.description || ""}
            </p>
            <p className="text-lg font-semibold mt-2">
              ${product.price?.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
