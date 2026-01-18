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
      base: 'var(--color-base)',
      panel: 'var(--color-panel)',
      'panel-hover': 'var(--color-panel-hover)',
      elevated: 'var(--color-elevated)',

      // Borders
      'border-default': 'var(--color-border-default)',
      'border-subtle': 'var(--color-border-subtle)',
      'border-strong': 'var(--color-border-strong)',

      // Text
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      muted: 'var(--color-muted)',
      inverse: 'var(--color-inverse)',

      // Semantic colors
      accent: 'var(--color-accent)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      danger: 'var(--color-danger)',

      // Interactive states
      hover: 'var(--color-hover)',
      active: 'var(--color-active)',
    },

    fontFamily: {
      // Dual font strategy: Mono for data/editable, Sans for UI
      // Arabic font fallback included for RTL support
      mono: ['IBM Plex Mono', 'ui-monospace', 'Consolas', 'monospace'],
      sans: ['IBM Plex Sans', 'system-ui', '-apple-system', 'Arial', 'Tahoma', 'sans-serif'],
    },
  },

  preflights: [
    {
      getCSS: () => `
        /* Terminal aesthetic baseline */
        body {
          background-color: var(--color-base);
          color: var(--color-primary);
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
