import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uiKitSrc = path.resolve(__dirname, '../../packages/ui-kit/src');

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()] as PluginOption[],
  resolve: {
    alias: [
      // More specific: ui-kit paths (check if it's in ui-kit context)
      {
        find: /^@\/(lib|components)\//,
        replacement: `${uiKitSrc}/$1/`,
      },
      // General web app alias
      {
        find: '@',
        replacement: path.resolve(__dirname, './src'),
      },
    ],
  },
});
