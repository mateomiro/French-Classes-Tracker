/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#EEF2FF',
          600: '#4F46E5'
        },
        blue: {
          50: '#EFF6FF'
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          400: '#9CA3AF',
          800: '#1F2937',
          900: '#111827'
        },
        red: {
          50: '#FEF2F2',
          400: '#F87171'
        }
      }
    }
  },
  plugins: []
}
