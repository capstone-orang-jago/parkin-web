import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Masuk",
};

function LoginFallback() {
  return (
    <div className="w-full max-w-md rounded-lg border border-megalit-200 bg-(--color-surface-card) p-8 shadow-sm">
      <p className="text-sm text-megalit-600">Memuat…</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
