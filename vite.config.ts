import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    rollupOptions: {
      treeshake: true,
      output: {
        minifyInternalExports: true,
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("@mui") || id.includes("@emotion")) {
              return "vendor_mui";
            }
            if (id.includes("react")) {
              return "vendor_react";
            }
            return "vendor";
          }
        },
      },
    },
  },
});
