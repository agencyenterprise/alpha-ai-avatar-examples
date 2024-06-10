import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'overlay': '#02061799',
        'overlay-hover': '#FFFFFF22',
        'btn-action': '#3574E0',
        'primary-box': '#2A76F5',
        'primary-box-text': '#FCFCFC',
        'secondary-box-text': '#202020',
      },
      maxWidth: {
        150: '150px',
        512: '512px',
        700: '700px',
        800: '800px',
      },
    },
  },
};

export default config;
