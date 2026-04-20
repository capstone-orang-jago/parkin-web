import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBreadcrumb } from "@/components/shell/page-breadcrumb";
import { TransactionDetailView } from "@/components/transactions/transaction-detail-view";
import { getTransactionDetail } from "@/lib/transactions/get-transactions";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tx = await getTransactionDetail(id);
  return {
    title: tx ? `Transaksi ${tx.code}` : "Transaksi",
  };
}

export default async function TransaksiDetailPage({ params }: Props) {
  const { id } = await params;
  const tx = await getTransactionDetail(id);
  if (!tx) {
    notFound();
  }

  return (
    <section>
      <PageBreadcrumb
        items={[{ label: "Transaksi", href: "/transaksi" }, { label: tx.code }]}
      />
      <TransactionDetailView tx={tx} />
    </section>
  );
}
