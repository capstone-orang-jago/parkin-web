import type { Metadata } from "next";
import Landing from "@/components/landing/landing";

export const metadata: Metadata = {
  title: "ParkIn Palu — Parkir Digital QR Code",
  description:
    "ParkIn menggantikan karcis dan uang tunai dengan scan QR. Tarif resmi motor Rp2.000 dan mobil Rp4.000, pembayaran tercatat, dan Dishub Kota Palu bisa memantaunya langsung. Capstone Project Jurusan Teknologi Informasi, Fakultas Teknik, Universitas Tadulako.",
  openGraph: {
    title: "ParkIn Palu — Parkir Digital QR Code",
    description:
      "Parkir di Palu, tanpa uang pas. Scan QR petugas, bayar, dan semuanya tercatat.",
    type: "website",
  },
};

export default function Home() {
  return <Landing />;
}
