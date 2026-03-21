import { NextResponse } from "next/server";
import { mockDB } from "@/lib/mockDB";

// GET /api/company/problems?companyId=xxx
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json(
        { error: "companyId is required." },
        { status: 400 }
      );
    }

    const problems = mockDB.problems
      .filter((p) => String(p.company) === String(companyId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ problems });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
