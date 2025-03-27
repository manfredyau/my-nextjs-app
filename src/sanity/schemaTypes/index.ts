import { type SchemaTypeDefinition } from "sanity";
import { productCategory } from "@/sanity/schemaTypes/product-category";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [productCategory],
};
