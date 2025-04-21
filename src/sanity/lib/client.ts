import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId } from '../env';
import { sanityFetch } from '@/sanity/lib/live';
import { Product, ProductCategory } from '@/sanity.types';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
});

export const getAllProducts: () => Promise<Product[]> = async () => {
  // Make sure the _type here matches the type defined in sanity.types.ts
  const query = '*[_type == "product"]';
  return (await sanityFetch({ query })).data;
};

export const getAllCategories: () => Promise<ProductCategory[]> = async () => {
  // Make sure the _type here matches the type defined in sanity.types.ts
  const query = '*[_type == "productCategory"]';
  return (await sanityFetch({ query })).data;
};

export const getCategoryBySlug = async (slug: string) => {
  // Make sure the _type here matches the type defined in sanity.types.ts
  const query = `*[_type == "productCategory" && slug.current == $slug][0]`;
  const category = (await sanityFetch({ query, params: { slug } })).data;
  return category as ProductCategory;
};

export const getProductsByCategorySlug = async (slug: string) => {
  // Make sure the _type here matches the type defined in sanity.types.ts
  const query = `*[_type == "product" && references(*[_type == "productCategory" && slug.current == $slug][0]._id)]`;
  const products = await sanityFetch({ query, params: { slug } });
  return products.data as Product[];
};

export const searchProducts = async (searchTerm: string) => {
  // Make sure the _type here matches the type defined in sanity.types.ts
  const query = `*[_type == "product" && (
  title match "*" + $searchTerm + "*" || 
  description match "*" +$searchTerm + "*" || 
  category->title match "*" + $searchTerm + "*" ||
  category->slug.current match "*" + $searchTerm + "*"  
  )]`;
  const products = await sanityFetch({ query, params: { searchTerm } });
  return products.data as Product[];
};
