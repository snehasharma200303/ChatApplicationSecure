module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f5f8ff',
          100: '#eaf0ff',
          200: '#cfe0ff',
          300: '#a7c4ff',
          400: '#7aa5ff',
          500: '#4d86ff',
          600: '#2f6af4',
          700: '#244fcc',
          800: '#1c3aa3',
          900: '#162b80',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}