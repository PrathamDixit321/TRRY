import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Solution from "@/models/Solution";
import Problem from "@/models/Problem";

// POST /api/company/submit-solution
export async function POST(request) {
  try {
    await connectDB();
    const {
      problemId,
      studentId,
      studentName,
      studentEmail,
      solutionText,
      repoUrl,
      demoUrl,
      techStack,
    } = await request.json();

    if (!problemId || !studentId || !studentName || !solutionText) {
      return NextResponse.json(
        { error: "Problem ID, student info, and solution text are required." },
        { status: 400 }
      );
    }

    // Simple AI score simulation (0–100 based on solution length & keywords)
    const keywords = ["algorithm", "optimize", "machine learning", "api", "database", "scalable", "cloud", "microservice", "neural", "model", "pipeline", "architecture", "integration", "automation", "web3", "blockchain"];
    const text = solutionText.toLowerCase();
    const matchCount = keywords.filter((k) => text.includes(k)).length;
    const lengthScore = Math.min(solutionText.length / 50, 40);
    const keywordScore = matchCount * 5;
    const aiScore = Math.min(Math.round(lengthScore + keywordScore + Math.random() * 20), 100);

    const solution = await Solution.create({
      problem: problemId,
      student: studentId,
      studentName,
      studentEmail,
      solutionText,
      repoUrl: repoUrl || "",
      demoUrl: demoUrl || "",
      techStack: techStack || [],
      aiScore,
      aiFeedback: `AI evaluated your solution as ${aiScore >= 80 ? "excellent" : aiScore >= 60 ? "good" : aiScore >= 40 ? "average" : "needs improvement"}. Score: ${aiScore}/100`,
    });

    // Increment solution count on the problem
    await Problem.findByIdAndUpdate(problemId, { $inc: { solutionCount: 1 } });

    return NextResponse.json(
      { message: "Solution submitted successfully.", solution },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
