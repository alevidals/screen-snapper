import { defineConfig, envField } from "astro/config";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  trailingSlash: "never",
  experimental: {
    env: {
      schema: {
        BASE_URL: envField.string({
          context: "client",
          access: "public",
        }),
      },
    },
  },
});
