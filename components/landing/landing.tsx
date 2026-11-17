"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Download,
  LogIn,
  MapPin,
  Monitor,
  Server,
  Smartphone,
  Users,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// v2 — "Satu scan": bukan lagi daftar fitur berurutan, tapi satu momen yang
// diperbesar. Karcis digital hidup di hero (timer QR + tarif yang terkunci),
// lalu alur bayar diceritakan lewat scroll: layar HP berganti mengikuti
// langkahnya. Selera Avav dipertahankan: hero gelap, serif raksasa, sudut
// tajam, teks mudah dibaca, urutan tim, footer tanpa kolom kode sumber.

const DRIVE_URL =
  "https://drive.google.com/drive/folders/138yF_tEOmi3Vr6Z7SeeJ59mQXyBiQX8c?usp=sharing";

const TEAM = [
  "Avav Abdillah Sam",
  "Rasya Rahmat Syaban",
  "Ahmad Mujahid",
  "Lila Vimala",
  "Marcello Daud M. Liling",
  "Cahya Nabila Mannasai",
];

type Vehicle = "motor" | "mobil";

const TARIFF: Record<Vehicle, { label: string; price: string; desc: string }> = {
  motor: { label: "Motor", price: "Rp2.000", desc: "Sepeda motor & sejenisnya, per sekali parkir." },
  mobil: { label: "Mobil", price: "Rp4.000", desc: "Mobil, SUV & sejenisnya, per sekali parkir." },
};

// Layar asli dari laporan capstone (Gambar 3.4–3.19), dipotong per layar HP.
const PAY_STEPS = [
  {
    n: "01",
    title: "Isi saldo dulu",
    body: "Top up lewat Midtrans, mulai Rp10.000. Pilih Rp10.000, Rp20.000, Rp50.000, Rp100.000, atau nominal sendiri. Saldo langsung terlihat di Beranda.",
    image: "/landing/report-topup.jpg",
    imageAlt: "Layar Top Up Saldo ParkIn, pilih nominal Rp10.000 sampai Rp100.000",
    imageCaption: "Tampilan asli aplikasi — pilih nominal top up.",
  },
  {
    n: "02",
    title: "Pilih kendaraan, tarifnya terkunci",
    body: "Motor Rp2.000, mobil Rp4.000 — angkanya sudah tertulis di layar sebelum bayar. Bukan petugas yang menentukan, sistem yang mengunci.",
    image: "/landing/report-bayar-parkir.jpg",
    imageAlt: "Layar Bayar Parkir ParkIn, motor Rp2.000 dan mobil Rp4.000",
    imageCaption: "Tampilan asli aplikasi — tarif terlihat sebelum scan.",
  },
  {
    n: "03",
    title: "Scan QR petugas",
    body: "Arahkan kamera ke QR yang ditampilkan petugas. QR itu berubah tiap 4 menit dan ditandai HMAC — QR yang difoto kemarin tidak bisa dipakai lagi hari ini.",
    image: "/landing/report-scan-qr.jpg",
    imageAlt: "Layar Scan QR Petugas ParkIn dengan bingkai kamera",
    imageCaption: "Tampilan asli aplikasi — kamera diarahkan ke QR petugas.",
  },
  {
    n: "04",
    title: "Konfirmasi, selesai, ada buktinya",
    body: "Saldo terpotong, struk dan riwayat tersimpan di HP pengguna. Di saat yang sama, petugas melihat rekap hariannya dan Dishub melihat transaksi itu masuk ke dashboard.",
    image: "/landing/report-bayar-berhasil.jpg",
    imageAlt: "Layar Pembayaran Berhasil ParkIn, Rp2.000 dengan bukti transaksi",
    imageCaption:
      "Tampilan asli aplikasi — contoh transaksi di Pasar Inpres Palu, petugas Pak Hasan, saldo Rp47.500 menjadi Rp45.500.",
  },
];

type Role = "pengguna" | "petugas" | "dishub";

const ROLES: Record<
  Role,
  {
    label: string;
    title: string;
    desc: string;
    points: string[];
    image: string;
    imageAlt: string;
    imageCaption: string;
    wide?: boolean;
  }
