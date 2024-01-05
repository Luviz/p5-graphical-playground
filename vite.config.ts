import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import plainText from "vite-plugin-plain-text";
import path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    plainText(["**/*.text", "**/*.glsl", "**/*.frag", "**/*.vert"], {}),
    splitVendorChunkPlugin(),
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          p5: ["p5"],
          "react-p5": ["react-p5"],
        },
      },
    },
  },
});
