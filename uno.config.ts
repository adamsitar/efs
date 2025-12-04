import { defineConfig, presetAttributify, presetIcons, presetWebFonts } from 'unocss';
import { presetWind4 } from 'unocss';

export default defineConfig({
  presets: [
    presetWind4(), // Tailwind v3 compatible (modern)
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'IBM Plex Sans:400,500,600,700',
        mono: 'IBM Plex Mono:400,500,600,700',
      },
    }),
  ],

  theme: {
    colors: {
      // Backgrounds
      base: '#000000', // Base background (pure black for OLED)
      panel: '#0a0a0a', // Panel background
      'panel-hover': '#141414', // Panel hover state
      elevated: '#1a1a1a', // Elevated elements (modals, popovers)

      // Borders
      'border-default': '#404040', // Default border color (visible against black)
      'border-subtle': '#262626', // Subtle borders
      'border-strong': '#525252', // Strong borders

      // Text
      primary: '#d4d4d4', // Primary text
      secondary: '#a3a3a3', // Secondary text
      muted: '#737373', // Muted text
      inverse: '#000000', // Inverse text (for light backgrounds)

      // Semantic colors
      accent: '#3b82f6', // Primary accent (blue)
      success: '#22c55e', // Success state (green)
      warning: '#f59e0b', // Warning state (orange)
      danger: '#ef4444', // Danger state (red)

      // Interactive states
      hover: '#1e293b', // Hover state
      active: '#334155', // Active/pressed state
      // focus: '#3b82f6', // Focus outline
    },

    fontFamily: {
      // Dual font strategy: Mono for data/editable, Sans for UI
      mono: ['IBM Plex Mono', 'ui-monospace', 'Consolas', 'monospace'],
      sans: ['IBM Plex Sans', 'system-ui', '-apple-system', 'sans-serif'],
    },
  },

  preflights: [
    {
      getCSS: ({ theme }) => `
        /* Terminal aesthetic baseline */
        body {
          background-color: ${theme.colors.base};
          color: ${theme.colors.primary};
          font-family: 'IBM Plex Sans', system-ui, -apple-system, sans-serif;
          font-weight: 500;
        }

        /* Allow percentage-based heights */
        html, body {
          height: 100%;
        }

        /* Root stacking context */
        #app {
          isolation: isolate;
        }

        /* Subtle rounding (adjustable - change to 0 for pure terminal look) */
        * {
          border-radius: 2px;
        }
      `,
    },
  ],

  shortcuts: {
    // Panel variants
    'panel-default': 'bg-panel',
    'panel-elevated': 'bg-elevated border border-border-default',

    // Text variants
    'text-primary': 'text-primary',
    'text-secondary': 'text-secondary',
    'text-muted': 'text-muted',

    // Border variants
    'border-default': 'border-border-default',
    'border-subtle': 'border-border-subtle',
    'border-strong': 'border-border-strong',

    // Focus state
    'focus-indicator': 'outline-2 outline-dashed outline-white outline-offset-[-2px]',
  },
});
