import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    'process.env.CAL_OAUTH_CLIENT_ID': JSON.stringify(process.env.CAL_OAUTH_CLIENT_ID),
    'process.env.CAL_OAUTH_CLIENT_SECRET': JSON.stringify(process.env.CAL_OAUTH_CLIENT_SECRET),
    'process.env.CAL_API_URL': JSON.stringify(process.env.CAL_API_URL),
  },
}));
