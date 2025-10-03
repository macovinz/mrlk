// tailwind.config.ts
import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'oklch(0.2138 0.0594 249.31)',
        accent: 'oklch(76.9% 0.188 70.08)',
        background: 'oklch(1 0 0)',
        foreground: 'oklch(0.141 0.005 285.823)',
        border: 'oklch(0.92 0.004 286.32)',
        input: 'oklch(0.92 0.004 286.32)',
        ring: 'oklch(0.795 0.184 86.047)',
        muted: 'oklch(0.552 0.016 285.938)',
        gold: 'oklch(0.141 0.005 285.823)',
        emerald: 'oklch(0.596 0.145 163.225)',
        ink: 'oklch(0.21 0.006 285.9)',
      },
      fontFamily: {
        // Body text

        // Headings / display
        heading: ['Poppins', ...fontFamily.sans],
        display: ['Poppins', ...fontFamily.sans],
      },
      fontWeight: {
        900: '900',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
