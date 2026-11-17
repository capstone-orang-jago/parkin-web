"use client";

import { useLayoutEffect, useRef, useState } from "react";
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
  QrCode,
  Server,
  ShieldCheck,
  Smartphone,
  Users,
  Wallet,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ENERGY 2 / RHYTHM 2 / MOTION 1: the live QR and real product screens carry ParkIn's identity.

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

export default function Landing() {
  const root = useRef<HTMLDivElement>(null);
  const [role, setRole] = useState<Role>("pengguna");

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

      gsap.to("#flow-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "#cara-kerja",
          start: "top 70%",
          end: "bottom 60%",
          scrub: 0.6,
        },
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
    }, root);
    return () => ctx.revert();
  }, []);

  const active = ROLES[role];

  return (
    <div ref={root} className="min-h-full overflow-x-clip bg-[#FBF8F2] text-megalit-900 antialiased">
      {/* Nav */}
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

      {/* Hero */}
      <section id="hero" className="overflow-hidden bg-megalit-900 text-[#FBF8F2]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-12 lg:items-center lg:gap-8 lg:pt-20">
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
            <dl className="hero-el mt-10 grid max-w-xl grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-semibold text-white/70">Tarif resmi</dt>
                <dd className="mt-1 text-sm font-bold">Motor Rp2.000 · Mobil Rp4.000</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-white/70">QR petugas</dt>
                <dd className="mt-1 text-sm font-bold">Berubah tiap 4 menit</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-white/70">Pengawasan</dt>
                <dd className="mt-1 text-sm font-bold">Dashboard Dishub real-time</dd>
              </div>
            </dl>
          </div>

          <div className="relative lg:col-span-5">
            <div className="hero-phone-main relative mx-auto w-[280px] sm:w-[320px]">
              <figure className="overflow-hidden rounded-2xl bg-white p-2 sm:p-3">
                <Image
                  src="/landing/mobile-pengguna-home.jpg"
                  alt="Beranda aplikasi ParkIn untuk pengguna, saldo Rp59.000"
                  width={1080}
                  height={2210}
                  priority
                  className="h-auto w-full"
                />
              </figure>
              <figure className="absolute -left-16 top-24 hidden w-[180px] overflow-hidden rounded-xl bg-white p-1 sm:block lg:-left-20">
                <Image
                  src="/landing/mobile-petugas-qr.jpg"
                  alt="QR Code Parkir petugas ParkIn"
                  width={1080}
                  height={2210}
                  className="h-auto w-full"
                />
              </figure>
            </div>
            <p className="mx-auto mt-5 max-w-sm text-center text-sm leading-relaxed text-white/75">
              Tampilan asli aplikasi. QR di gambar adalah contoh dan sudah
              kedaluwarsa, jangan dipindai. QR asli berubah tiap 4 menit.
            </p>
          </div>
        </div>
      </section>

      {/* Masalah */}
      <section className="bg-megalit-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-4">
            <h2 className="reveal font-display text-4xl leading-tight sm:text-[2.75rem]">
              Parkir di Palu hari ini masih serba manual.
            </h2>
            <p className="reveal mt-4 max-w-[52ch] leading-relaxed text-megalit-600">
              Itu yang ditemukan tim saat observasi bersama Dinas
              Perhubungan Kota Palu. Masalah itulah yang coba diselesaikan ParkIn.
            </p>
          </div>
          <ul className="space-y-7 lg:col-span-8">
            {[
              {
                title: "Juru parkir tidak terdata",
                body: "Masih ada titik parkir liar dan juru parkir yang belum terdaftar resmi, jadi sulit diawasi.",
              },
              {
                title: "Tarif tidak selalu sesuai aturan",
              body: "Bayar tunai di lapangan kadang berbeda dari tarif resmi, tanpa karcis sebagai bukti.",
              },
              {
                title: "Tidak ada catatan yang rapi",
                body: "Jumlah kendaraan dan pendapatan tidak tercatat terstruktur, jadi sulit diketahui secara akurat setiap hari.",
              },
              {
                title: "Laporan datang sebulan sekali",
                body: "Juru parkir resmi melapor ke Dishub sebulan sekali, datang langsung ke kantor. Monitoring jadi tertinggal.",
              },
            ].map((item) => (
              <li
                key={item.title}
                className="reveal flex gap-4"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-bomba-600 text-white">
                  <Check size={15} strokeWidth={3} />
                </span>
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-1 max-w-[62ch] text-sm leading-relaxed text-megalit-600">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cara kerja */}
      <section id="cara-kerja" className="scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="reveal max-w-2xl font-display text-4xl leading-tight sm:text-[2.75rem]">
            Tiga langkah. Tidak ada uang pas, tidak ada karcis hilang.
          </h2>
          <div className="relative mt-7 h-1 overflow-hidden rounded-full bg-megalit-200" aria-hidden="true">
            <div id="flow-progress" className="h-full w-full origin-left scale-x-0 bg-bomba-500" />
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-12">
            <ol className="space-y-8 lg:col-span-7">
              {[
                {
                  icon: Wallet,
                  title: "Isi saldo dulu",
                  body: "Top up lewat Midtrans, mulai Rp10.000. Pilih Rp10.000, Rp20.000, Rp50.000, Rp100.000, atau nominal sendiri. Saldo langsung terlihat di Beranda.",
                },
                {
                  icon: QrCode,
                  title: "Scan QR petugas",
                  body: "Pilih motor atau mobil, lalu arahkan kamera ke QR yang ditampilkan petugas. Tarif terkunci di layar: motor Rp2.000, mobil Rp4.000.",
                },
                {
                  icon: ShieldCheck,
                  title: "Bayar, dan semuanya tercatat",
                  body: "Saldo terpotong, struk dan riwayat tersimpan di HP pengguna. Di saat yang sama, petugas melihat rekap hariannya dan Dishub melihat transaksi itu masuk ke dashboard.",
                },
              ].map((step) => (
                <li key={step.title} className="reveal flex gap-5">
                  <div className="flex flex-col items-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-md bg-bomba-600 text-white">
                      <step.icon size={22} />
                    </span>
                  </div>
                  <div className="max-w-2xl pb-7">
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="mt-2 max-w-[62ch] leading-relaxed text-megalit-600">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="lg:col-span-5">
              <figure className="reveal mx-auto max-w-[360px] overflow-hidden rounded-2xl bg-white p-2">
                <Image
                  src="/landing/mobile-petugas-qr.jpg"
                  alt="QR Code Parkir petugas ParkIn yang berlaku hingga 22:14"
                  width={1080}
                  height={2210}
                  className="mx-auto h-auto w-full max-w-[340px]"
                />
              </figure>
              <p className="mt-4 text-center text-sm leading-relaxed text-megalit-600">
                QR petugas diperbarui otomatis tiap 4 menit, dengan tanda
                tangan keamanan (HMAC), jadi QR yang difoto kemarin tidak
                bisa dipakai lagi hari ini.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Untuk siapa */}
      <section id="untuk-siapa" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="reveal max-w-2xl font-display text-4xl leading-tight sm:text-[2.75rem]">
            Satu sistem, tiga layar yang saling terhubung.
          </h2>
          <p className="reveal mt-3 max-w-[62ch] leading-relaxed text-megalit-600">
            Pilih perannya untuk melihat apa yang didapat masing-masing pihak.
          </p>

          <div className="reveal mt-8 flex flex-wrap gap-2" role="group" aria-label="Pilih peran untuk melihat alur ParkIn">
            {(Object.keys(ROLES) as Role[]).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={role === key}
                onClick={() => setRole(key)}
                className={
                  role === key
                    ? "min-h-11 rounded-md bg-megalit-900 px-5 py-2.5 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bomba-700"
                    : "min-h-11 rounded-md bg-megalit-100 px-5 py-2.5 text-sm font-semibold hover:bg-megalit-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bomba-700"
                }
              >
                {ROLES[key].label}
              </button>
            ))}
          </div>

          <div className="mt-10 grid items-start gap-10 lg:grid-cols-12" key={role} aria-live="polite">
            <div className="lg:col-span-6">
              <h3 className="text-2xl font-bold leading-snug">{active.title}</h3>
              <p className="mt-3 max-w-[58ch] leading-relaxed text-megalit-600">{active.desc}</p>
              <ul className="mt-6 space-y-3">
                {active.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <Check size={18} className="mt-0.5 shrink-0 text-teluk-600" strokeWidth={3} />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <figure className={active.wide ? "lg:col-span-6" : "mx-auto w-full max-w-[340px] lg:col-span-6"}>
              <div className="overflow-hidden rounded-xl bg-megalit-50 p-1">
                <Image
                  src={active.image}
                  alt={active.imageAlt}
                  width={active.wide ? 1854 : 1080}
                  height={active.wide ? 931 : 2210}
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-3 text-center text-sm leading-relaxed text-megalit-600">
                {active.imageCaption}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Tarif */}
      <section id="tarif" className="scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-12">
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
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              <article className="reveal rounded-xl bg-megalit-50 p-7">
                <p className="flex items-center gap-2 text-sm font-bold text-teluk-600">
                  <Smartphone size={18} /> Motor
                </p>
                <p className="mt-4 font-display text-5xl">Rp2.000</p>
                <p className="mt-2 text-sm text-megalit-600">Sepeda motor &amp; sejenisnya, per sekali parkir.</p>
              </article>
              <article className="reveal rounded-xl bg-bomba-600 p-7 text-white">
                <p className="flex items-center gap-2 text-sm font-bold text-white/90">
                  <Monitor size={18} /> Mobil
                </p>
                <p className="mt-4 font-display text-5xl">Rp4.000</p>
                <p className="mt-2 text-sm text-white/85">Mobil, SUV &amp; sejenisnya, per sekali parkir.</p>
              </article>
              <p className="reveal text-sm leading-relaxed text-megalit-600 sm:col-span-2">
                Top up: Rp10.000 · Rp20.000 · Rp50.000 · Rp100.000, atau nominal
                sendiri (minimal Rp10.000), lewat Midtrans.
              </p>
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

      {/* Footer */}
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
