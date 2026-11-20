import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-megalit-50 px-4 py-12">
      <Image
        src="/logo.svg"
        alt=""
        width={1800}
        height={1800}
        aria-hidden
        priority
        className="pointer-events-none absolute right-[-30vw] top-1/2 h-[70vw] w-[70vw] -translate-y-1/2 select-none opacity-30 rotate-12 blur-sm sm:right-[-26vw] sm:h-[80vw] sm:w-[80vw] sm:opacity-40 md:max-h-480 md:max-w-480"
      />
      <div className="relative z-10 flex w-full flex-col items-center justify-center">{children}</div>
    </div>
  );
}