> = {
  pengguna: {
    label: "Pengguna",
    title: "Buat pengendara: bayar, selesai, ada buktinya.",
    desc: "Tidak perlu uang pas, tidak perlu menunggu karcis. Saldo terlihat jelas, riwayat tersimpan.",
    points: [
      "Daftar, lalu verifikasi nomor lewat kode OTP WhatsApp 6 digit.",
      "Top up saldo lewat Midtrans, mulai Rp10.000.",
      "Pilih motor atau mobil, scan QR petugas, lalu konfirmasi. Saldo terpotong otomatis.",
      "Riwayat dan detail tiap transaksi bisa dibuka lagi kapan saja.",
    ],
    image: "/landing/mobile-pengguna-home.jpg",
    imageAlt: "Beranda aplikasi ParkIn untuk pengguna, saldo Rp59.000",
    imageCaption:
      "Tampilan asli aplikasi. Beranda pengguna dengan saldo contoh Rp59.000.",
  },
  petugas: {
    label: "Petugas",
    title: "Buat juru parkir: QR-nya yang bekerja, bukan ingatan.",
    desc: "Petugas resmi menampilkan QR dari HP-nya. Tidak ada karcis yang bisa dipalsukan atau dipakai ulang.",
    points: [
      "Login dengan akun petugas resmi yang dibuat admin.",
      "QR Code dinamis: berubah tiap 4 menit dan ditandai HMAC, jadi tidak bisa disalin begitu saja.",
      "Rekap hari ini langsung terlihat: total motor, total mobil, dan pendapatan.",
      "Riwayat transaksi harian tercatat per petugas dan per lokasi.",
    ],
    image: "/landing/mobile-petugas-home.jpg",
    imageAlt: "Beranda aplikasi ParkIn untuk petugas, rekap hari ini dan tombol tampilkan QR",
    imageCaption:
      "Tampilan asli aplikasi. Beranda petugas di lokasi perdos dengan angka rekap contoh.",
  },
  dishub: {
    label: "Dishub / Admin",
    title: "Buat Dishub: semua transaksi terlihat, tanpa menunggu laporan bulanan.",
    desc: "Dulu laporan pendapatan datang sebulan sekali, manual. Sekarang dashboard memantau transaksi, lokasi, dan petugas secara real-time.",
    points: [
      "Dashboard ringkasan: transaksi, pendapatan, motor, mobil, lokasi dan petugas aktif.",
      "Kelola lokasi parkir dan akun petugas (tambah, ubah, nonaktifkan).",
      "Laporan pendapatan bisa difilter per tanggal, lokasi, dan jenis kendaraan, lalu diekspor.",
      "Setiap transaksi punya kode, waktu, lokasi, petugas, dan status untuk keperluan audit.",
    ],
    image: "/landing/web-dashboard.png",
    imageAlt: "Dashboard web ParkIn Palu, ringkasan operasional dan tren 7 hari",
    imageCaption:
      "Tampilan asli dashboard web. Ringkasan operasional 30 Mei 2026 dengan data contoh.",
    wide: true,
  },
};

const MARQUEE =
  "MOTOR Rp2.000 ✦ MOBIL Rp4.000 ✦ SCAN QR ✦ TANPA UANG PAS ✦ TARIF TERKUNCI ✦ QR BERUBAH 4 MENIT ✦ ";

