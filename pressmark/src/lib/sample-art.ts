/* Stand-in customer artwork — the file the "use a sample" button loads, and the
 * marks already sitting on the basket lines. Inline SVG data URIs rather than
 * files in /public so the garment plate can paint them with no network round
 * trip and no missing-asset state to design for.
 *
 * BAILEY_FC deliberately carries a white box behind the mark, so the
 * transparency warning in the preflight panel is telling the truth about it. */

export const svg = (body: string, w = 600, h = 420) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`,
  );

export const BAILEY_FC = svg(
  `<rect width="600" height="420" fill="#ffffff"/>
   <circle cx="300" cy="170" r="86" fill="none" stroke="#14181B" stroke-width="9"/>
   <circle cx="300" cy="170" r="66" fill="none" stroke="#14181B" stroke-width="2"/>
   <rect x="152" y="150" width="296" height="40" fill="#E6007E"/>
   <text x="300" y="179" text-anchor="middle" font-family="monospace" font-size="27" letter-spacing="5" fill="#ffffff">BAILEY FC</text>
   <text x="300" y="330" text-anchor="middle" font-family="monospace" font-size="21" letter-spacing="9" fill="#14181B">EST. 1974</text>`,
);

export const MEDWAY_10K = svg(
  `<text x="300" y="150" text-anchor="middle" font-family="monospace" font-size="96" font-weight="bold" letter-spacing="-2" fill="#14181B">10K</text>
   <path d="M120 190 H480" stroke="#14181B" stroke-width="6"/>
   <text x="300" y="248" text-anchor="middle" font-family="monospace" font-size="32" letter-spacing="12" fill="#14181B">MEDWAY</text>
   <text x="300" y="300" text-anchor="middle" font-family="monospace" font-size="22" letter-spacing="8" fill="#14181B">MARCH 2026</text>`,
);
