import type { Metadata } from "next";
import { fontBody, fontDisplay, fontMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ParkIn Palu — Dashboard",
    template: "%s — ParkIn Palu",
  },
  icons: {
    icon: "/favicon.ico",
  },
  description:
    "Dashboard admin untuk memantau transaksi, lokasi parkir, dan petugas ParkIn Palu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${fontBody.variable} ${fontDisplay.variable} ${fontMono.variable} h-full antialiased`}
    >
      <body className={`${fontBody.className} min-h-full`}>{children}</body>
    </html>
  );
}
