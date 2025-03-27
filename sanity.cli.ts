/**
 * This configuration file lets you run `$ sanity [command]` in this folder
 * Go to https://www.sanity.io/docs/cli to learn more.
 **/
import { defineCliConfig } from "sanity/cli";
import { resolve } from "@sentry/core";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

// I have to write below code to make it work with sanity, or it will occur "Rollup failed to resolve import" error.
export default defineCliConfig({
  api: { projectId, dataset },
  vite: {
    resolve: {
      alias: {
        "@/": `${resolve(__dirname, ".", "src")}/`,
      },
    },
  },
});
