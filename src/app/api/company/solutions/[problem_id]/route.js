import { NextResponse } from "next/server";
import { mockDB } from "@/lib/mockDB";

// GET /api/company/solutions/[problem_id]
export async function GET(request, { params }) {
  try {
    const { problem_id } = await params;
    if (!problem_id) {
      return NextResponse.json({ error: "Missing problem ID" }, { status: 400 });
    }

    const solutions = mockDB.solutions.filter((s) => String(s.problem) === String(problem_id)).sort((a,b) => b.aiScore - a.aiScore);
    return NextResponse.json({ solutions });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
