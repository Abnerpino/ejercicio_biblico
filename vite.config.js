import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    viteSingleFile()
  ],
  build: {
    target: 'esnext',
    assetsInlineLimit: Infinity, // asegura que todas las imágenes y fuentes también se embeban
  },
});
