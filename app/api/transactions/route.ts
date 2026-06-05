import { NextRequest, NextResponse } from "next/server";
import { getTransactionList } from "@/lib/transactions/get-transactions";
import {
	parseTransactionFilters,
	parseTransactionPage,
} from "@/lib/transactions/search-params";

export async function GET(request: NextRequest) {
	const sp: Record<string, string> = {};
	request.nextUrl.searchParams.forEach((value, key) => {
		sp[key] = value;
	});

	const filters = parseTransactionFilters(sp);
	const page = parseTransactionPage(sp);

	try {
		const result = await getTransactionList(filters, page);
		return NextResponse.json(result);
	} catch (error) {
		console.error("[API /api/transactions]", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Gagal memuat data transaksi.",
			},
			{ status: 500 },
		);
	}
}
