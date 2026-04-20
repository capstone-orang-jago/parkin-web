import { redirect } from "next/navigation";

/** Fallback jika middleware tidak dijalankan; middleware mengarahkan `/` ke dashboard atau login. */
export default function Home() {
  redirect("/login");
}
