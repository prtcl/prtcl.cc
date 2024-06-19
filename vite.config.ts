import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import tsconfigPaths from 'vite-tsconfig-paths';

const author = "Cory O'Brien";
const description = `${author} is a software engineer and sound artist who lives in NYC`;
const canonical = 'http://prtcl.cc';

const html = () =>
  createHtmlPlugin({
    minify: true,
    entry: 'main.tsx',
    template: 'index.html',
    inject: {
      data: {
        title: 'prtcl.cc',
      },
      tags: [
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
      ],
    },
  });

export default defineConfig(() => {
  return {
    root: './src',
    envDir: '../',
    build: {
      outDir: '../dist',
      assetsDir: 'a',
      emptyOutDir: true,
      output: {
        assetFileNames: 'a/asset-[hash][extname]',
        chunkFileNames: 'a/chunk-[hash].js',
        entryFileNames: 'a/client-[hash].js',
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
