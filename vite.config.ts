import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Moussa Abdou Salam — .NET Architect Portfolio',
          short_name: 'Salam.dev',
          description: 'Portfolio professionnel de Moussa Abdou Salam — Architecte .NET & Développeur Full Stack',
          theme_color: '#060709',
          background_color: '#060709',
          display: 'standalone',
          icons: [
            {
              src: '/assets/maphotops600.jpg',
              type: 'image/jpeg',
              sizes: '512x512',
              purpose: 'any'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,woff2}'],
          navigateFallbackDenylist: [/^\/api\//],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is enabled for development
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: {
        ignored: ['**/portfolio-cms-data.json', '**/*.json', '**/dist/**']
      },
    },
  };
});
