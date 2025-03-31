import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "title",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "description",
      type: "text",
    }),
    defineField({
      name: "price",
      title: "price",
      type: "number",
    }),
    defineField({
      name: "image",
      title: "image",
      type: "image",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "productCategory" }],
    }),
  ],
});
