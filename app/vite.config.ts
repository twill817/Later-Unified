import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'node:path';

// The app imports the design system straight from ../design-system/src, so Storybook and the app share one source.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  resolve: {
    alias: { '@ds': path.resolve(import.meta.dirname, '../design-system/src/index.ts') },
    // One copy of React, even for files that live in ../design-system.
    dedupe: ['react', 'react-dom'],
  },
  server: { fs: { allow: ['..'] } },
});
