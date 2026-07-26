import type { Config } from "tailwindcss";

/* PRESSMARK — Tailwind maps to the CSS variables in src/app/globals.css.
 * Nothing here declares a raw colour; globals.css owns the values. */

export default {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    /* Replaces the default scale, so p-5 / p-7 / p-10 simply don't exist.
     * 4 8 12 16 24 32 48 64 96 128, plus 72 for the mobile section rhythm. */
    spacing: {
      "0": "0px",
      px: "1px",
      "1": "4px",
      "2": "8px",
      "3": "12px",
      "4": "16px",
      "6": "24px",
      "8": "32px",
      "12": "48px",
      "16": "64px",
      "18": "72px",
      "24": "96px",
      "32": "128px",
    },
    /* Effectively square. Circles are opt-in via rounded-full (ink chips only). */
    borderRadius: {
      none: "0px",
      DEFAULT: "2px",
      sm: "2px",
      md: "2px",
      lg: "2px",
      xl: "2px",
      "2xl": "2px",
      "3xl": "2px",
      "4xl": "2px",
      full: "9999px",
    },
    extend: {
      colors: {
        press: "var(--press)",
        "press-2": "var(--press-2)",
        wash: "var(--wash)",
        paper: "var(--paper)",
        ink: "var(--ink)",
        magenta: "var(--magenta)",
        amber: "var(--amber)",
        cyan: "var(--cyan)",
        rule: "var(--rule)",
        "rule-dk": "var(--rule-dk)",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-utility)", "ui-monospace", "monospace"],
      },
      fontSize: {
        display: [
          "clamp(3.5rem, 9vw, 8.5rem)",
          { lineHeight: "0.88", letterSpacing: "-0.03em", fontWeight: "800" },
        ],
        section: [
          "clamp(2rem, 4vw, 3.5rem)",
          { lineHeight: "0.95", letterSpacing: "-0.03em", fontWeight: "700" },
        ],
        sub: ["1.375rem", { lineHeight: "1.3", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.6" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
        utility: ["0.75rem", { lineHeight: "1", letterSpacing: "0.12em" }],
      },
      letterSpacing: { display: "-0.03em", utility: "0.12em" },
      maxWidth: { content: "1440px", measure: "68ch" },
      borderColor: { DEFAULT: "var(--rule)" },
      transitionTimingFunction: { squeegee: "cubic-bezier(0.65, 0, 0.35, 1)" },
      transitionDuration: {
        squeegee: "420ms",
        wipe: "180ms",
        dissolve: "600ms",
        type: "300ms",
      },
    },
  },
} satisfies Config;
