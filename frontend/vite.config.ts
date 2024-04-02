import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  define: {
    global: {}
  },
  plugins: [react(), tsconfigPaths(), nodePolyfills()]
});
