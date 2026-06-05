import { NextResponse } from "next/server";
import { getTransactionFilterOptions } from "@/lib/transactions/get-transactions";

export async function GET() {
	try {
		const result = await getTransactionFilterOptions();
		return NextResponse.json(result);
	} catch (error) {
		console.error("[API /api/transactions/filter-options]", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Gagal memuat opsi filter.",
			},
			{ status: 500 },
		);
	}
}
