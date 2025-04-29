import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { configureLogging } from "./utils/ChatLogger.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const hostname = env.CLOUDFLARE_TUNNEL_HOSTNAME || "localhost";

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: true,
      port: 5173,
      allowedHosts: [hostname],
      proxy: {
        "/api/ollama": {
          target: "http://localhost:11434",
          changeOrigin: true,
          headers: {
            Host: "localhost:11434",
            Origin: "http://localhost:11434",
          },
          rewrite: () => "/api/chat",
          configure: configureLogging,
        },
      },
    },
  };
});
