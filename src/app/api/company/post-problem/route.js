import { NextResponse } from "next/server";
import { mockDB } from "@/lib/mockDB";

// POST /api/company/post-problem
export async function POST(request) {
  try {
    const { title, description, domain, expectedOutcome, companyId, companyName } =
      await request.json();

    if (!title || !description || !domain || !expectedOutcome || !companyId || !companyName) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const problem = {
      _id: "mock_" + Date.now().toString(),
      title,
      description,
      domain,
      expectedOutcome,
      company: companyId,
      companyName,
      status: "open",
      solutionCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDB.problems.push(problem);

    return NextResponse.json(
      { message: "Problem posted successfully (MOCKED).", problem },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
