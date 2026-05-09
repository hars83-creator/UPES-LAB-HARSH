import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }

          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('scheduler')) {
            return 'react-vendor';
          }

          if (id.includes('framer-motion')) {
            return 'motion-vendor';
          }

          if (id.includes('recharts') || id.includes('d3-') || id.includes('victory-vendor')) {
            return 'chart-vendor';
          }

          if (id.includes('html2canvas')) {
            return 'html2canvas-vendor';
          }

          if (id.includes('dompurify')) {
            return 'dompurify-vendor';
          }

          if (id.includes('jspdf')) {
            return 'jspdf-vendor';
          }

          if (id.includes('lucide-react')) {
            return 'icon-vendor';
          }

          return 'vendor';
        }
      }
    }
  }
});
