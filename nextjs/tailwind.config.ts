// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx,mdx}',
    './app/**/*.{ts,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        // Sans or base body (example – map to Shippori)
        sans: ['var(--font-shippori-mincho)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Display / headings (example – Hannari as display)
        display: ['var(--font-hannari-mincho)', 'serif'],
      }
    }
  },
  plugins: []
};

export default config;

