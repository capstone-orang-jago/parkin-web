import { Geist_Mono, Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";

/** Satu instance per font — dipakai `app/layout.tsx` dan boleh diimpor komponen klien untuk className. */
export const fontBody = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const fontDisplay = Instrument_Serif({
  variable: "--font-brand-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});
