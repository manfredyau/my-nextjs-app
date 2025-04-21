import { type SchemaTypeDefinition } from "sanity";
import { productCategory } from "@/sanity/schemaTypes/schemas/product-category";
import { product } from "@/sanity/schemaTypes/schemas/product";
import { promotionCode } from "@/sanity/schemaTypes/schemas/promotion-code";
import { promotionCampaign } from "@/sanity/schemaTypes/schemas/promotion-campaign";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [productCategory, product, promotionCode, promotionCampaign],
};
