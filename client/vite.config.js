import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const previewMode = process.env.BASE44_PREVIEW_MODE === '1';
const sandboxHost = process.env.BASE44_SANDBOX_HOST_DOMAIN;

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    // The preview proxy forwards the sandbox hostname, whose id rotates.
    allowedHosts: previewMode && sandboxHost ? [`.${sandboxHost}`] : undefined,
    hmr: previewMode ? { clientPort: 443, protocol: 'wss' } : undefined,
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET || 'http://localhost:8000',
        changeOrigin: false,
      },
    },
  },
});
