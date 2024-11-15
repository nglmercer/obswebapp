import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { resolve } from 'node:path';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {},
  alias: {
    '@': resolve(__dirname, './src'),
    '@obs-websocket-js': resolve(__dirname, 'node_modules/obs-websocket-js'),
  },
});
/* //export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        external: ['obs-websocket-js', '@obs-websocket-js'],
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {},
  alias: {
    '@': resolve(__dirname, './src'),
  },
});
 */