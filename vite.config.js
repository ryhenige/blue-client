import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/",
  resolve: {
    alias: {
      "constants": path.resolve(__dirname, "./src/constants"),
      "helpers": path.resolve(__dirname, "./src/helpers"),
      "hooks": path.resolve(__dirname, "./src/hooks"),
      "pages": path.resolve(__dirname, "./src/pages"),
      "components": path.resolve(__dirname, "./src/components"),
      "public": path.resolve(__dirname, "./public"),
      "ui/colors": path.resolve(__dirname, "./src/constants/ui/colors"),
      "ui/sizes": path.resolve(__dirname, "./src/constants/ui/sizes"),
    },
  },
  server: {
    port: 5173,
    watch: {
      usePolling: true, // Forces Vite to detect changes
    },
  },
  allowedHosts: ["localhost:5022"],
});