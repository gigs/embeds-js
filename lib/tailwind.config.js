import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [forms({ strategy: 'class' })],
}
