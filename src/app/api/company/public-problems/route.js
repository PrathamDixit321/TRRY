import { NextResponse } from "next/server";
import { mockDB } from "@/lib/mockDB";

// GET /api/company/public-problems  — lists all open problems for students
export async function GET() {
  try {
    const problems = mockDB.problems.filter((p) => p.status === "open").sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    return NextResponse.json({ problems });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
