import { NextResponse } from "next/server";
import { evaluate } from "@/lib/aiEvaluator";

export async function POST(request) {
  try {
    const body = await request.json();
    const { problem, solution } = body;
    
    if (!solution) {
      return NextResponse.json(
        { error: "Solution is required for evaluation." },
        { status: 400 }
      );
    }

    const result = await evaluate(problem || "Unknown Problem", solution);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error("AI Evaluation API Error:", error);
    return NextResponse.json({
      innovation: 15,
      feasibility: 15,
      clarity: 15,
      marketPotential: 15,
      finalScore: 60,
      summary: "Evaluated using safe fallback.",
      reasoning: "The model defaulted to a stable baseline response due to an internal server timeout or format issue."
    }, { status: 200 });
  }
}
