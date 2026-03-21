import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Solution from "@/models/Solution";
import Problem from "@/models/Problem";
import { evaluateWithAI } from "@/lib/evaluateWithAI";
import { mockDB } from "@/lib/mockDB";

// POST /api/company/submit-solution
export async function POST(request) {
  try {
    const origin = request.headers.get("origin") || request.nextUrl.origin;
    
    // Parse incoming request payload
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
    
    // MOCKED DATABASE FLOW FOR SHOWCASE TO AVOID ECONNREFUSED
    const solutionId = "mock_sol_" + Date.now();
    
    const aiScores = await evaluateWithAI(
      "Sample Problem Title", 
      solutionId, 
      solutionText, 
      origin
    );
    
    const updatedSolution = {
      _id: solutionId,
      problem: problemId,
      student: studentId,
      studentName,
      studentEmail,
      solutionText,
      repoUrl: repoUrl || "",
      demoUrl: demoUrl || "",
      techStack: techStack || [],
      aiScore: aiScores?.finalScore || 0,
      aiFeedback: aiScores ? JSON.stringify(aiScores) : "Evaluation complete",
      createdAt: new Date().toISOString()
    };

    // Save to active mock memory so the company dashboard sees it instantly
    mockDB.solutions.push(updatedSolution);
    
    // Increment problem mock counter live
    const problem = mockDB.problems.find(p => String(p._id) === String(problemId));
    if (problem) {
      problem.solutionCount = (problem.solutionCount || 0) + 1;
    }

    return NextResponse.json(
      { message: "Solution submitted successfully.", solution: updatedSolution },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
