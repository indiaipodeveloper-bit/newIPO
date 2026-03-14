import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {

  const isDev = mode === "development";

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      proxy: {
        "/api": {
          target: isDev
            ? "http://localhost:5000"
            : "https://ipoapi.padmanutri.com",
          changeOrigin: true,
          secure: false,
        },
        "/uploads": {
          target: isDev
            ? "http://localhost:5000"
            : "https://ipoapi.padmanutri.com",
          changeOrigin: true,
          secure: false,
        },
      },
    },

    plugins: [
      react(),
      mode === "development" && componentTagger()
    ].filter(Boolean),

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});