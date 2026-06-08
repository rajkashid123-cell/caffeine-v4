import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'app': 'var(--color-bg)',
        'surface': 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        'accent': 'var(--color-accent)',
        'accent-fg': 'var(--color-accent-fg)',
        'moon': 'var(--color-moon)',
        'primary': 'var(--color-text)',
        'muted': 'var(--color-text-muted)',
        'border-default': 'var(--color-border)',        /* Semantic status */
        'status-deployed': 'var(--color-status-deployed)',
        'status-deployed-bg': 'var(--color-status-deployed-bg)',
        'status-building': 'var(--color-status-building)',
        'status-building-bg': 'var(--color-status-building-bg)',
        'status-error': 'var(--color-status-error)',
        'status-error-bg': 'var(--color-status-error-bg)',
        'status-ready': 'var(--color-status-ready)',
        'status-ready-bg': 'var(--color-status-ready-bg)',
        'status-success': 'var(--color-status-success)',
        'status-success-bg': 'var(--color-status-success-bg)',
        'status-warning': 'var(--color-status-warning)',
        'status-warning-bg': 'var(--color-status-warning-bg)',
        /* Semantic priority */
        'priority-high': 'var(--color-priority-high)',
        'priority-high-bg': 'var(--color-priority-high-bg)',
        'priority-medium': 'var(--color-priority-medium)',
        'priority-medium-bg': 'var(--color-priority-medium-bg)',
        'priority-low': 'var(--color-priority-low)',
        'priority-low-bg': 'var(--color-priority-low-bg)',
        /* Semantic maturity */
        'maturity-idea': 'var(--color-maturity-idea)',
        'maturity-progress': 'var(--color-maturity-progress)',
        'maturity-live': 'var(--color-maturity-live)',
        'maturity-archived': 'var(--color-maturity-archived)',
        /* Entry types */
        'entry-build': 'var(--color-entry-build)',
        'entry-rebuild': 'var(--color-entry-rebuild)',
        'entry-deploy': 'var(--color-entry-deploy)',
        'entry-rollback': 'var(--color-entry-rollback)',
        'entry-edit': 'var(--color-entry-edit)',
        /* Roles */
        'role-owner': 'var(--color-role-owner)',
        'role-admin': 'var(--color-role-admin)',
        'role-member': 'var(--color-role-member)',
        /* Code syntax */
        'code-bg': 'var(--color-code-bg)',
        'code-surface': 'var(--color-code-surface)',
        'code-border': 'var(--color-code-border)',
        'code-muted': 'var(--color-code-muted)',
        'code-text': 'var(--color-code-text)',
        /* Overlay */
        'overlay-bg': 'var(--color-overlay-bg)',
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        full: "var(--radius-full)",
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
        "xs-plus": ["0.6875rem", { lineHeight: "1.1rem" }],
        "sm-minus": ["0.75rem", { lineHeight: "1.15rem" }],
        "sm-plus": ["0.8125rem", { lineHeight: "1.25rem" }],
      },
      spacing: {
        "icon-xs": "12px",
        "icon-sm": "14px",
        "icon-md": "16px",
        "icon-lg": "20px",
        "icon-xl": "24px",
      },
      zIndex: {
        base: "0",
        dropdown: "50",
        sticky: "100",
        modal: "200",
        popover: "300",
        toast: "400",
      },
      colors: {
        "mode-accent": "var(--color-accent)",
        "mode-accent-subtle": "var(--color-accent-subtle)",
        "mode-accent-fg": "var(--color-accent-fg)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        elevated: "var(--shadow-elevated)",
        "neon-glow": "var(--shadow-neon-glow)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.15s ease-out",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};
