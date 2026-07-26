import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Inter_Tight,
  Martian_Mono,
} from "next/font/google";
import "./globals.css";

/* Display — variable, so the optical-size and width axes stay live.
 * Weights are set in CSS (700–800 on display, 600 on sub-headings). */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});

const utility = Martian_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-utility",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PRESSMARK — Custom printed clothing and large format, made in Kent",
  description:
    "Screen printing, DTG, embroidery and large-format print in Medway. Upload your artwork, approve the proof the same working day, see the price before you commit.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-GB"
      className={`${display.variable} ${body.variable} ${utility.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
