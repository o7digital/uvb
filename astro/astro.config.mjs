import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://uvb.edu.mx',
  output: 'static',
  integrations: [sitemap()],
});
