import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    viteStaticCopy({
      targets: [
        { src: 'src/assets/bg.jpg', dest: 'assets' },
      ],
    }),
  ],
  server: {
    open: false,
    port: 5173,
    host: 'demo.local',
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'demo.local',
    },
    watch: {
      usePolling: true
    },
    allowedHosts: ["demo.local"],
  },
});
