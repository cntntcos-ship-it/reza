import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Inside the Base44 sandbox the preview is served through a TLS proxy, so the
// HMR websocket has to dial wss://<preview host>:443 instead of the internal
// dev-server port. `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` (passed by compose)
// handles the host allowlist; nothing here applies outside the sandbox.
const previewMode = process.env.BASE44_PREVIEW_MODE === '1';
const apiTarget = process.env.VITE_API_PROXY || 'http://localhost:8000';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: previewMode ? { protocol: 'wss', clientPort: 443 } : undefined,
    proxy: {
      '/api': { target: apiTarget, changeOrigin: false },
    },
  },
});
