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
        sans: 'IBM Plex Sans:300,400,500,600,700',
        mono: 'IBM Plex Mono:300,400,500,600,700',
      },
    }),
  ],

  safelist: [
    // Gap classes for layout primitives (vstack, hstack)
    'gap-1',
    'gap-2',
    'gap-3',
    'gap-4',
    'gap-6',
    'gap-8',
    // Alignment classes for hstack primitive
    'items-start',
    'items-center',
    'items-end',
    // Text colors
    'text-primary',
    'text-secondary',
    'text-muted',
    // Focus indicator (shortcut and component classes)
    'focus-indicator',
    'outline-2',
    'outline-dashed',
    'outline-white',
    'outline-offset-[-2px]',
    // Flight strip grid layout
    'grid-cols-[1fr_40px_120px]',
    'grid-cols-[1fr_120px]',
    'grid-cols-[auto_1fr_120px]',
    'min-w-8',
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
          font-weight: 400;
        }

        /* Allow percentage-based heights */
        html, body {
          height: 100%;
        }

        /* Root stacking context */
        #app {
          isolation: isolate;
        }

        .focus-indicator{
          outline: 2px dashed white;
          outline-offset: -2px;
        }


        /* Active (directly focused element) - thinner dotted line */
        .focus-indicator-active {
          outline: 1.5px dashed white;
          outline-offset: -1.5px;
        }

        /* Ancestor (in focus path but not directly focused) - subtle solid line */
        .focus-indicator-ancestor {
          outline: 1px solid white; 
          outline-offset: -1px;
        }

        /* Subtle rounding (adjustable - change to 0 for pure terminal look) */
        * {
          border-radius: 0px;
        }
      `,
    },
  ],

  shortcuts: {
    // Panel variants
    'panel-default': 'bg-panel',
    'panel-elevated': 'bg-elevated border border-border-default',

    // Border variants
    'border-default': 'border-border-default',
    'border-subtle': 'border-border-subtle',
    'border-strong': 'border-border-strong',

    // Focus state
    // 'focus-indicator': 'outline-2 outline-dashed outline-white outline-offset-[-2px]',
  },
});
