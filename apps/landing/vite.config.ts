import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uiKitSrc = path.resolve(__dirname, '../../packages/ui-kit/src');

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()] as PluginOption[],
  resolve: {
    alias: [
      // ui-kit specific paths
      {
        find: /^@\/lib\//,
        replacement: `${uiKitSrc}/lib/`,
      },
      {
        find: /^@\/components\/ui\//,
        replacement: `${uiKitSrc}/components/ui/`,
      },
      // General landing app alias - must come after more specific ones
      {
        find: '@',
        replacement: path.resolve(__dirname, './src'),
      },
    ],
  },
  server: {
    port: 3001,
  },
});
