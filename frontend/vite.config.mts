import { createHash } from "crypto";

if (!(globalThis as any).crypto) {
  (globalThis as any).crypto = {};
}

if (!(globalThis as any).crypto.subtle) {
  (globalThis as any).crypto.subtle = {
    digest: (algorithm: string, data: BufferSource) => {
      return Promise.resolve(
        createHash("sha256")
          .update(Buffer.from(data as any))
          .digest()
      );
    },
  };
}

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
