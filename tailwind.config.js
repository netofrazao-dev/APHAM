/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Azul marinho — cor institucional principal (fundos escuros, títulos)
        navy: {
          50: '#eef3fb',
          100: '#d7e2f4',
          200: '#b0c5e8',
          300: '#819fd6',
          400: '#5278c0',
          500: '#365ba6',
          600: '#284785',
          700: '#20396b',
          800: '#182a50',
          900: '#101d39',
          950: '#0a1326',
        },
        // Azul ciano — cor de destaque (botões, links, detalhes) — da logo da APHAM
        cyan: {
          50: '#e8f8ff',
          100: '#ccefff',
          200: '#9fe1ff',
          300: '#63ccff',
          400: '#33b6f5',
          500: '#12a0e6',
          600: '#0881c2',
          700: '#0a6699',
          800: '#10567d',
          900: '#143f5c',
        },
        // Grafismos marajoaras da logo (usados em pequenos detalhes)
        marajo: { red: '#e23b32', green: '#36c23a' },
        paper: '#f5f8fd',
        ink: '#0f1b30',
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(16, 29, 57, 0.25)',
        lift: '0 24px 60px -20px rgba(16, 29, 57, 0.38)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        kenburns: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.12) translate(-1.5%, -1.5%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out both',
        float: 'float 6s ease-in-out infinite',
        kenburns: 'kenburns 12s ease-out both',
      },
    },
  },
  plugins: [],
}
