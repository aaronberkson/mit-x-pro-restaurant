import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mkcert from "vite-plugin-mkcert"; // Adding mkcert for HTTPS support

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react(), tailwindcss(), mkcert()],
    define: {
      "process.env": env,
    },
    server: {
      port: 5173, // Default Vite development port
      open: true, // Automatically open the browser
      https: true, // Enable HTTPS via mkcert
    },
    build: {
      outDir: "dist", // Output directory for production builds
      sourcemap: true, // Generate source maps for debugging
      rollupOptions: {
        external: ["bootstrap"], // Treat Bootstrap as an external dependency
      },
    },
    resolve: {
      alias: {
        "@": "/src", // Optional alias for cleaner imports
      },
    },
  };
});
