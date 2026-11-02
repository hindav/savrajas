import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 3001,
    host: true,
    open: false,
    watch: {
      ignored: ['**/dist/**', '**/.git/**', '**/*.mp4']
    }
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
        catalogue: resolve(__dirname, 'college-project-catelogue/index.html'),
        catalogueClean: resolve(__dirname, 'college-project-catelogue.html')
      }
    }
  }
});
