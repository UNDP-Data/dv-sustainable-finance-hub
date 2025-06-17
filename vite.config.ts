import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import tailwindcss from '@tailwindcss/vite';
import { AtRule } from 'postcss';

export default defineConfig({
  plugins: [react(), eslint(), tailwindcss()],
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'remove-layers', // If you want to remove base layer
          AtRule: {
            layer(rule) {
              if (rule.params !== 'base') {
                rule.each(child => {
                  rule.parent.insertAfter(rule, child);
                });
                rule.remove();
              }
            },
          },
        },
        {
          postcssPlugin: 'wrap-with-undp-container', // If you want to wrap all the class in .undp-container
          Once(root) {
            const skipSelectors = ['html', 'body', ':root', ':host'];
            root.walkRules(rule => {
              if (rule.parent && rule.parent.type === 'atrule') {
                const parent = rule.parent as AtRule;
                if (parent.name === 'keyframes' || parent.name === 'supports') {
                  return;
                }
              }
              rule.selectors = rule.selectors.map(selector => {
                if (selector.startsWith('.undp-container')) return selector;
                if (skipSelectors.some(skip => selector.startsWith(skip)))
                  return selector;
                return `.undp-container ${selector}`;
              });
            });
          },
        },
      ],
    },
  },
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  server: {
    cors: {
      origin: '*',
      methods: ['GET'],
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
});
