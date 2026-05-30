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
        className="pointer-events-none absolute right-[-26vw] top-1/2 h-[80vw] w-[80vw] max-h-480 max-w-480 -translate-y-1/2 select-none opacity-40 rotate-12 blur-sm"
      />
      <div className="relative z-10 flex w-full flex-col items-center justify-center">{children}</div>
    </div>
  );
}