export default function Landing() {
  const root = useRef<HTMLDivElement>(null);
  const [vehicle, setVehicle] = useState<Vehicle>("motor");
  const [qrSeconds, setQrSeconds] = useState(240);

  // Simulasi siklus QR 4 menit di hero: berdetak, lalu mulai lagi dari 4:00.
  useEffect(() => {
    const id = window.setInterval(() => {
      setQrSeconds((s) => (s <= 1 ? 240 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const qrClock = `${Math.floor(qrSeconds / 60)}:${String(qrSeconds % 60).padStart(2, "0")}`;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      gsap.from(".hero-el", {
        y: 28,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.09,
        ease: "power3.out",
        clearProps: "all",
      });

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, {
          y: 32,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      gsap.to(".hero-phone-main", {
        y: -14,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      const mm = gsap.matchMedia();
      // Cerita bayar yang di-pin: di desktop, scroll menggerakkan langkah
      // dan layar HP berganti. Di HP/tablet, langkah tampil berurutan biasa.
      mm.add("(min-width: 1024px)", () => {
        const steps = gsap.utils.toArray<HTMLElement>(".pay-step");
        const phones = gsap.utils.toArray<HTMLElement>(".pay-phone");
        gsap.set(steps.slice(1), { autoAlpha: 0 });
        gsap.set(phones.slice(1), { autoAlpha: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "#cara-kerja",
            start: "top top",
            end: "+=2600",
            pin: true,
            scrub: 0.6,
          },
        });
        for (let i = 1; i < steps.length; i++) {
          tl.to(steps[i - 1], { autoAlpha: 0, y: -32, duration: 0.6, ease: "power2.inOut" }, i - 1)
            .to(phones[i - 1], { autoAlpha: 0, duration: 0.6, ease: "power2.inOut" }, "<")
            .fromTo(
              steps[i],
              { autoAlpha: 0, y: 40 },
              { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
              "<",
            )
            .fromTo(
              phones[i],
              { autoAlpha: 0, scale: 0.96 },
              { autoAlpha: 1, scale: 1, duration: 0.6, ease: "power2.out" },
              "<",
            );
        }
        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // Harga tarif beranimasi tiap ganti kendaraan.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      "#tarif-price",
      { y: 16, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" },
    );
  }, [vehicle]);

  return (
    <div ref={root} className="min-h-full overflow-x-clip bg-[#FBF8F2] text-megalit-900 antialiased">
      <style>{`
        @keyframes parkin-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .parkin-marquee { animation: parkin-marquee 32s linear infinite; }
        @media (min-width: 1024px) {
          .pay-step { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; }
          .pay-phone { position: absolute; inset: 0; }
          .pay-phone:first-child { position: relative; }
        }
        @media (prefers-reduced-motion: reduce) { .parkin-marquee { animation: none; } }
      `}</style>

      {/* Nav — seperti versi Avav */}
      <header className="sticky top-0 z-40 bg-[#FBF8F2]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bomba-700">
            <Image src="/logo.svg" alt="Logo ParkIn Palu" width={36} height={36} className="h-9 w-9" />
            <span className="font-display text-[22px] leading-none">ParkIn Palu</span>
          </Link>
          <nav aria-label="Navigasi utama" className="flex items-center gap-3 text-sm font-medium text-megalit-700 lg:gap-5 xl:gap-7">
            <a href="#cara-kerja" className="rounded-sm py-2 hover:text-bomba-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bomba-700">Cara kerja</a>
            <a href="#untuk-siapa" className="hidden rounded-sm py-2 hover:text-bomba-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bomba-700 lg:inline-flex">Untuk siapa</a>
            <a href="#tarif" className="hidden rounded-sm py-2 hover:text-bomba-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bomba-700 lg:inline-flex">Tarif</a>
            <a href="#sistem" className="hidden rounded-sm py-2 hover:text-bomba-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bomba-700 lg:inline-flex">Sistem</a>
            <a href="#tim" className="hidden rounded-sm py-2 hover:text-bomba-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bomba-700 lg:inline-flex">Tim</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden min-h-11 items-center gap-1.5 rounded-md bg-white px-4 py-2 text-sm font-semibold transition hover:bg-megalit-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bomba-700 sm:inline-flex"
            >
              <LogIn size={16} /> Masuk Dashboard
            </Link>
            <a
              href={DRIVE_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Unduh aplikasi ParkIn"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-md bg-bomba-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-bomba-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:translate-y-px"
            >
              <Download size={16} aria-hidden="true" /> <span className="hidden sm:inline">Unduh Aplikasi</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero — karcis digital yang hidup */}
      <section id="hero" className="overflow-hidden bg-megalit-900 text-[#FBF8F2]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-12 lg:items-center lg:gap-8 lg:pt-20">
          <div className="lg:col-span-7">
            <h1 className="hero-el max-w-[12ch] font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.94] tracking-[-0.035em]">
              Parkir di Palu,
              <br />
              tanpa uang pas.
            </h1>
            <p className="hero-el mt-6 max-w-[56ch] text-base leading-relaxed text-white/85 sm:text-lg">
              ParkIn menggantikan karcis dan uang tunai dengan scan QR.
              Tarifnya terkunci sesuai aturan, pembayarannya tercatat,
              dan Dishub bisa memantaunya langsung, bukan sebulan kemudian.
            </p>
            <div className="hero-el mt-8 flex flex-wrap gap-3">
              <a
                href="#cara-kerja"
                className="inline-flex min-h-12 items-center gap-2 rounded-md bg-bomba-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-bomba-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:translate-y-px"
              >
                Lihat cara kerja <ArrowRight size={16} />
              </a>
              <a
                href={DRIVE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-megalit-900 transition hover:bg-megalit-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:translate-y-px"
              >
                <Download size={16} /> Unduh APK di stan
              </a>
            </div>
            <p className="hero-el mt-7 max-w-[56ch] text-sm leading-relaxed text-white/70">
              Pameran Fakultas Teknik, Jurusan Teknologi Informasi, Universitas Tadulako.
            </p>
          </div>

          {/* Karcis: coba sendiri tarifnya, lihat QR-nya berdetak */}
          <div className="hero-el relative lg:col-span-5">
            <div className="hero-phone-main relative mx-auto max-w-[360px]">
              <div className="overflow-hidden rounded-xl bg-white text-megalit-900">
                <div className="flex items-center justify-between border-b border-dashed border-megalit-300 px-5 py-3">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-megalit-600">Karcis digital · contoh</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teluk-600">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-teluk-600" aria-hidden="true" />
                    QR hidup
                  </span>
                </div>
                <div className="px-5 pt-5">
                  <div className="flex gap-2" role="group" aria-label="Pilih kendaraan untuk melihat tarif">
                    {(Object.keys(TARIFF) as Vehicle[]).map((key) => (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={vehicle === key}
                        onClick={() => setVehicle(key)}
                        className={
                          vehicle === key
                            ? "min-h-11 flex-1 rounded-md bg-megalit-900 px-4 py-2.5 text-sm font-semibold text-white"
                            : "min-h-11 flex-1 rounded-md bg-megalit-100 px-4 py-2.5 text-sm font-semibold hover:bg-megalit-200"
                        }
                      >
                        {TARIFF[key].label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-5 text-center font-display text-6xl leading-none" aria-live="polite">
                    {TARIFF[vehicle].price}
                  </p>
                  <p className="mt-2 text-center text-sm text-megalit-600">{TARIFF[vehicle].desc}</p>
                  <div className="mt-4 flex justify-center">
                    <span className="inline-flex -rotate-2 rounded-sm border-2 border-bomba-600 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-bomba-700">
                      Terkunci · Perwali 9/2016
                    </span>
                  </div>
                </div>
                <div className="mt-5 border-t border-dashed border-megalit-300 px-5 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-megalit-600">QR petugas berganti dalam</p>
                      <p className="mt-0.5 font-mono text-2xl font-bold tabular-nums" aria-live="off">{qrClock}</p>
                      <div className="mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-megalit-100" aria-hidden="true">
                        <div className="h-full bg-teluk-600 transition-[width] duration-1000 ease-linear" style={{ width: `${(qrSeconds / 240) * 100}%` }} />
                      </div>
                    </div>
                    <figure className="w-[92px] shrink-0 overflow-hidden rounded-md bg-megalit-50 p-1">
                      <Image
                        src="/landing/mobile-petugas-qr.jpg"
                        alt="QR Code Parkir petugas ParkIn, contoh yang sudah kedaluwarsa"
                        width={1080}
                        height={2210}
                        className="h-auto w-full"
                      />
                    </figure>
                  </div>
                </div>
              </div>
              <p className="mx-auto mt-5 max-w-sm text-center text-sm leading-relaxed text-white/75">
                QR di karcis ini contoh dan sudah kedaluwarsa, jangan dipindai.
                QR asli berubah tiap 4 menit, seperti timer di atas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee — satu garis, satu-satunya yang bergerak tanpa henti */}
      <div className="overflow-hidden border-y border-megalit-900 bg-bomba-600 py-3 text-white" aria-hidden="true">
        <div className="parkin-marquee flex w-max whitespace-nowrap font-display text-lg tracking-wide">
          <span className="pr-2">{MARQUEE.repeat(3)}</span>
          <span className="pr-2">{MARQUEE.repeat(3)}</span>
        </div>
      </div>

      {/* Masalah — editorial, angka besar, bukan checklist */}
      <section className="bg-megalit-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="max-w-3xl">
            <h2 className="reveal font-display text-4xl leading-tight sm:text-[2.75rem]">
              Parkir di Palu hari ini masih serba manual.
            </h2>
            <p className="reveal mt-4 max-w-[52ch] leading-relaxed text-megalit-600">
              Itu yang ditemukan tim saat observasi bersama Dinas
              Perhubungan Kota Palu. Masalah itulah yang coba diselesaikan ParkIn.
            </p>
          </div>
          <ol className="mt-12">
            {[
              {
                n: "01",
                title: "Juru parkir tidak terdata",
                body: "Masih ada titik parkir liar dan juru parkir yang belum terdaftar resmi, jadi sulit diawasi.",
              },
              {
                n: "02",
                title: "Tarif tidak selalu sesuai aturan",
                body: "Bayar tunai di lapangan kadang berbeda dari tarif resmi, tanpa karcis sebagai bukti.",
              },
              {
                n: "03",
                title: "Tidak ada catatan yang rapi",
                body: "Jumlah kendaraan dan pendapatan tidak tercatat terstruktur, jadi sulit diketahui secara akurat setiap hari.",
              },
              {
                n: "04",
                title: "Laporan datang sebulan sekali",
                body: "Juru parkir resmi melapor ke Dishub sebulan sekali, datang langsung ke kantor. Monitoring jadi tertinggal.",
              },
            ].map((item) => (
              <li
                key={item.n}
                className="reveal group grid gap-2 border-t border-megalit-300 py-7 transition-colors last:border-b hover:bg-white sm:grid-cols-12 sm:items-baseline sm:gap-6"
              >
                <span className="font-display text-5xl leading-none text-bomba-600 transition-transform duration-300 group-hover:-translate-y-1 sm:col-span-2 sm:text-6xl">
                  {item.n}
                </span>
                <h3 className="text-xl font-bold sm:col-span-4">{item.title}</h3>
                <p className="max-w-[58ch] leading-relaxed text-megalit-600 sm:col-span-6">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Cara kerja — cerita bayar yang di-pin, layar HP berganti mengikuti scroll */}
      <section id="cara-kerja" className="scroll-mt-20 overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 lg:min-h-screen lg:pb-0 lg:pt-20">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teluk-600">Cara kerja · 30 detik di lapangan</p>
            <h2 className="mt-3 font-display text-4xl leading-tight sm:text-[2.75rem]">
              Satu scan. Bukan satu formulir.
            </h2>
            <p className="mt-3 max-w-[58ch] leading-relaxed text-megalit-600">
              Scroll ke bawah — setiap langkah mengganti layar HP di samping.
              Di HP, keempat langkah tampil berurutan.
            </p>
          </div>

          <div className="mt-10 grid gap-10 lg:mt-4 lg:grid-cols-12 lg:gap-8">
            <div className="space-y-12 lg:relative lg:col-span-7 lg:min-h-[560px] lg:space-y-0">
              {PAY_STEPS.map((step) => (
                <article key={step.n} className="pay-step">
                  <p className="font-display text-6xl leading-none text-bomba-500/90 sm:text-7xl">{step.n}</p>
                  <h3 className="mt-4 max-w-[18ch] text-2xl font-bold leading-snug sm:text-3xl">{step.title}</h3>
                  <p className="mt-3 max-w-[56ch] leading-relaxed text-megalit-600">{step.body}</p>
                  <figure className="mx-auto mt-6 w-full max-w-[280px] lg:hidden">
                    <div className="overflow-hidden rounded-xl bg-megalit-50 p-1">
                      <Image src={step.image} alt={step.imageAlt} width={330} height={407} className="h-auto w-full" />
                    </div>
                    <figcaption className="mt-3 text-center text-sm leading-relaxed text-megalit-600">
                      {step.imageCaption}
                    </figcaption>
                  </figure>
                </article>
              ))}
            </div>

            <div className="hidden lg:col-span-5 lg:block">
              <div className="relative mx-auto w-[300px] xl:w-[330px]">
                {PAY_STEPS.map((step) => (
                  <figure key={step.n} className="pay-phone">
                    <div className="overflow-hidden rounded-2xl bg-megalit-50 p-1.5 shadow-[0_24px_60px_-24px_rgba(43,34,24,0.45)]">
                      <Image src={step.image} alt={step.imageAlt} width={330} height={407} className="h-auto w-full" />
                    </div>
                    <figcaption className="mt-4 text-center text-sm leading-relaxed text-megalit-600">
                      {step.imageCaption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Untuk siapa — tiga kartu yang menumpuk saat di-scroll */}
      <section id="untuk-siapa" className="scroll-mt-20 bg-megalit-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="max-w-3xl">
            <h2 className="reveal font-display text-4xl leading-tight sm:text-[2.75rem]">
              Satu sistem, tiga layar yang saling terhubung.
            </h2>
            <p className="reveal mt-3 max-w-[62ch] leading-relaxed text-megalit-600">
              Scroll — tiap peran menumpuk di atas yang sebelumnya. Tidak ada
              yang disembunyikan di balik tab.
            </p>
          </div>

          <div className="mt-12 space-y-6">
            {(Object.keys(ROLES) as Role[]).map((key, i) => {
              const item = ROLES[key];
              const dark = key === "dishub";
              return (
                <article
                  key={key}
                  className={
                    dark
                      ? "sticky top-20 overflow-hidden rounded-xl bg-megalit-900 text-[#FBF8F2]"
                      : "sticky top-20 overflow-hidden rounded-xl bg-white"
                  }
                >
                  <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-12 lg:items-center">
                    <div className="lg:col-span-6">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-bomba-600">
                        0{i + 1} · {item.label}
                      </p>
                      <h3 className="mt-3 text-2xl font-bold leading-snug sm:text-3xl">{item.title}</h3>
                      <p className={`mt-3 max-w-[56ch] leading-relaxed ${dark ? "text-white/80" : "text-megalit-600"}`}>
                        {item.desc}
                      </p>
                      <ul className="mt-6 space-y-3">
                        {item.points.map((point) => (
                          <li key={point} className="flex gap-3">
                            <Check size={18} className="mt-0.5 shrink-0 text-teluk-600" strokeWidth={3} />
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <figure className={item.wide ? "lg:col-span-6" : "mx-auto w-full max-w-[320px] lg:col-span-6"}>
                      <div className={`overflow-hidden rounded-lg p-1 ${dark ? "bg-white" : "bg-megalit-50"}`}>
                        <Image
                          src={item.image}
                          alt={item.imageAlt}
                          width={item.wide ? 1854 : 1080}
                          height={item.wide ? 931 : 2210}
                          className="h-auto w-full"
                        />
                      </div>
                      <figcaption className={`mt-3 text-center text-sm leading-relaxed ${dark ? "text-white/75" : "text-megalit-600"}`}>
                        {item.imageCaption}
                      </figcaption>
                    </figure>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tarif — interaktif, harga yang sama dengan karcis di hero */}
      <section id="tarif" className="scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="reveal font-display text-4xl leading-tight sm:text-[2.75rem]">
                Tarifnya jelas sebelum bayar. Bukan sesudahnya.
              </h2>
              <p className="reveal mt-4 max-w-[52ch] leading-relaxed text-megalit-600">
                Tarif mengikuti Peraturan Walikota Palu Nomor 9 Tahun 2016
                tentang Perubahan Tarif Retribusi Parkir di Tepi Jalan Umum.
                Sistem yang mengunci tarifnya, bukan orang di lapangan.
              </p>
              <p className="reveal mt-4 max-w-[52ch] text-sm leading-relaxed text-megalit-600">
                Sebelum aturan ini, tarifnya motor Rp1.000 dan mobil Rp2.000.
                Top up saldo tidak ada biaya tersembunyi: nominal yang dipilih,
                itulah yang masuk.
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="reveal rounded-xl bg-megalit-900 p-7 text-[#FBF8F2] sm:p-10">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-2" role="group" aria-label="Pilih kendaraan untuk melihat tarif">
                    {(Object.keys(TARIFF) as Vehicle[]).map((key) => (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={vehicle === key}
                        onClick={() => setVehicle(key)}
                        className={
                          vehicle === key
                            ? "min-h-11 rounded-md bg-bomba-600 px-5 py-2.5 text-sm font-semibold text-white"
                            : "min-h-11 rounded-md bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
                        }
                      >
                        {TARIFF[key].label}
                      </button>
                    ))}
                  </div>
                  <span className="inline-flex -rotate-2 rounded-sm border-2 border-bomba-500 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-bomba-500">
                    Terkunci · Perwali 9/2016
                  </span>
                </div>
                <p id="tarif-price" key={vehicle} className="mt-8 font-display text-[clamp(4rem,12vw,7rem)] leading-none">
                  {TARIFF[vehicle].price}
                </p>
                <p className="mt-3 text-white/80">{TARIFF[vehicle].desc}</p>
                <div className="mt-8 flex flex-wrap gap-2" aria-label="Nominal top up">
                  {["Rp10.000", "Rp20.000", "Rp50.000", "Rp100.000"].map((n) => (
                    <span key={n} className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold">
                      {n}
                    </span>
                  ))}
                  <span className="rounded-md bg-white/10 px-4 py-2 text-sm text-white/80">atau nominal sendiri, min. Rp10.000</span>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-white/70">
                  Top up lewat Midtrans. Saldo yang masuk sama dengan nominal yang dipilih.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sistem / dashboard */}
      <section id="sistem" className="scroll-mt-20 bg-megalit-900 text-[#FBF8F2]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="reveal max-w-3xl font-display text-4xl leading-tight sm:text-[2.75rem]">
            Di balik layar yang sederhana, ada satu sistem yang sama.
          </h2>
          <p className="reveal mt-4 max-w-[64ch] leading-relaxed text-white/75">
            Aplikasi HP, backend, dan dashboard web bukan tiga produk yang
            terpisah. Semuanya membaca dan menulis ke tempat yang sama.
          </p>

          <ol className="reveal mt-12 grid gap-x-10 gap-y-8 md:grid-cols-3">
            {[
              {
                icon: Smartphone,
                title: "Aplikasi HP",
                body: "React Native (Expo) untuk pengguna dan petugas. Android 10+.",
              },
              {
                icon: Server,
                title: "Backend",
                body: "Go + PostgreSQL. Autentikasi JWT, QR dinamis HMAC, OTP WhatsApp, top-up Midtrans.",
              },
              {
                icon: Monitor,
                title: "Dashboard web",
                body: "Next.js untuk admin Dishub: transaksi, lokasi, petugas, dan laporan.",
              },
            ].map((item) => (
              <li key={item.title} className="max-w-sm">
                <item.icon size={22} aria-hidden="true" className="text-bomba-500" />
                <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{item.body}</p>
              </li>
            ))}
          </ol>

          <figure className="reveal mt-12">
            <div className="overflow-hidden rounded-lg bg-white p-2">
              <Image
                src="/landing/report-arsitektur.jpg"
                alt="Diagram arsitektur ParkIn: aplikasi pengguna dan petugas, dashboard web, backend Go, PostgreSQL, Midtrans dan WhatsApp Gateway"
                width={1264}
                height={520}
                className="h-auto w-full"
              />
            </div>
            <figcaption className="mt-3 text-sm leading-relaxed text-white/80">
              Diagram arsitektur dari laporan capstone — HP pengguna dan petugas,
              dashboard web, backend Go + PostgreSQL, Midtrans, dan WhatsApp Gateway.
            </figcaption>
          </figure>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <figure className="reveal">
              <div className="overflow-hidden rounded-lg bg-white p-1">
                <Image
                  src="/landing/web-dashboard.png"
                  alt="Dashboard web ParkIn Palu, ringkasan operasional"
                  width={1854}
                  height={931}
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-3 text-sm leading-relaxed text-white/80">
                Dashboard. Contoh data uji 30 Mei 2026: 1 transaksi, Rp4.000,
                1 mobil, 1 lokasi aktif, 1 petugas aktif.
              </figcaption>
            </figure>
            <figure className="reveal">
              <div className="overflow-hidden rounded-lg bg-white p-1">
                <Image
                  src="/landing/web-laporan.png"
                  alt="Halaman laporan ParkIn Palu, pendapatan per hari dan per lokasi"
                  width={1854}
                  height={931}
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-3 text-sm leading-relaxed text-white/80">
                Laporan. Contoh data uji 30 April sampai 30 Mei 2026: 22 transaksi,
                Rp70.000, 9 motor, 13 mobil, 2 lokasi aktif (perdos dan PGM).
                Bukan angka skala kota.
              </figcaption>
            </figure>
          </div>

          <figure className="reveal mt-6">
            <div className="overflow-hidden rounded-lg bg-white p-1">
              <Image
                src="/landing/web-detail-petugas.png"
                alt="Detail petugas ParkIn Palu di dashboard web"
                width={1854}
                height={931}
                className="h-auto w-full"
              />
            </div>
            <figcaption className="mt-3 text-sm leading-relaxed text-white/80">
              Detail petugas, contoh: ID PK-A0000000, lokasi perdos,
              21 transaksi ditangani dalam 2 hari bertugas (data contoh).
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Tim + penutup */}
      <section id="tim" className="scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <h2 className="reveal font-display text-4xl leading-tight sm:text-[2.75rem]">
                Dibangun tim capstone dari Palu, untuk Palu.
              </h2>
              <p className="reveal mt-4 max-w-[56ch] leading-relaxed text-megalit-600">
                ParkIn adalah Capstone Project Jurusan Teknologi Informasi,
                Fakultas Teknik, Universitas Tadulako, dibuat bersama Dinas
                Perhubungan Kota Palu, berdasarkan observasi lapangan.
              </p>
              <ul className="reveal mt-8 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                {TEAM.map((name) => (
                  <li key={name} className="text-sm font-semibold">{name}</li>
                ))}
              </ul>
              <p className="reveal mt-5 text-sm text-megalit-600">
                Dosen pembimbing: <strong className="text-megalit-900">Ir. Yusuf Anshori, S.T., M.T.</strong>
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="reveal rounded-xl bg-bomba-600 p-8 text-white sm:p-10">
                <h3 className="font-display text-3xl leading-tight">Coba langsung di stan pameran.</h3>
                <p className="mt-3 max-w-[52ch] leading-relaxed text-white/90">
                  Aplikasi demonya ada di HP stan. Scan, bayar, dan lihat
                  transaksinya langsung masuk ke dashboard.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href={DRIVE_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-bomba-700 transition hover:bg-bomba-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:translate-y-px"
                  >
                    <Download size={16} /> Unduh APK (Drive)
                  </a>
                  <Link
                    href="/login"
                    className="inline-flex min-h-12 items-center gap-2 rounded-md bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:translate-y-px"
                  >
                    <LogIn size={16} /> Masuk Dashboard
                  </Link>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-white/75">
                  ParkIn adalah prototipe capstone, bukan layanan resmi
                  Dishub Kota Palu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer — seperti versi Avav */}
      <footer className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <Image src="/logo.svg" alt="Logo ParkIn Palu" width={32} height={32} className="h-8 w-8" />
              <span className="font-display text-xl">ParkIn Palu</span>
            </div>
            <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-megalit-600">
              Aplikasi parkir digital berbasis QR Code. Jurusan Teknologi
              Informasi, Fakultas Teknik, Universitas Tadulako, 2026.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 text-sm">
            <div>
              <p className="font-bold">Produk</p>
              <ul className="mt-3 space-y-2 text-megalit-600">
                <li><a href="#cara-kerja" className="hover:text-bomba-600">Cara kerja</a></li>
                <li><a href="#tarif" className="hover:text-bomba-600">Tarif</a></li>
                <li><Link href="/login" className="hover:text-bomba-600">Dashboard admin</Link></li>
                <li><a href={DRIVE_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-bomba-600">Unduh APK <ArrowUpRight size={14} /></a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-megalit-50">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-4 text-sm text-megalit-600 sm:px-6">
            <span className="inline-flex items-center gap-1.5"><MapPin size={13} /> Kota Palu, Sulawesi Tengah</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5"><Users size={13} /> Tim Capstone Orang Jago</span>
            <span aria-hidden="true">·</span>
            <span>Tarif: Perwali Palu No. 9/2016</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
