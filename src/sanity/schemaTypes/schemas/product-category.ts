import { defineField, defineType } from "sanity";

export const productCategory = defineType({
  name: "productCategory",
  title: "Product Category",
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
      name: "slug",
      title: "slug",
      type: "slug",
    }),
  ],
});
