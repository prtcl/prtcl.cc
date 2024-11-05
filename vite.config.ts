import react from '@vitejs/plugin-react';
import { defineConfig, type HtmlTagDescriptor } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import tsconfigPaths from 'vite-tsconfig-paths';

const html = () => {
  const author = "Cory O'Brien";
  const description = `${author} is a software engineer and sound artist who lives in NYC`;
  const canonical = 'http://prtcl.cc';

  const tags: HtmlTagDescriptor[] = [
    {
      injectTo: 'head',
      tag: 'link',
      attrs: {
        ref: 'canonical',
        content: canonical,
      },
    },
    {
      injectTo: 'head',
      tag: 'meta',
      attrs: {
        name: 'author',
        content: author,
      },
    },
    {
      injectTo: 'head',
      tag: 'meta',
      attrs: {
        name: 'description',
        content: description,
      },
    },
    {
      injectTo: 'head',
      tag: 'meta',
      attrs: {
        name: 'theme-color',
        content: '#fff',
      },
    },
    {
      injectTo: 'head',
      tag: 'meta',
      attrs: {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, user-scalable=no',
      },
    },
  ];

  return createHtmlPlugin({
    minify: true,
    entry: 'main.tsx',
    template: 'index.html',
    inject: {
      data: { title: 'prtcl.cc' },
      tags,
    },
  });
};

export default defineConfig(() => {
  return {
    root: './src',
    envDir: '../',
    build: {
      outDir: '../dist',
      assetsDir: 'a',
      emptyOutDir: true,
      target: 'esnext',
      sourcemap: false,
      output: {
        assetFileNames: 'a/asset-[hash][extname]',
        chunkFileNames: 'a/chunk-[hash].js',
        entryFileNames: 'a/client-[hash].js',
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
    },
    server: {
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    preview: {
      port: 8080,
      host: '0.0.0.0',
    },
    css: {
      devSourcemap: true,
    },
    plugins: [tsconfigPaths(), react({ include: '**/*.{jsx,tsx}' }), html()],
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs'],
    },
  };
});
